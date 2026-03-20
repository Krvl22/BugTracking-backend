const Project = require("../models/ProjectModel");
const Task = require("../models/TaskModel");
const User = require("../models/UserModel");
const BugComment = require("../models/BugCommentModel");

// ✅ Manager Dashboard Data
const getManagerDashboard = async (req, res) => {
  try {

    // Counts
    const totalProjects = await Project.countDocuments();
    const totalTasks = await Task.countDocuments();
    const teamMembers = await User.countDocuments({ role: { $in: ["developer", "tester"] } });
    const pendingBugs = await BugComment.countDocuments({ resolved: false });

    // Projects
    const projects = await Project.find()
  .populate("teamMembers", "firstName lastName")

    // Team
    const team = await User.find({ role: { $in: ["developer", "tester"] } })
      .select("firstName lastName role");

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalProjects,
          totalTasks,
          teamMembers,
          pendingBugs
        },
        projects,
        team
      }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

module.exports = {
  getManagerDashboard
};