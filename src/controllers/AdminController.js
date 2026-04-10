
const User       = require("../models/UserModel");
const Project    = require("../models/ProjectModel");
const BugComment = require("../models/BugCommentModel");

const getAdminStats = async (req, res) => {
  try {
    const totalUsers    = await User.countDocuments({ isActive: true })
    const totalProjects = await Project.countDocuments()  // FIX: removed isActive filter
    const totalBugs     = await BugComment.countDocuments()
    const resolvedBugs  = await BugComment.countDocuments({ resolved: true })

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
      .select("firstName lastName email role status createdAt")  // FIX: added role
      .sort({ createdAt: -1 })
      .limit(5)

    res.status(200).json({ success: true, data: users })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// FIX: removed { isActive: true } filter — projects don't always have this field set
// so newly created projects were being excluded
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("createdBy",   "firstName lastName email")
      .populate("teamMembers", "firstName lastName role")
      .sort({ createdAt: -1 })

    res.status(200).json({ success: true, data: projects })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = { getAdminStats, getRecentUsers, getAllProjects }