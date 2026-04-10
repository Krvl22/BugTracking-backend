
const Task = require("../models/TaskModel");
const Project = require("../models/ProjectModel");
const Sprint = require("../models/SprintModel");
const { getAvailableDeveloper } = require("../utils/AssignmentHelperUtil");
const User = require("../models/UserModel");
const uploadToCloudinary = require("../utils/CloudinaryUtil");
const { createAuditLog } = require("../utils/AuditLogHelper") 

const {
  notifyTaskAssigned,
  notifyTaskSubmitted,
  notifyTaskReassigned,
  notifyTaskResubmitted,
  notifyTaskCompleted,
} = require("../services/notificationService");

// ================= CREATE TASK =================
const createTask = async (req, res) => {
  try {
    const { title, description, project, module, createdBy, priority, dueDate } = req.body;

    if (!title || !project || !createdBy) {
      return res.status(400).json({
        success: false,
        message: "title, project and createdBy are required",
      });
    }

    const projectData = await Project.findById(project);
    if (!projectData) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Prevent duplicate task
    const existing = await Task.findOne({
      title: { $regex: `^${title}$`, $options: "i" },
      project,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Similar task already exists in this project",
      });
    }

    // Generate issue key
    const lastTask = await Task.findOne({ project }).sort({ issueNumber: -1 });
    const issueNumber = lastTask?.issueNumber ? lastTask.issueNumber + 1 : 1;
    const issueKey = `${projectData.projectKey}-${issueNumber}`;

    // File upload
    let attachmentUrl = null;
    if (req.file) {
      const cloudinaryResponse = await uploadToCloudinary(req.file.path);
      attachmentUrl = cloudinaryResponse.secure_url;
    }

    // ================= SMART ASSIGNMENT =================
    const developer = await getAvailableDeveloper();

    let assignedTo = null;
    let assignedRole = "manager"; // fallback

    if (developer) {
      assignedTo = developer._id;
      assignedRole = "developer";

      // Increase workload
      await User.findByIdAndUpdate(developer._id, {
        $inc: { currentTasks: 1 },
      });
    } else {
      assignedTo = req.user._id; // manager fallback
    }

    // ================= CREATE TASK =================
    const taskData = {
      issueKey,
      issueNumber,
      title,
      description,
      project,
      createdBy,
      attachmentUrl,
      priority: priority || "medium",
      dueDate: dueDate || null,
      ...(module && { module }),

      assignedTo,
      assignedRole,
      assignedBy: req.user._id,
      status: "assigned",
      assignedAt: new Date(),
    };

    const task = await Task.create(taskData);
    await createAuditLog({
      action: "task_created",
      performedBy: req.user._id,
      performedByRole: req.user.role,
      targetEntity: "task",
      targetId: task._id,
      targetName: task.title
    })
    const populatedTask = await Task.findById(task._id)
      .populate("project", "name projectKey")
      .populate("module", "name")
      .populate("createdBy", "firstName lastName")
      .populate("assignedTo", "firstName lastName");

    // Notify assigned user
    if (populatedTask.assignedTo) {
      await notifyTaskAssigned(
        populatedTask,
        populatedTask.assignedTo,
        populatedTask.createdBy
      );
    }

    // ✅ ADD THIS AFTER TASK CREATION
  if (req.body.sprint) {
    task.sprint = req.body.sprint;
    await task.save();

    await Sprint.findByIdAndUpdate(req.body.sprint, {
      $push: { tasks: task._id }
    });
  }

    res.status(201).json({
      success: true,
      message: developer
        ? "Task auto-assigned to developer"
        : "No developer available, assigned to manager",
      data: populatedTask,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error creating task",
      error: err.message,
    });
  }
};

// ================= GET ALL =================
const getAllTasks = async (req, res) => {
  try {
    const filter = {};
    if (req.query.project) filter.project = req.query.project;
    if (req.query.module) filter.module = req.query.module;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.assignedTo) filter.assignedTo = req.query.assignedTo;

    const tasks = await Task.find(filter)
      .populate("project", "name projectKey")
      .populate("module", "name")
      .populate("assignedTo", "firstName lastName email")
      .populate("createdBy", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ================= GET ONE =================
const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("project", "name projectKey")
      .populate("module", "name")
      .populate("assignedTo", "firstName lastName email")
      .populate("createdBy", "firstName lastName email");

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.status(200).json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ================= MY TASKS =================
const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.query.userId })
      .populate("project")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= MANUAL ASSIGN =================
