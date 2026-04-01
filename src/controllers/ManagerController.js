// const Project = require("../models/ProjectModel");
// const Task = require("../models/TaskModel");
// const User = require("../models/UserModel");
// const BugComment = require("../models/BugCommentModel");

// // ✅ Manager Dashboard Data
// const getManagerDashboard = async (req, res) => {
//   try {

//     // Counts
//     const totalProjects = await Project.countDocuments();
//     const totalTasks = await Task.countDocuments();
//     const teamMembers = await User.countDocuments({ role: { $in: ["developer", "tester"] } });
//     const pendingBugs = await BugComment.countDocuments({ resolved: false });

//     // Projects
//     const projects = await Project.find()
//   .populate("teamMembers", "firstName lastName")

//     // Team
//     const team = await User.find({ role: { $in: ["developer", "tester"] } })
//       .select("firstName lastName role");

//     res.status(200).json({
//       success: true,
//       data: {
//         stats: {
//           totalProjects,
//           totalTasks,
//           teamMembers,
//           pendingBugs
//         },
//         projects,
//         team
//       }
//     });

//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       error: err.message
//     });
//   }
// };

// const getManagerProjects = async (req, res) => {
//   try {
//     const projects = await Project.find()
//       .populate("teamMembers", "firstName lastName email role")
//       .populate("createdBy", "firstName lastName email")

//     res.status(200).json({
//       success: true,
//       data: { projects }
//     })
//   } catch(err){
//     res.status(500).json({ success: false, error: err.message })
//   }
// }

// const getAllTeamMembers = async (req,res) => {
//   try{
//      const teamMembers = await User.find({
//       role:{$in:["developer" , "tester"]}
//      })

//      res.status(200).json({
//       success:true,
//       data:teamMembers
//      })
//   }
//   catch(err){
//     res.status(500).json({
//       success:false,
//       err:err.message
//     })
//   }
// }

// const addMemberToProject = async (req,res) => {
//   try {
//       const { userId } = req.body
//       const addProjectMember = await Project.findByIdAndUpdate(
//         req.params.id,
//         { $push: { teamMembers: userId } }, 
//         { new: true }
//       ).populate("teamMembers", "firstName lastName role")

//       res.status(200).json({
//         success:true,
//         data:addProjectMember
//       })
//   }
//   catch(err){
//     res.status(500).json({
//       success:false,
//       err:err.message
//     })
//   }
// }


// const removeMemberToProject = async (req,res) => {
//    try {
//       const { userId } = req.body
//       const addProjectMember = await Project.findByIdAndUpdate(
//         req.params.id,
//         { $pull: { teamMembers: userId } }, 
//         { new: true }
//       ).populate("teamMembers", "firstName lastName role")

//       res.status(200).json({
//         success:true,
//         data:addProjectMember
//       })
//   }
//   catch(err){
//     res.status(500).json({
//       success:false,
//       err:err.message
//     })
//   }
// }

// const createTask = async (req, res) => {
//   try {
//     const { title, project, module, assignedTo, priority, dueDate, description } = req.body

//     // Generate issueKey and issueNumber
//     const proj = await Project.findById(project)
//     const taskCount = await Task.countDocuments({ project })
//     const issueNumber = taskCount + 1
//     const issueKey = `${proj.projectKey}-${issueNumber}`

//     const taskCreate = await Task.create({
//       title,
//       issueKey,
//       issueNumber,
//       project,
//       module,
//       assignedTo,
//       createdBy: req.user._id,
//       priority,
//       dueDate,
//       description,
//       status: assignedTo ? "assigned" : "to_do"
//     })

//     res.status(201).json({
//       success: true,
//       data: taskCreate
//     })
//   } catch(err) {
//     res.status(500).json({
//       success: false,
//       err: err.message
//     })
//   }
// }

// const getManagerTasks = async (req,res) => {
//   try{
//     const managerTasks = await Task.find()
//   .populate("project", "name projectKey")
//   .populate("assignedTo", "firstName lastName role")

//     res.status(200).json({
//       success:true,
//       data:managerTasks
//     })
//   }
//   catch(err){
//     res.status(500).json({
//       success:false,
//       err:err.message
//     })
//   }
// }


