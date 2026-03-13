const Notification = require("../models/NotificationModel")

const notifyUser = async ({
  recipients,
  sender = null,
  type,
  title,
  message,
  relatedTask = null,
  relatedProject = null,
}) => {
  try {
    const recipientList = Array.isArray(recipients) ? recipients : [recipients]

    const notifications = recipientList.map((recipient) => ({
      recipient,
      sender,
      type,
      title,
      message,
      relatedTask,
      relatedProject,
    }))

    await Notification.insertMany(notifications)
  } catch (error) {
    console.error("Notification error:", error.message)
  }
}

const notifyTaskAssigned = (task, developer, pm) =>
  notifyUser({
    recipients: developer._id,
    sender: pm._id,
    type: "task_assigned",
    title: "New Task Assigned",
    message: `You have been assigned: "${task.title}"`,
    relatedTask: task._id,
    relatedProject: task.project,
  })

const notifyTaskSubmitted = (task, tester, developer) =>
  notifyUser({
    recipients: tester._id,
    sender: developer._id,
    type: "task_submitted",
    title: "Task Ready for Testing",
    message: `"${task.title}" submitted by ${developer.firstName} ${developer.lastName}`,
    relatedTask: task._id,
    relatedProject: task.project,
  })

const notifyBugFound = (task, developer, tester, bugComment) =>
  notifyUser({
    recipients: developer._id,
    sender: tester._id,
    type: "bug_found",
    title: "Bug Found in Your Task",
    message: `Bug in "${task.title}": ${bugComment}`,
    relatedTask: task._id,
    relatedProject: task.project,
  })

const notifyTaskReassigned = (task, developer, tester) =>
  notifyUser({
    recipients: developer._id,
    sender: tester._id,
    type: "task_reassigned",
    title: "Task Reassigned to You",
    message: `"${task.title}" has been reassigned to you for bug fixes`,
    relatedTask: task._id,
    relatedProject: task.project,
  })

const notifyTaskResubmitted = (task, tester, developer) =>
  notifyUser({
    recipients: tester._id,
    sender: developer._id,
    type: "task_resubmitted",
    title: "Task Resubmitted After Fix",
    message: `"${task.title}" fixed and resubmitted by ${developer.firstName} ${developer.lastName}`,
    relatedTask: task._id,
    relatedProject: task.project,
  })

const notifyTaskCompleted = (task, recipients) =>
  notifyUser({
    recipients, 
    sender: null,
    type: "task_completed",
    title: "Task Completed ✅",
    message: `"${task.title}" has been marked as completed`,
    relatedTask: task._id,
    relatedProject: task.project,
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