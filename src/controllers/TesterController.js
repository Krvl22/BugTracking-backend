// const Project = require("../models/ProjectModel");
// const Task = require("../models/TaskModel");
// const User = require("../models/UserModel");
// const BugComment = require("../models/BugCommentModel");
// const uploadToCloudinary = require("../utils/CloudinaryUtil")  // ✅ added missing import

// const getTesterDashboard = async (req, res) => {
//   try {
//     const userId = req.query.userId

//     const tasksForTesting = await Task.countDocuments({ status: "submitted" })
//     const bugsFound = await BugComment.countDocuments({ commentedBy: userId })
//     const resolvedBugs = await BugComment.countDocuments({ commentedBy: userId, resolved: true })
//     const totalTasks = await Task.countDocuments()

//     res.status(200).json({
//       success: true,
//       data: {
//         stats: {
//           tasksForTesting,
//           bugsFound,
//           resolvedBugs,
//           totalTasks
//         }
//       }
//     })
//   } catch(err) {
//     res.status(500).json({ success: false, error: err.message })
//   }
// }

// const getTasksForTesting = async (req, res) => {
//   try {
//     const tasks = await Task.find({ status: "submitted" })
//       .populate("project", "name projectKey")
//       .populate("module", "name")
//       .populate("assignedTo", "firstName lastName")
//       .sort({ createdAt: -1 })

//     res.status(200).json({
//       success: true,
//       data: tasks
//     })
//   } catch(err) {
//     res.status(500).json({ success: false, error: err.message })
//   }
// }

// const getAllTesterBugs = async (req, res) => {
//   try {
//     const userId = req.query.userId  // ✅ filter by tester

//     const testerBugs = await BugComment.find({ commentedBy: userId })
//       .populate("task", "title issueKey")
//       .populate("commentedBy", "firstName lastName")

//     res.status(200).json({
//       success: true,
//       data: testerBugs
//     })
//   } catch(err) {
//     res.status(500).json({ success: false, err: err.message })
//   }
// }

// const addBugComment = async (req, res) => {
//   try {
//     const { taskId, comment, bugSeverity } = req.body

//     if (!taskId) return res.status(400).json({ success: false, message: "Task id is required" })
//     if (!comment) return res.status(400).json({ success: false, message: "Bug comment is required" })

//     const task = await Task.findById(taskId)
//     if (!task) return res.status(404).json({ success: false, message: "Task not found" })

//     let attachmentUrl = null
//     if (req.file) {
//       const cloudinaryResponse = await uploadToCloudinary(req.file.path)
//       attachmentUrl = cloudinaryResponse.secure_url
//     }

//     const bug = await BugComment.create({
//       task: taskId,
//       commentedBy: req.user._id,
//       comment,
//       bugSeverity: bugSeverity || "medium",
//       attachmentUrl
//     })

//     task.status = "bug_found"
//     await task.save()

//     res.status(201).json({
//       success: true,
//       message: "Bug comment added successfully",
//       data: bug
//     })
//   } catch(err) {
//     res.status(500).json({ success: false, message: err.message })
//   }
// }

// const approveTask = async (req, res) => {
//   try {
//     const task = await Task.findByIdAndUpdate(
//       req.params.id,
//       { status: "completed", completedAt: new Date() },
//       { new: true }
//     )

//     if (!task) return res.status(404).json({ success: false, message: "Task not found" })

//     res.status(200).json({
//       success: true,
//       message: "Task approved and completed",
//       data: task
//     })
//   } catch(err) {
//     res.status(500).json({ success: false, message: err.message })
//   }
// }

// module.exports = {
//   getTesterDashboard,
//   getTasksForTesting,
//   getAllTesterBugs,
//   addBugComment,
//   approveTask
// }

const Project = require("../models/ProjectModel");
const Task = require("../models/TaskModel");
const BugComment = require("../models/BugCommentModel");
const uploadToCloudinary = require("../utils/CloudinaryUtil");

const getTesterDashboard = async (req, res) => {
  try {
    const userId = req.query.userId;

    const tasksForTesting = await Task.countDocuments({ status: "submitted" });
    const bugsFound = await BugComment.countDocuments({ commentedBy: userId });
    const resolvedBugs = await BugComment.countDocuments({
      commentedBy: userId,
      resolved: true,
    });
    const totalTasks = await Task.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        stats: {
          tasksForTesting,
          bugsFound,
          resolvedBugs,
          totalTasks,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getTasksForTesting = async (req, res) => {
  try {
    const tasks = await Task.find({ status: "submitted" })
      .populate("project", "name projectKey")
      .populate("module", "name")
      .populate("assignedTo", "firstName lastName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getAllTesterBugs = async (req, res) => {
  try {
    const userId = req.query.userId;

    const testerBugs = await BugComment.find({ commentedBy: userId })
      .populate("task", "title issueKey")
      .populate("commentedBy", "firstName lastName");

    res.status(200).json({
      success: true,
      data: testerBugs,
    });
  } catch (err) {
    res.status(500).json({ success: false, err: err.message });
  }
};

// This now supports file attachment via multipart/form-data
const addBugComment = async (req, res) => {
  try {
    const { taskId, comment, bugSeverity } = req.body;

    if (!taskId)
      return res
        .status(400)
        .json({ success: false, message: "Task id is required" });
    if (!comment)
      return res
        .status(400)
        .json({ success: false, message: "Bug comment is required" });

    const task = await Task.findById(taskId);
    if (!task)
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });

    let attachmentUrl = null;
    if (req.file) {
      const cloudinaryResponse = await uploadToCloudinary(req.file.path);
      attachmentUrl = cloudinaryResponse.secure_url;
    }

    const bug = await BugComment.create({
      task: taskId,
      commentedBy: req.user._id,
      comment,
      bugSeverity: bugSeverity || "medium",
      attachmentUrl,
    });

    task.status = "bug_found";
    await task.save();

    res.status(201).json({
      success: true,
      message: "Bug comment added successfully",
      data: bug,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const approveTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status: "completed", completedAt: new Date() },
      { new: true }
    );

    if (!task)
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });

    res.status(200).json({
      success: true,
      message: "Task approved and completed",
      data: task,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getTesterDashboard,
  getTasksForTesting,
  getAllTesterBugs,
  addBugComment,
  approveTask,
};