const Sprint = require("../models/SprintModel");
const Task = require("../models/TaskModel");

// ✅ CREATE SPRINT
const createSprint = async (req, res) => {
  try {
    const { name, project, startDate, endDate, tasks } = req.body;

    const sprint = await Sprint.create({
      name,
      project,
      startDate,
      endDate,
      tasks: [],
      createdBy: req.user._id
    });

    if (tasks && tasks.length > 0) {
      await Task.updateMany(
        { _id: { $in: tasks } },
        { sprint: sprint._id }
      );

      sprint.tasks = tasks; // ✅ FIX
      await sprint.save();
    }

    res.status(201).json({ success: true, data: sprint });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
// ✅ GET ALL SPRINTS
const getSprints = async (req, res) => {
  try {
    const { projectId } = req.query;

    const sprints = await Sprint.find({ project: projectId })
      .populate({
        path: 'tasks',
        populate: [
          { path: 'assignedTo', select: 'firstName lastName email' },
          { path: 'module', select: 'name' },
        ]
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, data: sprints });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ GET SINGLE SPRINT (WITH TASKS)
const getSprintById = async (req, res) => {
  try {
    const sprint = await Sprint.findById(req.params.id)
      .populate({
        path: "tasks",
        populate: [
          { path: "assignedTo", select: "firstName lastName email" },
          { path: "testedBy",   select: "firstName lastName email" },
          { path: "module",     select: "name" },
        ]
      })
      .populate("project", "name projectKey")

    if (!sprint) {
      return res.status(404).json({ success: false, message: "Sprint not found" })
    }

    // Auto-complete if past end date
    if (new Date() > sprint.endDate && sprint.status !== "completed") {
      sprint.status = "completed"
      await sprint.save()
    }

    const totalTasks     = sprint.tasks.length
    const completedTasks = sprint.tasks.filter(t => t.status === "completed").length
    const progress       = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)

    res.json({ success: true, data: sprint, progress, totalTasks, completedTasks })  
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createSprint, getSprints, getSprintById };