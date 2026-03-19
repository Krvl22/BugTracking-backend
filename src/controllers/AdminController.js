const User = require("../models/UserModel");
const Project = require("../models/ProjectModel");
const BugComment = require("../models/BugCommentModel");

const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProjects = await Project.countDocuments();
    const totalBugs = await BugComment.countDocuments();

    const systemHealth = totalBugs < 50 ? "98%" : "85%";

    res.json({
      totalUsers,
      totalProjects,
      totalBugs,
      systemHealth,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getRecentUsers = async (req, res) => {
  try {
    const users = await User.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("team");

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAdminStats,
  getRecentUsers,
  getAllProjects,
};