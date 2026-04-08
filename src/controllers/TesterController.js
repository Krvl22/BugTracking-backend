const Project = require("../models/ProjectModel");
const Task = require("../models/TaskModel");
const BugComment = require("../models/BugCommentModel");
const uploadToCloudinary = require("../utils/CloudinaryUtil");
const { notifyBugFound } = require("../services/notificationService");
const User = require("../models/UserModel");

// ================= TESTER DASHBOARD (ENHANCED) =================
const getTesterDashboard = async (req, res) => {
  try {
    const userId = req.query.userId || req.user._id;

    const [
      tasksForTesting,
      bugsFound,
      resolvedBugs,
      criticalBugs,
      highPriorityTasks,
      pendingTasks,
      recentActivity,
    ] = await Promise.all([
      Task.countDocuments({ testedBy: userId, status: { $in: ["in_testing", "submitted"] } }),
      BugComment.countDocuments({ commentedBy: userId }),
      BugComment.countDocuments({ commentedBy: userId, resolved: true }),
      BugComment.countDocuments({ commentedBy: userId, bugSeverity: "critical" }),
      Task.countDocuments({ testedBy: userId, priority: { $in: ["high", "urgent"] } }),
      Task.countDocuments({ testedBy: userId, status: { $in: ["in_testing", "submitted"] } }),
      BugComment.find({ commentedBy: userId })
        .populate("task", "issueKey title")
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          tasksForTesting,
          bugsFound,
          resolvedBugs,
          criticalBugs,
          highPriorityTasks,
          pendingTasks,
        },
        recentActivity,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ================= TASKS FOR TESTING (ASSIGNED TO THIS TESTER) =================
const getTasksForTesting = async (req, res) => {
  try {
    const userId = req.user._id;

    // Priority sort: critical > high > medium > low
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };

    const tasks = await Task.find({
      testedBy: userId,
      status: { $in: ["submitted", "in_testing", "resubmitted"] },
    })
      .populate("project", "name projectKey")
      .populate("module", "name")
      .populate("assignedTo", "firstName lastName")
      .sort({ createdAt: -1 });

    // Sort by priority
    tasks.sort(
      (a, b) =>
        (priorityOrder[a.priority] ?? 99) - (priorityOrder[b.priority] ?? 99)
    );

    res.status(200).json({ success: true, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ================= ALL TESTER BUGS =================
const getAllTesterBugs = async (req, res) => {
  try {
    const userId = req.query.userId || req.user._id;

    const testerBugs = await BugComment.find({ commentedBy: userId })
      .populate("task", "title issueKey status")
      .populate("commentedBy", "firstName lastName")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: testerBugs });
  } catch (err) {
    res.status(500).json({ success: false, err: err.message });
  }
};

// ================= ADD BUG COMMENT =================
const addBugComment = async (req, res) => {
  try {
    const { taskId, comment, bugSeverity } = req.body;

    if (!taskId)
      return res.status(400).json({ success: false, message: "Task id is required" });
    if (!comment)
      return res.status(400).json({ success: false, message: "Bug comment is required" });

    const task = await Task.findById(taskId);
    if (!task)
      return res.status(404).json({ success: false, message: "Task not found" });

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
      bugStatus: "open",
    });

    task.status = "bug_found";
    await task.save();

    try {
      await notifyBugFound(task, task.assignedTo, req.user, comment);
    } catch (e) {
      console.error("Notification error:", e.message);
    }

    res.status(201).json({
      success: true,
      message: "Bug comment added successfully",
      data: bug,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================= APPROVE TASK =================
const approveTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task)
      return res.status(404).json({ success: false, message: "Task not found" });

    task.status = "completed";
    task.completedBy = req.user._id;
    task.completedAt = new Date();
    await task.save();

    if (task.assignedTo) {
      await User.findByIdAndUpdate(task.assignedTo, { $inc: { currentTasks: -1 } });
      await User.updateOne(
        { _id: task.assignedTo, currentTasks: { $lt: 0 } },
        { $set: { currentTasks: 0 } }
      );
    }

    res.json({ success: true, message: "Task approved successfully", data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error approving task", error: err.message });
  }
};

// ================= REJECT TASK (NEW) =================
// Tester can reject task WITHOUT reporting a bug — just add a reason
const rejectTask = async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason || reason.trim().length < 5) {
      return res.status(400).json({ success: false, message: "Rejection reason is required (min 5 chars)" });
    }

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });

    // Send back to developer with rejection note
    task.status = "fix_in_progress";
    task.rejectionReason = reason.trim();
    task.rejectedAt = new Date();
    task.rejectedBy = req.user._id;
    await task.save();

    res.json({
      success: true,
      message: "Task rejected and sent back to developer",
      data: task,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================= UPDATE BUG STATUS (NEW) =================
// Open → In Progress → Verified → Closed
const updateBugStatus = async (req, res) => {
  try {
    const { bugStatus } = req.body;
    const validStatuses = ["open", "in_progress", "verified", "closed"];

    if (!validStatuses.includes(bugStatus)) {
      return res.status(400).json({ success: false, message: "Invalid bug status" });
    }

    const bug = await BugComment.findByIdAndUpdate(
      req.params.id,
      { bugStatus },
      { new: true }
    ).populate("task", "title issueKey");

    if (!bug) return res.status(404).json({ success: false, message: "Bug not found" });

    res.json({ success: true, message: "Bug status updated", data: bug });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================= TESTING HISTORY (NEW) =================
const getTestingHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const [tested, approved, rejected] = await Promise.all([
      Task.find({ testedBy: userId })
        .populate("project", "name projectKey")
        .populate("assignedTo", "firstName lastName")
        .sort({ updatedAt: -1 })
        .limit(50),
      Task.find({ testedBy: userId, status: "completed" })
        .populate("project", "name")
        .sort({ completedAt: -1 })
        .limit(20),
      Task.find({ testedBy: userId, status: "fix_in_progress", rejectedBy: userId })
        .populate("project", "name")
        .sort({ rejectedAt: -1 })
        .limit(20),
    ]);

    res.json({
      success: true,
      data: { tested, approved, rejected },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================= RESOLVE BUG =================
const resolveBug = async (req, res) => {
  try {
    const bug = await BugComment.findByIdAndUpdate(
      req.params.id,
      { resolved: true, resolvedAt: new Date(), bugStatus: "closed" },
      { new: true }
    ).populate("task", "title issueKey")
 
    if (!bug) return res.status(404).json({ success: false, message: "Bug not found" })
 
    res.json({ success: true, message: "Bug resolved", data: bug })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}
 
// ================= REOPEN BUG =================
const reopenBug = async (req, res) => {
  try {
    const bug = await BugComment.findByIdAndUpdate(
      req.params.id,
      { resolved: false, resolvedAt: null, bugStatus: "open" },
      { new: true }
    ).populate("task", "title issueKey")
 
    if (!bug) return res.status(404).json({ success: false, message: "Bug not found" })
 
    res.json({ success: true, message: "Bug reopened", data: bug })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = {
  getTesterDashboard,
  getTasksForTesting,
  getAllTesterBugs,
  addBugComment,
  approveTask,
  rejectTask,
  updateBugStatus,
  getTestingHistory,
  reopenBug,
  resolveBug
};