const mongoose = require("mongoose")
const Schema = mongoose.Schema

const bugCommentSchema = new Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tasks",           
      required: true,
    },
    commentedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",           
      required: true,
    },
    comment: {
      type: String,
      required: true,
      minlength: 10,          
      maxlength: 2000,       
    },
    bugSeverity: {
      type: String,
      default: "medium",
      enum: ["low", "medium", "high", "critical"], 
    },
    submissionCycle: {
      type: Number,
      default: 1,
    },
    attachmentUrl: {
      type: String,
      default: null,
    },
    // attachments: [
    //   {
    //     fileName: String,
    //     filePath: String,
    //     uploadedAt: {
    //       type: Date,
    //       default: Date.now
    //     }
    //   }
    // ],
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
)


module.exports = mongoose.model("bugcomments", bugCommentSchema)