
const Notification = require("../models/NotificationModel")

// Helper to safely get userId
const getUserId = (req) => req.user?._id || req.user?.id

const getMyNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query

    const userId = getUserId(req)
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: user not found in token" })
    }

    const filter = { recipientId: userId }

    const notifications = await Notification.find(filter)
      .populate("senderId", "firstName lastName role")
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))

    const total = await Notification.countDocuments(filter)

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      data: notifications
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

const markNotificationRead = async (req, res) => {
  try {
    const userId = getUserId(req)

    const notification = await Notification.findOne({
      _id: req.params.id,
      recipientId: userId
    })

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" })
    }

    notification.isRead = true
    notification.readAt = new Date()

    await notification.save()

    res.status(200).json({ success: true, message: "Notification marked as read" })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

const markAllNotificationsRead = async (req, res) => {
  try {
    const userId = getUserId(req)

    await Notification.updateMany(
      { recipientId: userId, isRead: false },
      { isRead: true, readAt: new Date() }
    )

    res.status(200).json({ success: true, message: "All notifications marked as read" })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

const clearAllNotifications = async (req, res) => {
  try {
    const userId = getUserId(req)

    await Notification.deleteMany({ recipientId: userId })

    res.status(200).json({ success: true, message: "All notifications cleared" })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

module.exports = {
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  clearAllNotifications,
}