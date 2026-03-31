// const UserModel = require("../models/UserModel")
// const bcrypt = require("bcrypt")
// const { mailSend } = require("../utils/MailUtil")
// const {welcomeEmailTemplate, resetPasswordTemplate} = require("../utils/EmailTemplates")
// const uploadToCloudinary = require("../utils/CloudinaryUtil")
// const crypto = require("crypto")
// const jwt = require("jsonwebtoken")
// const secret = "secret"

// /* ===============================
//    REGISTER USER
// ================================ */

// const registerUser = async (req, res) => {
//   try {

//     const existingUser = await UserModel.findOne({ email: req.body.email })

//     if (existingUser) {
//       return res.status(409).json({
//         success: false,
//         message: "User with this email already exists"
//       })
//     }

//     const hashedPassword = await bcrypt.hash(req.body.password, 10)

//     const savedUser = await UserModel.create({
//       ...req.body,
//       password: hashedPassword
//     })

//     const htmlMessage = welcomeEmailTemplate(savedUser)

//     await mailSend(
//       savedUser.email,
//       "Welcome to Bug Tracker",
//       htmlMessage
//     )

//     const userObject = savedUser.toObject()
//     delete userObject.password

//     res.status(201).json({
//       success: true,
//       message: "User created successfully",
//       data: userObject
//     })

//   } catch (err) {

//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: err.message
//     })

//   }
// }

// /* ===============================
//    LOGIN USER
// ================================ */
// const loginUser = async (req, res) => {
//   try {
//     const user = await UserModel.findOne({ email: req.body.email })
//       .select("+password")
//       .populate("role", "name");

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     const isPasswordMatched = await bcrypt.compare(
//       req.body.password,
//       user.password
//     );

//     if (!isPasswordMatched) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid password",
//       });
//     }

//     const userObject = user.toObject();
//     delete userObject.password; 

//     const token = jwt.sign(userObject, process.env.JWT_SECRET, { expiresIn: '7d' })

//     res.status(200).json({
//       success: true,
//       message: "Login successful",
//       token:token,
//       user: userObject,
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: err.message,
//     });
//   }
// };
// /* ===============================
//    GET ALL USERS
// ================================ */
// const getAllUsers = async (req,res)=>{
//   try{

//     const users = await UserModel.find({ status: { $ne: "deleted" } })
//      // .populate("role","name")
//      // .populate("projects","name projectKey")
//       .select("-password")
//       .sort({ createdAt:-1 })

//     res.status(200).json({
//       success:true,
//       message:"Users fetched successfully",
//       data:users
//     })

//   }catch(err){
//     res.status(500).json({
//       success:false,
//       message:"Internal server error",
//       error:err.message
//     })
//   }
// }


// /* 
// /* ===============================
//    UPDATE USER
// ================================ */

// const updateUser = async (req, res) => {
//   try {

//     delete req.body.password

//     const updatedUser = await UserModel.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     )

//     if (!updatedUser) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found"
//       })
//     }

//     res.status(200).json({
//       success: true,
//       message: "User updated successfully",
//       data: updatedUser
//     })

//   } catch (err) {

//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: err.message
//     })

//   }
// }

// /* ===============================
//    DELETE USER (SOFT DELETE)
// ================================ */

// const deleteUser = async (req, res) => {
//   try {

//     const user = await UserModel.findByIdAndUpdate(
//       req.params.id,
//       { isActive: false, status: "deleted" },
//       { new: true }
//     )

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found"
//       })
//     }

//     res.status(200).json({
//       success: true,
//       message: "User deleted successfully",
//       data: user
//     })

//   } catch (err) {

//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: err.message
//     })

//   }
// }

// /* ===============================
//    BLOCK USER
// ================================ */

// const blockUser = async (req, res) => {
//   try {

//     const user = await UserModel.findByIdAndUpdate(
//       req.params.id,
//       { isActive: false, status: "blocked" },
//       { new: true }
//     )

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found"
//       })
//     }

//     res.status(200).json({
//       success: true,
//       message: "User blocked successfully",
//       data: user
//     })

//   } catch (err) {

//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: err.message
//     })

//   }
// }

// /* ===============================
//    REACTIVATE USER
// ================================ */

// const reactivateUser = async (req, res) => {
//   try {

//     const user = await UserModel.findByIdAndUpdate(
//       req.params.id,
//       { isActive: true, status: "active" },
//       { new: true }
//     )

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found"
//       })
//     }

//     res.status(200).json({
//       success: true,
//       message: "User reactivated successfully",
//       data: user
//     })

//   } catch (err) {

//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: err.message
//     })

//   }
// }

// /* ===============================
//    FORGOT PASSWORD
// ================================ */

// const forgotpassword = async (req, res) => {
//   try {

//     const user = await UserModel.findOne({ email: req.body.email })

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found"
//       })
//     }

//     const resetToken = crypto.randomBytes(32).toString("hex")

//     user.passwordResetToken = resetToken
//     user.passwordResetExpires = Date.now() + 15 * 60 * 1000

//     await user.save()

//     const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`

//     const htmlMessage = resetPasswordTemplate(resetLink)

//     await mailSend(
//       user.email,
//       "Password Reset Request",
//       htmlMessage
//     )

//     res.status(200).json({
//       success: true,
//       message: "Reset link sent to email"
//     })

//   } catch (err) {

//     res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//       error: err.message
//     })

//   }
// }
// const resetPassword = async (req, res) => {
//   try {

//     console.log("Token from URL:", req.params.token)

//     const user = await UserModel.findOne({
//       passwordResetToken: req.params.token,
//       passwordResetExpires: { $gt: Date.now() }
//     }).select("+password")

//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid or expired token"
//       })
//     }

//     const hashedPassword = await bcrypt.hash(req.body.password, 10)

//     user.password = hashedPassword
//     user.passwordResetToken = null
//     user.passwordResetExpires = null

//     await user.save()

//     res.status(200).json({
//       success: true,
//       message: "Password reset successful"
//     })

//   } catch (err) {

//     res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//       error: err.message
//     })

//   }
// }

// const updateProfilePic = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ success: false, message: "No file uploaded" })
//     }

//     const cloudinaryResponse = await uploadToCloudinary(req.file.path)

//     const user = await UserModel.findByIdAndUpdate(
//       req.user._id,
//       { profilePic: cloudinaryResponse.secure_url },
//       { new: true }
//     ).select("-password")

//     res.status(200).json({
//       success: true,
//       message: "Profile picture updated",
//       data: user
//     })
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message })
//   }
// }

