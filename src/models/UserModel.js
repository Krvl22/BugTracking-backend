const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema(
{
  firstName: {
    type: String,
    required: true,
    trim: true
  },

  lastName: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false
  },

  role: {
    type: String,
    default: "developer",
    enum: ["admin", "project_manager", "developer", "tester"]
  },

  profilePic: {
    type: String,
    default: null
  },
  
  passwordResetToken:{
    type:String,
    default:null
  },

  passwordResetExpires:{
    type:Date,
    default:null
  },

  status: {
    type: String,
    default: "active",
    enum: ["active", "inactive", "deleted", "blocked"]
  },

  isActive: {
    type: Boolean,
    default: true
  },

  lastLogin: {
    type: Date,
    default: null
  }

},
{ timestamps: true }
)

module.exports = mongoose.model("users", userSchema)