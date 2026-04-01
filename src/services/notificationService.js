const Notification = require("../models/NotificationModel")

// Simple helper — uses 'recipientId' to match the NotificationModel field
const notifyUser = async ({ recipients, sender = null, type, title, message }) => {
  try {
    const recipientList = Array.isArray(recipients) ? recipients : [recipients]
    const docs = recipientList.map(recipient => ({
        recipientId: recipient._id || recipient,   // ✅ MUST FIX
        senderId: sender?._id || sender,
        type,
        title,
        message,
      }))
    await Notification.insertMany(docs)
  } catch (err) {
    console.error("Notification error:", err.message)
  }
}

const notifyTaskAssigned = (task, developer, pm) =>
  notifyUser({
    recipients: developer._id,
    sender:     pm._id,
    type:       "task_assigned",
    title:      "New Task Assigned",
    message:    `You have been assigned: "${task.title}"`,
  })

const notifyTaskSubmitted = (task, tester, developer) =>
  notifyUser({
    recipients: tester._id,
    sender:     developer._id,
    type:       "task_submitted",
    title:      "Task Ready for Testing",
    message:    `"${task.title}" submitted by ${developer.firstName} ${developer.lastName}`,
  })

const notifyBugFound = (task, developer, tester, bugComment) =>
  notifyUser({
    recipients: developer._id,
    sender:     tester._id,
    type:       "bug_found",
    title:      "Bug Found in Your Task",
    message:    `Bug in "${task.title}": ${bugComment}`,
  })

const notifyTaskReassigned = (task, developer, sender) =>
  notifyUser({
    recipients: developer._id,
    sender:     sender._id,
    type:       "task_reassigned",
    title:      "Task Reassigned to You",
    message:    `"${task.title}" has been reassigned to you for bug fixes`,
  })

const notifyTaskResubmitted = (task, tester, developer) =>
  notifyUser({
    recipients: tester._id,
    sender:     developer._id,
    type:       "task_resubmitted",
    title:      "Task Resubmitted After Fix",
    message:    `"${task.title}" fixed and resubmitted by ${developer.firstName} ${developer.lastName}`,
  })

const notifyTaskCompleted = (task, recipients) =>
  notifyUser({
    recipients,
    sender:  null,
    type:    "task_completed",
    title:   "Task Completed",
    message: `"${task.title}" has been marked as completed`,
  })

module.exports = {
  notifyUser,
  notifyTaskAssigned,
  notifyTaskSubmitted,
  notifyBugFound,
  notifyTaskReassigned,
  notifyTaskResubmitted,
  notifyTaskCompleted,
} 