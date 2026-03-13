const UserModel = require("../models/UserModel")
const bcrypt = require("bcrypt")
const { mailSend } = require("../utils/MailUtil")
const { welcomeEmailTemplate } = require("../utils/emailTemplates")

const registerUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    
    const savedUser = await UserModel.create({...req.body,password: hashedPassword})
    
    const htmlMessage = welcomeEmailTemplate(savedUser)
    
    await mailSend(savedUser.email, "Welcome to Bug Tracker", htmlMessage)
    const userObject = savedUser.toObject()
    delete userObject.password

    const existingUser = await UserModel.findOne({ email: req.body.email })

    if(existingUser){
      return res.status(400).json({
        success:false,
        message:"User with this email already exists"
      })
    }
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


const loginUser = async (req, res) => {
  try {

    const user = await UserModel.findOne({ email: req.body.email }).select("+password")

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account deactivated. Contact admin."
      })
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password)

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password"
      })
    }

    await UserModel.findByIdAndUpdate(user._id, {lastLogin: new Date()})
    const userObject = user.toObject()
    delete userObject.password

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: userObject
    })

  } 
  catch(err){
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
    })
  }
}


const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({ isActive: true })
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users
    })
  } 
  catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
    })
  }
}

const updateUser = async (req, res) => {
  try {
    delete req.body.password
    const updatedUser = await UserModel.findByIdAndUpdate( req.params.id,req.body, { new: true, runValidators: true }
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
  } 
  catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
    })
  }
}

const deleteUser = async (req, res) => {
  try {
    const user = await UserModel.findByIdAndUpdate(req.params.id,{ isActive: false, status: "deleted" },{ new: true })
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
  } 
  catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
    })
  }
}

const blockUser = async (req, res) => {
  try {
    const user = await UserModel.findByIdAndUpdate(req.params.id,{ isActive: false, status: "blocked" },{ new: true })
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
  } 
  catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
    })
  }
}

const reactivateUser = async (req, res) => {
  try {
    const user = await UserModel.findByIdAndUpdate(req.params.id,{ isActive: true, status: "active" },{ new: true })

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
  } 
  catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
    })
  }
}

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  updateUser,
  deleteUser,
  blockUser,
  reactivateUser
}