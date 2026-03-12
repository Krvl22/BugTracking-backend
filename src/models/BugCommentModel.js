const mongoose = require('mongoose');
const Schema = mongoose.Schema
const bugCommentSchema = new Schema({
    
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'tasks',
      required: true,
    },
    commentedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    comment: {
      type: String,
      required: [true, 'Bug comment cannot be empty'],
      trim: true,
    },
    bugSeverity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    submissionCycle: {
      type: Number,
      default: 1, 
    },
    attachmentUrl: {
      type: String,
      default: null,
    },
    resolved: {
      type: Boolean,
      default: false,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('bugcomments', bugCommentSchema);