const Sprint = require("../models/SprintModel")

// CREATE SPRINT
const createSprint = async (req, res) => {
  try {
    const { name, project, startDate, endDate } = req.body

    const sprint = await Sprint.create({
      name,
      project,
      startDate,
      endDate,
      createdBy: req.user._id
    })

    res.status(201).json({
      success: true,
      data: sprint
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// GET ALL SPRINTS (by project)
const getSprints = async (req, res) => {
  try {
    const { projectId } = req.query

    const sprints = await Sprint.find({ project: projectId })
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      data: sprints
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = {
  createSprint,
  getSprints
}