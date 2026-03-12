// models/Notification.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema
const notificationSchema = new Schema({
    
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      default: null, 
    },
    type: {
      type: String,
      enum: [
          'task_assigned',
          'task_submitted',
          'bug_found',
          'task_reassigned',
          'task_resubmitted',
          'task_completed',
          'project_created',   // ← add this
          'module_created',    // ← add this
      ],
    required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    relatedTask: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'tasks',
      default: null,
    },
    relatedProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'projects',
      default: null,
    },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date, default: null },
  },
  { timestamps: true }
);

notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ recipient: 1, createdAt: -1 });

module.exports = mongoose.model('notifications', notificationSchema);