// const getAllManagerBugs = async (req,res) => {
//   try{
//     const managerBugs = await BugComment.find()
//       .populate("task", "title issueKey")
//       .populate("commentedBy", "firstName lastName")
      
//       res.status(200).json({
//       success:true,
//       data:managerBugs
//      })
//   }
//   catch(err){
//     res.status(500).json({
//       success:false,
//       err:err.message
//     })
//   }
// }

// const getManagerReports = async (req, res) => {
//   try {
//     // Total projects
//     const totalProjects = await Project.countDocuments()

//     // Tasks grouped by status
//     // This gives: [{_id: "to_do", count: 5}, {_id: "completed", count: 3}]
//     const tasksByStatus = await Task.aggregate([
//       { $group: { _id: "$status", count: { $sum: 1 } } }
//     ])

//     // Bugs grouped by severity
//     // This gives: [{_id: "high", count: 2}, {_id: "low", count: 4}]
//     const bugsBySeverity = await BugComment.aggregate([
//       { $group: { _id: "$bugSeverity", count: { $sum: 1 } } }
//     ])

//     res.status(200).json({
//       success: true,
//       data: {
//         totalProjects,
//         tasksByStatus,
//         bugsBySeverity
//       }
//     })
//   } catch(err) {
//     res.status(500).json({ success: false, error: err.message })
//   }
// }

// module.exports = {
//   getManagerDashboard,
//   getManagerProjects,
//   getAllTeamMembers,
//   addMemberToProject,
//   removeMemberToProject,
//   getManagerTasks,
//   createTask,
//   getAllManagerBugs,
//   getManagerReports
// };

const Project = require("../models/ProjectModel");
const Task = require("../models/TaskModel");
const User = require("../models/UserModel");
const BugComment = require("../models/BugCommentModel");
const { notifyTaskAssigned } = require("../services/notificationService")
const { createAuditLog } = require("../utils/AuditLogHelper") 

