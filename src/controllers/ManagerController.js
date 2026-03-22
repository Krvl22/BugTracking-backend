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

const getManagerProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("teamMembers", "firstName lastName email role")
      .populate("createdBy", "firstName lastName email")

    res.status(200).json({
      success: true,
      data: { projects }
    })
  } catch(err){
    res.status(500).json({ success: false, error: err.message })
  }
}

const getAllTeamMembers = async (req,res) => {
  try{
     const teamMembers = await User.find({
      role:{$in:["developer" , "tester"]}
     })

     res.status(200).json({
      success:true,
      data:teamMembers
     })
  }
  catch(err){
    res.status(500).json({
      success:false,
      err:err.message
    })
  }
}

const addMemberToProject = async (req,res) => {
  try {
      const { userId } = req.body
      const addProjectMember = await Project.findByIdAndUpdate(
        req.params.id,
        { $push: { teamMembers: userId } }, 
        { new: true }
      ).populate("teamMembers", "firstName lastName role")

      res.status(200).json({
        success:true,
        data:addProjectMember
      })
  }
  catch(err){
    res.status(500).json({
      success:false,
      err:err.message
    })
  }
}


const removeMemberToProject = async (req,res) => {
   try {
      const { userId } = req.body
      const addProjectMember = await Project.findByIdAndUpdate(
        req.params.id,
        { $pull: { teamMembers: userId } }, 
        { new: true }
      ).populate("teamMembers", "firstName lastName role")

      res.status(200).json({
        success:true,
        data:addProjectMember
      })
  }
  catch(err){
    res.status(500).json({
      success:false,
      err:err.message
    })
  }
}

const createTask = async (req, res) => {
  try {
    const { title, project, module, assignedTo, priority, dueDate, description } = req.body

    // Generate issueKey and issueNumber
    const proj = await Project.findById(project)
    const taskCount = await Task.countDocuments({ project })
    const issueNumber = taskCount + 1
    const issueKey = `${proj.projectKey}-${issueNumber}`

    const taskCreate = await Task.create({
      title,
      issueKey,
      issueNumber,
      project,
      module,
      assignedTo,
      createdBy: req.user._id,
      priority,
      dueDate,
      description,
      status: assignedTo ? "assigned" : "to_do"
    })

    res.status(201).json({
      success: true,
      data: taskCreate
    })
  } catch(err) {
    res.status(500).json({
      success: false,
      err: err.message
    })
  }
}

const getManagerTasks = async (req,res) => {
  try{
    const managerTasks = await Task.find()
  .populate("project", "name projectKey")
  .populate("assignedTo", "firstName lastName role")

    res.status(200).json({
      success:true,
      data:managerTasks
    })
  }
  catch(err){
    res.status(500).json({
      success:false,
      err:err.message
    })
  }
}


const getAllManagerBugs = async (req,res) => {
  try{
    const managerBugs = await BugComment.find()
      .populate("task", "title issueKey")
      .populate("commentedBy", "firstName lastName")
      
      res.status(200).json({
      success:true,
      data:managerBugs
     })
  }
  catch(err){
    res.status(500).json({
      success:false,
      err:err.message
    })
  }
}

const getManagerReports = async (req, res) => {
  try {
    // Total projects
    const totalProjects = await Project.countDocuments()

    // Tasks grouped by status
    // This gives: [{_id: "to_do", count: 5}, {_id: "completed", count: 3}]
    const tasksByStatus = await Task.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ])

    // Bugs grouped by severity
    // This gives: [{_id: "high", count: 2}, {_id: "low", count: 4}]
    const bugsBySeverity = await BugComment.aggregate([
      { $group: { _id: "$bugSeverity", count: { $sum: 1 } } }
    ])

    res.status(200).json({
      success: true,
      data: {
        totalProjects,
        tasksByStatus,
        bugsBySeverity
      }
    })
  } catch(err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

module.exports = {
  getManagerDashboard,
  getManagerProjects,
  getAllTeamMembers,
  addMemberToProject,
  removeMemberToProject,
  getManagerTasks,
  createTask,
  getAllManagerBugs,
  getManagerReports
};