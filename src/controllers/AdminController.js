const User = require("../models/UserModel");
const Project = require("../models/ProjectModel");
const BugComment = require("../models/BugCommentModel");

// ✅ Fixed: added auth, correct field names
const getAdminStats = async (req, res) => {
  try {
    const totalUsers     = await User.countDocuments({ isActive: true })
    const totalProjects  = await Project.countDocuments({ isActive: true })
    const totalBugs      = await BugComment.countDocuments()
    const resolvedBugs   = await BugComment.countDocuments({ resolved: true })

    const systemHealth = totalBugs === 0
      ? "100%"
      : `${Math.round((resolvedBugs / totalBugs) * 100)}%`

    res.status(200).json({
      success: true,
      data: { totalUsers, totalProjects, totalBugs, systemHealth }
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const getRecentUsers = async (req, res) => {
  try {
    const users = await User.find({ isActive: true })
      .select("firstName lastName email status createdAt") // ✅ only needed fields
      .sort({ createdAt: -1 })
      .limit(5)

    res.status(200).json({ success: true, data: users })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({ isActive: true })
      .populate("createdBy", "firstName lastName email") // ✅ fixed: was .populate("team") which doesn't exist
      .sort({ createdAt: -1 })
      .limit(6)

    res.status(200).json({ success: true, data: projects })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = { getAdminStats, getRecentUsers, getAllProjects }