const getManagerDashboard = async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();
    const totalTasks    = await Task.countDocuments();
    const teamMembers   = await User.countDocuments({ role: { $in: ["developer", "tester"] } });
    const pendingBugs   = await BugComment.countDocuments({ resolved: false });

    const projects = await Project.find()
      .populate("teamMembers", "firstName lastName")

    const team = await User.find({ role: { $in: ["developer", "tester"] } })
      .select("firstName lastName role");

    res.status(200).json({
      success: true,
      data: { stats: { totalProjects, totalTasks, teamMembers, pendingBugs }, projects, team }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// FIX 1: was returning { data: { projects } }, frontend expects { data: [...] }
const getManagerProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("teamMembers", "firstName lastName email role")
      .populate("createdBy",   "firstName lastName email")

    res.status(200).json({
      success: true,
      data: projects   // ← was: { projects }
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

// FIX 2: add getManagerProject (single) — used by ManagerSettings
// returns the project where this manager is createdBy
const getManagerProject = async (req, res) => {
  try {
    const project = await Project.findOne({ createdBy: req.user._id })
      .populate("createdBy",   "firstName lastName email")
      .populate("teamMembers", "firstName lastName role email")

    if (!project) {
      return res.status(404).json({ success: false, message: "No project assigned to you" })
    }

    res.status(200).json({ success: true, data: project })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

const getAllTeamMembers = async (req, res) => {
  try {
    const teamMembers = await User.find({ role: { $in: ["developer", "tester"] } })
    res.status(200).json({ success: true, data: teamMembers })
  } catch (err) {
    res.status(500).json({ success: false, err: err.message })
  }
}

const addMemberToProject = async (req, res) => {
  try {
    const { userId } = req.body
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $push: { teamMembers: userId } },
      { new: true }
    ).populate("teamMembers", "firstName lastName role")

    res.status(200).json({ success: true, data: project })
  } catch (err) {
    res.status(500).json({ success: false, err: err.message })
  }
}

const removeMemberToProject = async (req, res) => {
  try {
    const { userId } = req.body
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $pull: { teamMembers: userId } },
      { new: true }
    ).populate("teamMembers", "firstName lastName role")

    res.status(200).json({ success: true, data: project })
  } catch (err) {
    res.status(500).json({ success: false, err: err.message })
  }
}

// FIX 3: module is now optional — was crashing when not provided
// REPLACE only the createTask function in ManagerController.js with this:

const createTask = async (req, res) => {
  try {
    const { title, project, module, assignedTo, priority, dueDate, description } = req.body

    if (!title || !project) {
      return res.status(400).json({ success: false, message: "title and project are required" })
    }

    const proj = await Project.findById(project)
    if (!proj) {
      return res.status(404).json({ success: false, message: "Project not found" })
    }

    // FIX: Use total count of ALL tasks in project (including deleted attempts)
    // Then keep incrementing until we find a unique issueKey
    let issueNumber
    let issueKey
    let attempts = 0

    do {
      // Count all tasks for this project to get next number
      const taskCount = await Task.countDocuments({ project })
      issueNumber = taskCount + 1 + attempts
      issueKey = `${proj.projectKey}-${issueNumber}`
      attempts++
      if (attempts > 100) break // safety limit
    } while (await Task.findOne({ issueKey })) // keep trying until unique

    const taskData = {
      title,
      issueKey,
      issueNumber,
      project,
      createdBy:   req.user._id,
      priority:    priority || "medium",
      dueDate:     dueDate  || null,
      description: description || "",
      status:      assignedTo ? "assigned" : "to_do",
      ...(module     && { module }),
      ...(assignedTo && { assignedTo, assignedAt: new Date() }),
    }

    const taskCreate = await Task.create(taskData)
    await createAuditLog({
      action: "task_created",
      performedBy: req.user._id,
      performedByRole: req.user.role,
      targetEntity: "task",
      targetId: taskCreate._id,
      targetName: taskCreate.title
    })
    const populated = await Task.findById(taskCreate._id)
      .populate("project",    "name projectKey")
      .populate("module",     "name")
      .populate("assignedTo", "firstName lastName role")
      .populate("createdBy",  "firstName lastName")
      if (populated.assignedTo) {
        await notifyTaskAssigned(
          populated,
          populated.assignedTo,
          populated.createdBy
        )
      }
    res.status(201).json({ success: true, data: populated })
  } catch (err) {
    res.status(500).json({ success: false, err: err.message })
  }
}

const getManagerTasks = async (req, res) => {
  try {
    const managerTasks = await Task.find()
      .populate("project",    "name projectKey")
      .populate("assignedTo", "firstName lastName role")
      .populate("module",     "name")

    res.status(200).json({ success: true, data: managerTasks })
  } catch (err) {
    res.status(500).json({ success: false, err: err.message })
  }
}

const getAllManagerBugs = async (req, res) => {
  try {
    const managerBugs = await BugComment.find()
      .populate("task",        "title issueKey")
      .populate("commentedBy", "firstName lastName")

    res.status(200).json({ success: true, data: managerBugs })
  } catch (err) {
    res.status(500).json({ success: false, err: err.message })
  }
}

const getManagerReports = async (req, res) => {
  try {
    const totalProjects  = await Project.countDocuments()
    const tasksByStatus  = await Task.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ])
    const bugsBySeverity = await BugComment.aggregate([
      { $group: { _id: "$bugSeverity", count: { $sum: 1 } } }
    ])

    res.status(200).json({
      success: true,
      data: { totalProjects, tasksByStatus, bugsBySeverity }
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

const assignTester = async (req, res) => {
  try {
    const { testerId } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    const tester = await User.findById(testerId);

    if (!tester || tester.role !== "tester") {
      return res.status(400).json({ success: false, message: "Invalid tester" });
    }

    // ✅ Availability check
    if (tester.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "Tester is inactive",
      });
    }

    // ✅ Load control
    if (tester.currentTasks >= 5) {
      return res.status(400).json({
        success: false,
        message: "Tester is overloaded",
      });
    }

    // 🔁 Reduce old tester load
    if (task.testedBy) {
      await User.findByIdAndUpdate(task.testedBy, {
        $inc: { currentTasks: -1 },
      });
    }

    // ➕ Increase new tester load
    await User.findByIdAndUpdate(testerId, {
      $inc: { currentTasks: 1 },
    });

    task.testedBy = testerId;
    task.status = "in_testing";
    task.assignedRole = "tester"; // ✅ ADD

    await task.save();
    await createAuditLog({
      action: "tester_assigned",
      performedBy: req.user._id,
      performedByRole: req.user.role,
      targetEntity: "task",
      targetId: task._id,
      targetName: task.title
    })
    res.status(200).json({
      success: true,
      message: "Tester assigned successfully",
      data: task,
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const resolveBugByManager = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // 🔥 Only allow HIGH / URGENT
    if (!["high", "urgent"].includes(task.priority)) {
      return res.status(400).json({
        success: false,
        message: "Only high or urgent tasks can be resolved by manager",
      });
    }

    // 🔥 CHECK AVAILABLE DEVELOPER
    const availableDev = await User.findOne({
      role: "developer",
      status: "active",
      currentTasks: { $lt: 5 }
    });

    if (availableDev) {
      // ✅ Assign to developer instead
      task.assignedTo = availableDev._id;
      task.assignedRole = "developer";
      task.status = "assigned";
      task.assignedAt = new Date();

      // increase load
      await User.findByIdAndUpdate(availableDev._id, {
        $inc: { currentTasks: 1 }
      });

      await task.save();

      return res.json({
        success: true,
        message: "Developer available → assigned to developer",
        data: task
      });
    }

    // ❌ No dev → manager resolves
    task.status = "completed";
    task.completedBy = req.user._id;
    task.completedAt = new Date();

    await task.save();

    res.status(200).json({
      success: true,
      message: "No developer available → resolved by manager",
      data: task,
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const assignDeveloperSmart = async (req, res) => {
  try {
    const { developerId } = req.body;

    const task = await Task.findById(req.params.id);
    const dev = await User.findById(developerId);

    if (!task || !dev || dev.role !== "developer") {
      return res.status(400).json({ success: false, message: "Invalid developer" });
    }

    if (dev.status !== "active") {
      return res.status(400).json({ success: false, message: "Developer inactive" });
    }

    if (dev.currentTasks >= 5) {
      return res.status(400).json({ success: false, message: "Developer overloaded" });
    }

    // reduce old
    if (task.assignedTo) {
      await User.findByIdAndUpdate(task.assignedTo, {
        $inc: { currentTasks: -1 },
      });
    }

    // increase new
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
      targetName: task.title,
      details: `Assigned to developer`
    })
    res.json({
      success: true,
      message: "Developer assigned successfully",
      data: task,
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const assignTaskFull = async (req, res) => {
  try {
    const { developerId, testerId } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // 🔹 Assign Developer
    if (developerId) {
      const dev = await User.findById(developerId);

      if (!dev || dev.role !== "developer") {
        return res.status(400).json({ success: false, message: "Invalid developer" });
      }

      if (task.assignedTo) {
        await User.findByIdAndUpdate(task.assignedTo, {
          $inc: { currentTasks: -1 },
        });
      }

      await User.findByIdAndUpdate(developerId, {
        $inc: { currentTasks: 1 },
      });

      task.assignedTo = developerId;
      task.status = "assigned";
      task.assignedAt = new Date();
    }

    // 🔹 Assign Tester
    if (testerId) {
      const tester = await User.findById(testerId);

      if (!tester || tester.role !== "tester") {
        return res.status(400).json({ success: false, message: "Invalid tester" });
      }

      if (task.testedBy) {
        await User.findByIdAndUpdate(task.testedBy, {
          $inc: { currentTasks: -1 },
        });
      }

      await User.findByIdAndUpdate(testerId, {
        $inc: { currentTasks: 1 },
      });

      task.testedBy = testerId;
    }

    await task.save();

    res.json({
      success: true,
      message: "Task assigned (developer + tester)",
      data: task,
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  getManagerDashboard,
  getManagerProjects,
  getManagerProject,      // ← NEW: add to exports
  getAllTeamMembers,
  addMemberToProject,
  removeMemberToProject,
  getManagerTasks,
  createTask,
  getAllManagerBugs,
  getManagerReports,
  assignTester,
  resolveBugByManager,
  assignDeveloperSmart,
  assignTaskFull
};
