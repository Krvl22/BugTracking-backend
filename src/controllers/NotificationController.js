// const Notification = require("../models/NotificationModel")

// // GET MY NOTIFICATIONS
// const getMyNotifications = async (req,res)=>{
//   try{

//     const { page = 1 , limit = 20 } = req.query

//     const filter = { recipientId: req.user._id }

//     const notifications = await Notification.find(filter)
//       .populate("senderId","firstName lastName role")
//       .sort({ createdAt:-1 })
//       .limit(Number(limit))
//       .skip((Number(page)-1) * Number(limit))

//     const total = await Notification.countDocuments(filter)

//     res.status(200).json({
//       success:true,
//       message:"Notifications fetched successfully",
//       total,
//       page:Number(page),
//       data:notifications
//     })

//   }catch(err){
//     res.status(500).json({
//       success:false,
//       message:"Internal server error",
//       error:err.message
//     })
//   }
// }


// // MARK ONE AS READ
// const markNotificationRead = async (req,res)=>{
//   try{

//     const notification = await Notification.findOne({
//       _id:req.params.id,
//       recipientId:req.user._id
//     })

//     if(!notification){
//       return res.status(404).json({
//         success:false,
//         message:"Notification not found"
//       })
//     }

//     notification.isRead = true
//     notification.readAt = new Date()

//     await notification.save()

//     res.status(200).json({
//       success:true,
//       message:"Notification marked as read"
//     })

//   }catch(err){
//     res.status(500).json({
//       success:false,
//       message:"Internal server error",
//       error:err.message
//     })
//   }
// }


// // MARK ALL AS READ
// const markAllNotificationsRead = async (req,res)=>{
//   try{

//     await Notification.updateMany(
//       { recipientId:req.user._id , isRead:false },
//       { isRead:true , readAt:new Date() }
//     )

//     res.status(200).json({
//       success:true,
//       message:"All notifications marked as read"
//     })

//   }catch(err){
//     res.status(500).json({
//       success:false,
//       message:"Internal server error",
//       error:err.message
//     })
//   }
// }


// module.exports = {
//   getMyNotifications,
//   markNotificationRead,
//   markAllNotificationsRead
// }

const Notification = require("../models/NotificationModel")

const getMyNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query
    const filter = { recipientId: req.user._id }
    const notifications = await Notification.find(filter)
      .populate("senderId", "firstName lastName role")
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
    const total = await Notification.countDocuments(filter)
    res.status(200).json({ success: true, total, page: Number(page), data: notifications })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({ _id: req.params.id, recipientId: req.user._id })
    if (!notification) return res.status(404).json({ success: false, message: "Notification not found" })
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
    await Notification.updateMany(
      { recipientId: req.user._id, isRead: false },
      { isRead: true, readAt: new Date() }
    )
    res.status(200).json({ success: true, message: "All notifications marked as read" })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

// NEW — clear all notifications for the logged-in user
const clearAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ recipientId: req.user._id })
    res.status(200).json({ success: true, message: "All notifications cleared" })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

module.exports = {
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  clearAllNotifications,  // NEW
}