// const Task = require("../models/TaskModel")
// const uploadToCloudinary = require("../utils/CloudinaryUtil")
// const Project = require("../models/ProjectModel")
// const { notifyTaskAssigned, notifyTaskSubmitted } = require("../services/notificationService");
// /* ===============================
//    CREATE TASK
// ================================ */

// const createTask = async (req,res)=>{
//   try{

//     const { title, description, project, module, createdBy, priority, dueDate } = req.body

//     if(!title || !project || !module || !createdBy){
//       return res.status(400).json({
//         success:false,
//         message:"title, project, module and createdBy are required"
//       })
//     }

//     const projectData = await Project.findById(project)

//     if(!projectData){
//       return res.status(404).json({
//         success:false,
//         message:"Project not found"
//       })
//     }

//     const existing = await Task.findOne({
//       title: { $regex: `^${title}$`, $options: "i" },
//       project
//     })

//     if(existing){
//       return res.status(400).json({
//         success:false,
//         message:"Similar task already exists in this project"
//       })
//     }

//     // const lastTask = await Task.findOne({ project }).sort({ issueNumber:-1 })

//     // const issueNumber = lastTask ? lastTask.issueNumber + 1 : 1
    
//     const lastTask = await Task.findOne({ project }).sort({ issueNumber: -1 })
//     let issueNumber = 1
//     if(lastTask && lastTask.issueNumber){
//       issueNumber = lastTask.issueNumber + 1
//     }
//     const issueKey = `${projectData.projectKey}-${issueNumber}`

//     let attachmentUrl = null

//     if(req.file){
//       const cloudinaryResponse = await uploadToCloudinary(req.file.path)
//       attachmentUrl = cloudinaryResponse.secure_url
//     }

//     const task = await Task.create({
//       issueKey,
//       issueNumber,
//       title,
//       description,
//       project,
//       module,
//       createdBy,
//       attachmentUrl,
//       priority: priority || "medium",
//       dueDate: dueDate || null
//     })

//     const populatedTask = await Task.findById(task._id)
//       .populate("project","name projectKey")
//       .populate("module","name")
//       .populate("createdBy","firstName lastName")

//     res.status(201).json({
//       success:true,
//       message:"Task created successfully",
//       data:populatedTask
//     })

//   }catch(err){
//     res.status(500).json({
//       success:false,
//       message:"Error creating task",
//       error:err.message
//     })
//   }
// }

// /* ===============================
//    GET ALL TASKS
// ================================ */

// const getAllTasks = async (req,res)=>{
//   try{

//     const filter = {}

//     if(req.query.project) filter.project = req.query.project
//     if(req.query.module) filter.module = req.query.module
//     if(req.query.status) filter.status = req.query.status
//     if(req.query.assignedTo) filter.assignedTo = req.query.assignedTo

//     const tasks = await Task.find(filter)
//       .populate("project","name projectKey")
//       .populate("module","name")
//       .populate("assignedTo","firstName lastName email")
//       .populate("createdBy","firstName lastName email")
//       .sort({ createdAt:-1 })

//     res.status(200).json({
//       success:true,
//       message:"Tasks fetched successfully",
//       data:tasks
//     })

//   }catch(err){
//     res.status(500).json({
//       success:false,
//       message:"Error fetching tasks",
//       error:err.message
//     })
//   }
// }


// /* ===============================
//    GET SINGLE TASK
// ================================ */

// const getTask = async (req,res)=>{
//   try{

//     const task = await Task.findById(req.params.id)
//       .populate("project","name projectKey")
//       .populate("module","name")
//       .populate("assignedTo","firstName lastName email")
//       .populate("createdBy","firstName lastName email")

//     if(!task){
//       return res.status(404).json({
//         success:false,
//         message:"Task not found"
//       })
//     }

//     res.status(200).json({
//       success:true,
//       message:"Task fetched successfully",
//       data:task
//     })

//   }catch(err){
//     res.status(500).json({
//       success:false,
//       error:err.message
//     })
//   }
// }

// const getMyTasks = async (req, res) => {
//   try {
//     const userId = req.query.userId;

//     const tasks = await Task.find({ assignedTo: userId })
//       .populate("project")
//       .sort({ createdAt: -1 });

//     res.json(tasks);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
// /* ===============================
//    ASSIGN TASK
// ================================ */

// const assignTask = async (req,res)=>{
//   try{

//     const { developerId } = req.body

//     const task = await Task.findByIdAndUpdate(
//       req.params.id,
//       {
//         assignedTo: developerId,
//         status:"assigned",
//         assignedAt:new Date()
//       },
//       { new:true }
//     ).populate("assignedTo","firstName lastName email")

