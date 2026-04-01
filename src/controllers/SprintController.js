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
      tasks: tasks || [],
      createdBy: req.user._id
    });

    // 🔥 Assign sprintId to tasks (IMPORTANT)
    if (tasks && tasks.length > 0) {
      await Task.updateMany(
        { _id: { $in: tasks } },
        { sprintId: sprint._id }
      );
    }

    res.status(201).json({
      success: true,
      data: sprint
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// ✅ GET ALL SPRINTS (by project)
const getSprints = async (req, res) => {
  try {
    const { projectId } = req.query;

    const sprints = await Sprint.find({ project: projectId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: sprints
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// ✅ GET SINGLE SPRINT WITH PROGRESS + AUTO COMPLETE
const getSprintById = async (req, res) => {
  try {
    const sprint = await Sprint.findById(req.params.id).populate("tasks");

    if (!sprint) {
      return res.status(404).json({ message: "Sprint not found" });
    }

    // 🔥 AUTO COMPLETE
    if (new Date() > sprint.endDate && sprint.status !== "completed") {
      sprint.status = "completed";
      await sprint.save();
    }

    // 🔥 PROGRESS CALCULATION
    const totalTasks = sprint.tasks.length;

    const completedTasks = sprint.tasks.filter(
      (task) => task.status === "completed"
    ).length;

    const progress =
      totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    res.status(200).json({
      success: true,
      data: sprint,
      progress,
      totalTasks,
      completedTasks
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createSprint,
  getSprints,
  getSprintById
};