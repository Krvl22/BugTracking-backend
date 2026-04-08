const mongoose = require("mongoose")

const chatSchema = new mongoose.Schema({
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tasks",   // ✅ FIXED
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",   // ✅ FIXED (MOST IMPORTANT)
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true })

module.exports = mongoose.model("chats", chatSchema)