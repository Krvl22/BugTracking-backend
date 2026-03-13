const mongoose = require("mongoose")
const Schema = mongoose.Schema

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,          
    },
    description: {
      type: String,
      default: ""
    },
    projectKey: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    status: {
      type: String,
      default: "active",
      enum: ["active", "inactive", "completed"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",           
      required: true,
    },
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("projects", projectSchema)