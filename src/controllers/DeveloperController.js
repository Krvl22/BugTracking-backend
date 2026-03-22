const Project = require("../models/ProjectModel");
const Task = require("../models/TaskModel");
const BugComment = require("../models/BugCommentModel");

const getDeveloperTasks = async (req, res) => {
  try {
    const userId = req.query.userId  // ✅ get from query params

    const developerTasks = await Task.find({ assignedTo: userId })  // ✅ filter by user
      .populate("project", "name projectKey")
      .populate("module", "name")
      .populate("assignedTo", "firstName lastName role")

    res.status(200).json({
      success: true,
      data: developerTasks
    })
  } catch(err) {
    res.status(500).json({ success: false, err: err.message })
  }
}

const getAllDeveloperBugs = async (req, res) => {
  try {
    const userId = req.query.userId  // ✅ get from query params

    // Find tasks assigned to this developer first
    const myTasks = await Task.find({ assignedTo: userId }).select("_id")
    const taskIds = myTasks.map(t => t._id)

    // Find bugs on those tasks
    const developerBugs = await BugComment.find({ task: { $in: taskIds } })
      .populate("task", "title issueKey")
      .populate("commentedBy", "firstName lastName")

    res.status(200).json({
      success: true,
      data: developerBugs
    })
  } catch(err) {
    res.status(500).json({ success: false, err: err.message })
  }
}

const getDeveloperProjects = async (req, res) => {
  try {
    const userId = req.query.userId

    // Only projects where this developer is a team member
    const developerProjects = await Project.find({ teamMembers: userId })
      .populate("teamMembers", "firstName lastName email role")
      .populate("createdBy", "firstName lastName email")

    res.status(200).json({
      success: true,
      data: developerProjects
    })
  } catch(err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

const submitTasks = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status: "submitted", submittedAt: new Date() },
      { new: true }
    )

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" })
    }

    res.status(200).json({
      success: true,
      message: "Task submitted successfully",
      data: task
    })
  } catch(err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = {
  getDeveloperTasks,
  getAllDeveloperBugs,
  getDeveloperProjects,
  submitTasks
}