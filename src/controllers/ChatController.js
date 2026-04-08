const Chat = require("../models/ChatModel")
const Task = require("../models/TaskModel")
const User = require("../models/UserModel");
// GET /chat/:taskId — fetch all messages for a task
const getMessages = async (req, res) => {
  try {
    const messages = await Chat.find({ task: req.params.taskId })
        .populate({
        path: "sender",
        model: "users",
        select: "firstName lastName role profilePic"          
        })
      .sort({ createdAt: 1 })
    res.json({ success: true, data: messages })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// POST /chat/:taskId — send a message
const sendMessage = async (req, res) => {
  try {
    const { message } = req.body
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: "Message is required" })
    }

    const task = await Task.findById(req.params.taskId)
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" })
    }

    const chat = await Chat.create({
      task:    req.params.taskId,
      sender:  req.user._id,
      message: message.trim(),
    })

    const populated = await Chat.findById(chat._id)
      .populate("sender", "firstName lastName role profilePic")

    res.status(201).json({ success: true, data: populated })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = { getMessages, sendMessage }