// const removeProfilePic = async (req, res) => {
//   try {
//     const user = await UserModel.findByIdAndUpdate(
//       req.user._id,
//       { profilePic: null },
//       { new: true }
//     ).select("-password")

//     res.status(200).json({ success: true, data: user })
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message })
//   }
// }
// module.exports = {
//   registerUser,
//   loginUser,
//   getAllUsers,
//   updateUser,
//   deleteUser,
//   blockUser,
//   reactivateUser,
//   forgotpassword,
//   resetPassword,
//   updateProfilePic,
//   removeProfilePic
// }

const UserModel = require("../models/UserModel")
const bcrypt = require("bcrypt")
const { mailSend } = require("../utils/MailUtil")
const { welcomeEmailTemplate, resetPasswordTemplate } = require("../utils/EmailTemplates")
const uploadToCloudinary = require("../utils/CloudinaryUtil")
const crypto = require("crypto")
const jwt = require("jsonwebtoken")

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

    // Send welcome email (non-blocking — don't fail registration if email fails)
    try {
      const htmlMessage = welcomeEmailTemplate(savedUser)
      await mailSend(savedUser.email, "Welcome to Bug Tracker", htmlMessage)
    } catch (mailErr) {
      console.error("Welcome email failed:", mailErr.message)
    }

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
   ✅ Role is NOT accepted from frontend.
   It is read from the database only.
================================ */
const loginUser = async (req, res) => {
  try {
    // ✅ Only email and password needed — role comes from DB
    const { email, password } = req.body

    const user = await UserModel.findOne({ email })
      .select("+password")

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email"
      })
    }

    // ✅ Check if user is blocked or deleted
    if (user.status === "blocked") {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked. Please contact admin."
      })
    }

    if (user.status === "deleted") {
      return res.status(404).json({
        success: false,
        message: "No account found with this email"
      })
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password)

    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      })
    }

    // ✅ Update last login
    user.lastLogin = new Date()
    await user.save()

    const userObject = user.toObject()
    delete userObject.password

    const token = jwt.sign(userObject, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: userObject
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
   GET ALL USERS
================================ */
const getAllUsers = async (req, res) => {
  try {

    const users = await UserModel.find({ status: { $ne: "deleted" } })
      .select("-password")
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users
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
   UPDATE USER
================================ */
const updateUser = async (req, res) => {
  try {

    // ✅ Never allow password update through this route
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
        message: "No account found with this email"
      })
    }

    const resetToken = crypto.randomBytes(32).toString("hex")

    user.passwordResetToken   = resetToken
    user.passwordResetExpires = Date.now() + 15 * 60 * 1000 // 15 minutes

    await user.save()

    const resetLink   = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`
    const htmlMessage = resetPasswordTemplate(resetLink)

    await mailSend(user.email, "Password Reset Request", htmlMessage)

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

/* ===============================
   RESET PASSWORD
================================ */
const resetPassword = async (req, res) => {
  try {

    const user = await UserModel.findOne({
      passwordResetToken:   req.params.token,
      passwordResetExpires: { $gt: Date.now() }
    }).select("+password")

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset link. Please request a new one."
      })
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    user.password             = hashedPassword
    user.passwordResetToken   = null
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

/* ===============================
   UPDATE PROFILE PICTURE
================================ */
const updateProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" })
    }

    // ✅ Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"]
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ success: false, message: "Only JPG and PNG files are allowed" })
    }

    // ✅ Validate file size (2MB max)
    const maxSize = 2 * 1024 * 1024
    if (req.file.size > maxSize) {
      return res.status(400).json({ success: false, message: "File size must be under 2MB" })
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

/* ===============================
   REMOVE PROFILE PICTURE
================================ */
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