const assignTask = async (req, res) => {
  try {
    const { developerId } = req.body;

    const task = await Task.findById(req.params.id);
    const dev = await User.findById(developerId);

    if (!task || !dev || dev.role !== "developer") {
      return res.status(400).json({
        success: false,
        message: "Invalid developer",
      });
    }

    // ✅ Availability check
    if (dev.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "Developer is inactive",
      });
    }

    // ✅ Load control
    if (dev.currentTasks >= 5) {
      return res.status(400).json({
        success: false,
        message: "Developer is overloaded",
      });
    }

    // 🔁 Reduce old user load
    if (task.assignedTo) {
      await User.findByIdAndUpdate(task.assignedTo, {
        $inc: { currentTasks: -1 },
      });
    }

    // ➕ Increase new dev load
    await User.findByIdAndUpdate(developerId, {
      $inc: { currentTasks: 1 },
    });

    task.assignedTo = developerId;
    task.status = "assigned";
    task.assignedAt = new Date();

    await task.save();
    await createAuditLog({
      action: "task_assigned",
      performedBy: req.user._id,
      performedByRole: req.user.role,
      targetEntity: "task",
      targetId: task._id,
      targetName: task.title
    })
    const updatedTask = await Task.findById(task._id).populate(
      "assignedTo createdBy",
      "firstName lastName email"
    );

    await notifyTaskAssigned(updatedTask, updatedTask.assignedTo, updatedTask.createdBy);

    res.status(200).json({
      success: true,
      message: "Task assigned successfully",
      data: updatedTask,
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
// ================= SUBMIT =================
const submitTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        status: "submitted",
        assignedRole: "manager",   // 🔥 ADD THIS
        submittedAt: new Date()
      },
      { new: true }
    ).populate("assignedTo createdBy", "firstName lastName email");

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    await notifyTaskSubmitted(task, task.createdBy, task.assignedTo);

    res.status(200).json({
      success: true,
      message: "Task sent to Manager",
      data: task,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ================= TESTING QUEUE =================
const getTasksForTesting = async (req, res) => {
  try {
    const tasks = await Task.find({
      status: "submitted",
      assignedRole: "manager"   // 🔥 ADD THIS
    })
      .populate("project", "name projectKey")
      .populate("module", "name")
      .populate("assignedTo", "firstName lastName")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ================= UPDATE =================
const updateTask = async (req, res) => {
  try {
    const oldTask = await Task.findById(req.params.id);
    if (!oldTask) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("createdBy assignedTo", "firstName lastName email");

    // 🔥 Reduce workload when completed
    if (req.body.status === "completed" && oldTask.assignedTo) {
      await User.findByIdAndUpdate(oldTask.assignedTo, {
        $inc: { currentTasks: -1 },
      });
      await User.updateOne(
        { _id: oldTask.assignedTo, currentTasks: { $lt: 0 } },
        { $set: { currentTasks: 0 } }
      );
    }

    // Notifications
    if (req.body.status === "fix_in_progress" && req.body.assignedTo) {
      await notifyTaskReassigned(task, task.assignedTo, task.createdBy);
    }

    if (req.body.status === "resubmitted") {
      await notifyTaskResubmitted(task, task.createdBy, task.assignedTo);
    }

    if (req.body.status === "completed") {
      const recipients = [task.createdBy._id, task.assignedTo._id].filter(Boolean);
      await notifyTaskCompleted(task, recipients);
      await createAuditLog({
      action: "task_completed",
      performedBy: req.user._id,
      performedByRole: req.user.role,
      targetEntity: "task",
      targetId: task._id,
      targetName: task.title
    })
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ================= DELETE =================
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data: task,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTask,
  getMyTasks,
  assignTask,
  submitTask,
  getTasksForTesting,
  updateTask,
  deleteTask,
};