//     const developer = task.assignedTo; // already populated
//     const pm = { _id: task.createdBy }; // fallback (you can improve later)

//     await notifyTaskAssigned(task, developer, pm);

//     if(!task){
//       return res.status(404).json({
//         success:false,
//         message:"Task not found"
//       })
//     }

//     res.status(200).json({
//       success:true,
//       message:"Task assigned successfully",
//       data:task
//     })

//   }catch(err){
//     res.status(500).json({
//       success:false,
//       message:"Error assigning task",
//       error:err.message
//     })
//   }
// }


// /* ===============================
//    SUBMIT TASK
// ================================ */

// const submitTask = async (req,res)=>{
//   try{

//     const task = await Task.findByIdAndUpdate(
//       req.params.id,
//       {
//         status:"submitted",
//         submittedAt:new Date()
//       },
//       { new:true }
//     )
//     .populate("assignedTo", "firstName lastName email")
//     .populate("createdBy", "firstName lastName email");

//     const developer = task.assignedTo;
//     const tester = { _id: task.createdBy }; // or assign tester later

//     await notifyTaskSubmitted(task, tester, developer);

//     if(!task){
//       return res.status(404).json({
//         success:false,
//         message:"Task not found"
//       })
//     }

//     res.status(200).json({
//       success:true,
//       message:"Task submitted successfully",
//       data:task
//     })

//   }catch(err){
//     res.status(500).json({
//       success:false,
//       message:"Error submitting task",
//       error:err.message
//     })
//   }
// }


// const getTasksForTesting = async (req, res) => {
//   try {
//     const tasks = await Task.find({ status: "submitted" })
//       .populate("project", "name projectKey")
//       .populate("module", "name")
//       .populate("assignedTo", "firstName lastName")
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       data: tasks
//     });

//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       error: err.message
//     });
//   }
// };

// /* ===============================
//    UPDATE TASK
// ================================ */

// const updateTask = async (req,res)=>{
//   try{

//     const task = await Task.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new:true, runValidators:true }
//     )
//     .populate("createdBy assignedTo", "firstName lastName email");

//     if(!task){
//       return res.status(404).json({
//         success:false,
//         message:"Task not found"
//       })
//     }

//     if (task.status === "completed") {
//   await notifyTaskCompleted(task, [
//     task.createdBy._id,
//     task.assignedTo?._id
//   ]);
// }

//     res.status(200).json({
//       success:true,
//       message:"Task updated successfully",
//       data:task
//     })

//   }catch(err){
//     res.status(500).json({
//       success:false,
//       message:"Error updating task",
//       error:err.message
//     })
//   }
// }


// /* ===============================
//    DELETE TASK
// ================================ */

// const deleteTask = async (req,res)=>{
//   try{

//     const task = await Task.findByIdAndDelete(req.params.id)

//     if(!task){
//       return res.status(404).json({
//         success:false,
//         message:"Task not found"
//       })
//     }

//     res.status(200).json({
//       success:true,
//       message:"Task deleted successfully",
//       data:task
//     })

//   }catch(err){
//     res.status(500).json({
//       success:false,
//       message:"Error deleting task",
//       error:err.message
//     })
//   }
// }


// module.exports = {
//   createTask,
//   getAllTasks,
//   getTask,
//   getMyTasks,
//   assignTask,
//   getTasksForTesting,
//   submitTask,
//   updateTask,
//   deleteTask
// }

const Task    = require("../models/TaskModel")
const Project = require("../models/ProjectModel")
const uploadToCloudinary = require("../utils/CloudinaryUtil")
const { notifyTaskAssigned, notifyTaskSubmitted } = require("../services/notificationService")

