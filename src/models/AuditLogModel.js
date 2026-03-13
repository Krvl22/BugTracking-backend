const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: [
        "user_created",
        "user_updated",
        "user_deactivated",
        "user_activated",
        "password_reset",
        "project_created",
        "project_updated",
        "module_created",
        "module_updated",
        "task_created",
        "task_assigned",
        "task_submitted",
        "task_reassigned",
        "task_resubmitted",
        "task_completed",
        "bug_comment_added",
        "login_success",
        "login_failed",
      ],
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    performedByRole: {
      type: String,
      enum: ["admin", "project_manager", "developer", "tester"],
      required: true,
    },

    targetEntity: {
      type: String,
      enum: ["user", "project", "module", "task", "bugcomment"],
      required: true,
    },

    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    targetName: {
      type: String,
      maxlength: 200,
      default: "",
    },

    details: {
      type: String,
      maxlength: 500,
      default: "",
    },
  },
  {timestamps: true,}
);
module.exports = mongoose.model("auditlogs", auditLogSchema);