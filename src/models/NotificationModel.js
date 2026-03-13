const mongoose = require("mongoose")
const Schema = mongoose.Schema

const notificationSchema = new Schema(
  {
    recipientId: {
      type: mongoose.Types.ObjectId,
      ref: "users",         
      required: true,
    },
    senderId: {
      type: mongoose.Types.ObjectId,
      ref: "users",         
      default: null,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "task_assigned",
        "task_submitted",
        "bug_found",
        "task_reassigned",
        "task_resubmitted",
        "task_completed",
        "project_created",
        "module_created",
      ],
    },
    title: {
      type: String,
      required: true,
      minlength: 5,         
      maxlength: 100,    
    },
    message: {
      type: String,
      required: true,
      minlength: 10,        
      maxlength: 500,       
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
)


module.exports = mongoose.model("notifications", notificationSchema)