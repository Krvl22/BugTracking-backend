const mongoose = require("mongoose");

const sprintSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    startDate: {
      type: Date,
      required: true
    },

    endDate: {
      type: Date,
      required: true
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "projects",
      required: true
    },

    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tasks"
      }
    ],

    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active"
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("sprints", sprintSchema);