/* ===============================
   CREATE TASK
   FIX: module is now optional
================================ */
const createTask = async (req, res) => {
  try {
    const { title, description, project, module, createdBy, assignedTo, priority, dueDate } = req.body

    // FIX: removed `module` from required check — it is optional
    if (!title || !project || !createdBy) {
      return res.status(400).json({
        success: false,
        message: "title, project and createdBy are required"
      })
    }

    const projectData = await Project.findById(project)
    if (!projectData) {
      return res.status(404).json({ success: false, message: "Project not found" })
    }

    const existing = await Task.findOne({
      title:   { $regex: `^${title}$`, $options: "i" },
      project
    })
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Similar task already exists in this project"
      })
    }

    const lastTask = await Task.findOne({ project }).sort({ issueNumber: -1 })
    const issueNumber = lastTask?.issueNumber ? lastTask.issueNumber + 1 : 1
    const issueKey    = `${projectData.projectKey}-${issueNumber}`

    let attachmentUrl = null
    if (req.file) {
      const cloudinaryResponse = await uploadToCloudinary(req.file.path)
      attachmentUrl = cloudinaryResponse.secure_url
    }

    const taskData = {
      issueKey,
      issueNumber,
      title,
      description,
      project,
      createdBy,
      attachmentUrl,
      priority:   priority || "medium",
      dueDate:    dueDate  || null,
      // FIX: only include module and assignedTo if provided
      ...(module     && { module }),
      ...(assignedTo && { assignedTo, status: "assigned", assignedAt: new Date() }),
    }

    const task = await Task.create(taskData)

    const populatedTask = await Task.findById(task._id)
      .populate("project",    "name projectKey")
      .populate("module",     "name")
      .populate("createdBy",  "firstName lastName")
      .populate("assignedTo", "firstName lastName")

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: populatedTask
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error creating task",
      error: err.message
    })
  }
}

/* ===============================
   GET ALL TASKS
================================ */
const getAllTasks = async (req, res) => {
  try {
    const filter = {}
    if (req.query.project)    filter.project    = req.query.project
    if (req.query.module)     filter.module     = req.query.module
    if (req.query.status)     filter.status     = req.query.status
    if (req.query.assignedTo) filter.assignedTo = req.query.assignedTo

    const tasks = await Task.find(filter)
      .populate("project",    "name projectKey")
      .populate("module",     "name")
      .populate("assignedTo", "firstName lastName email")
      .populate("createdBy",  "firstName lastName email")
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      data: tasks
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching tasks",
      error: err.message
    })
  }
}

/* ===============================
   GET SINGLE TASK
================================ */
const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("project",    "name projectKey")
      .populate("module",     "name")
      .populate("assignedTo", "firstName lastName email")
      .populate("createdBy",  "firstName lastName email")

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" })
    }

    res.status(200).json({ success: true, message: "Task fetched successfully", data: task })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

const getMyTasks = async (req, res) => {
  try {
    const userId = req.query.userId
    const tasks  = await Task.find({ assignedTo: userId })
      .populate("project")
      .sort({ createdAt: -1 })
    res.json(tasks)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/* ===============================
   ASSIGN TASK
================================ */
const assignTask = async (req, res) => {
  try {
    const { developerId } = req.body

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { assignedTo: developerId, status: "assigned", assignedAt: new Date() },
      { new: true }
    ).populate("assignedTo", "firstName lastName email")

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" })
    }

    const developer = task.assignedTo
    const pm        = { _id: task.createdBy }
    await notifyTaskAssigned(task, developer, pm)

    res.status(200).json({ success: true, message: "Task assigned successfully", data: task })
  } catch (err) {
    res.status(500).json({ success: false, message: "Error assigning task", error: err.message })
  }
}

/* ===============================
   SUBMIT TASK
================================ */
const submitTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status: "submitted", submittedAt: new Date() },
      { new: true }
    )
      .populate("assignedTo", "firstName lastName email")
      .populate("createdBy",  "firstName lastName email")

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" })
    }

    const developer = task.assignedTo
    const tester    = { _id: task.createdBy }
    await notifyTaskSubmitted(task, tester, developer)

    res.status(200).json({ success: true, message: "Task submitted successfully", data: task })
  } catch (err) {
    res.status(500).json({ success: false, message: "Error submitting task", error: err.message })
  }
}

const getTasksForTesting = async (req, res) => {
  try {
    const tasks = await Task.find({ status: "submitted" })
      .populate("project",    "name projectKey")
      .populate("module",     "name")
      .populate("assignedTo", "firstName lastName")
      .sort({ createdAt: -1 })

    res.status(200).json({ success: true, data: tasks })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

/* ===============================
   UPDATE TASK
================================ */
const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("createdBy assignedTo", "firstName lastName email")

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" })
    }

    res.status(200).json({ success: true, message: "Task updated successfully", data: task })
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating task", error: err.message })
  }
}

/* ===============================
   DELETE TASK
================================ */
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id)
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" })
    }
    res.status(200).json({ success: true, message: "Task deleted successfully", data: task })
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting task", error: err.message })
  }
}

module.exports = {
  createTask,
  getAllTasks,
  getTask,
  getMyTasks,
  assignTask,
  getTasksForTesting,
  submitTask,
  updateTask,
  deleteTask
}