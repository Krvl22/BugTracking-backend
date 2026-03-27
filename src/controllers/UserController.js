const UserModel = require("../models/UserModel")
const bcrypt = require("bcrypt")
const { mailSend } = require("../utils/MailUtil")
const {welcomeEmailTemplate, resetPasswordTemplate} = require("../utils/EmailTemplates")
const uploadToCloudinary = require("../utils/CloudinaryUtil")
const crypto = require("crypto")
const jwt = require("jsonwebtoken")
const secret = "secret"

/* ===============================
   REGISTER USER
================================ */

const registerUser = async (req, res) => {
  try {

    const existingUser = await UserModel.findOne({ email: req.body.email })

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists"
      })
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    const savedUser = await UserModel.create({
      ...req.body,
      password: hashedPassword
    })

    const htmlMessage = welcomeEmailTemplate(savedUser)

    await mailSend(
      savedUser.email,
      "Welcome to Bug Tracker",
      htmlMessage
    )

    const userObject = savedUser.toObject()
    delete userObject.password

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: userObject
    })

  } catch (err) {

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
    })

  }
}

/* ===============================
   LOGIN USER
================================ */
const loginUser = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email })
      .select("+password")
      .populate("role", "name");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordMatched = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const userObject = user.toObject();
    delete userObject.password; 

    const token = jwt.sign(userObject, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.status(200).json({
      success: true,
      message: "Login successful",
      token:token,
      user: userObject,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};
/* ===============================
   GET ALL USERS
================================ */
const getAllUsers = async (req,res)=>{
  try{

    const users = await UserModel.find({ status: { $ne: "deleted" } })
     // .populate("role","name")
     // .populate("projects","name projectKey")
      .select("-password")
      .sort({ createdAt:-1 })

    res.status(200).json({
      success:true,
      message:"Users fetched successfully",
      data:users
    })

  }catch(err){
    res.status(500).json({
      success:false,
      message:"Internal server error",
      error:err.message
    })
  }
}


/* 
/* ===============================
   UPDATE USER
================================ */

const updateUser = async (req, res) => {
  try {

    delete req.body.password

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser
    })

  } catch (err) {

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
    })

  }
}

/* ===============================
   DELETE USER (SOFT DELETE)
================================ */

const deleteUser = async (req, res) => {
  try {

    const user = await UserModel.findByIdAndUpdate(
      req.params.id,
      { isActive: false, status: "deleted" },
      { new: true }
    )

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: user
    })

  } catch (err) {

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
    })

  }
}

/* ===============================
   BLOCK USER
================================ */

const blockUser = async (req, res) => {
  try {

    const user = await UserModel.findByIdAndUpdate(
      req.params.id,
      { isActive: false, status: "blocked" },
      { new: true }
    )

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    res.status(200).json({
      success: true,
      message: "User blocked successfully",
      data: user
    })

  } catch (err) {

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
    })

  }
}

/* ===============================
   REACTIVATE USER
================================ */

const reactivateUser = async (req, res) => {
  try {

    const user = await UserModel.findByIdAndUpdate(
      req.params.id,
      { isActive: true, status: "active" },
      { new: true }
    )

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    res.status(200).json({
      success: true,
      message: "User reactivated successfully",
      data: user
    })

  } catch (err) {

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
    })

  }
}

/* ===============================
   FORGOT PASSWORD
================================ */

const forgotpassword = async (req, res) => {
  try {

    const user = await UserModel.findOne({ email: req.body.email })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    const resetToken = crypto.randomBytes(32).toString("hex")

    user.passwordResetToken = resetToken
    user.passwordResetExpires = Date.now() + 15 * 60 * 1000

    await user.save()

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`

    const htmlMessage = resetPasswordTemplate(resetLink)

    await mailSend(
      user.email,
      "Password Reset Request",
      htmlMessage
    )

    res.status(200).json({
      success: true,
      message: "Reset link sent to email"
    })

  } catch (err) {

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message
    })

  }
}
const resetPassword = async (req, res) => {
  try {

    console.log("Token from URL:", req.params.token)

    const user = await UserModel.findOne({
      passwordResetToken: req.params.token,
      passwordResetExpires: { $gt: Date.now() }
    }).select("+password")

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token"
      })
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    user.password = hashedPassword
    user.passwordResetToken = null
    user.passwordResetExpires = null

    await user.save()

    res.status(200).json({
      success: true,
      message: "Password reset successful"
    })

  } catch (err) {

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message
    })

  }
}

const updateProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" })
    }

    const cloudinaryResponse = await uploadToCloudinary(req.file.path)

    const user = await UserModel.findByIdAndUpdate(
      req.user._id,
      { profilePic: cloudinaryResponse.secure_url },
      { new: true }
    ).select("-password")

    res.status(200).json({
      success: true,
      message: "Profile picture updated",
      data: user
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

const removeProfilePic = async (req, res) => {
  try {
    const user = await UserModel.findByIdAndUpdate(
      req.user._id,
      { profilePic: null },
      { new: true }
    ).select("-password")

    res.status(200).json({ success: true, data: user })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}
module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  updateUser,
  deleteUser,
  blockUser,
  reactivateUser,
  forgotpassword,
  resetPassword,
  updateProfilePic,
  removeProfilePic
}

