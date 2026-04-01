// const BugComment = require("../models/BugCommentModel")
// const Task = require("../models/TaskModel")
// const uploadToCloudinary = require("../utils/CloudinaryUtil")
// const { notifyBugFound } = require("../services/notificationService");

// // ADD BUG COMMENT
// const addBugComment = async (req,res)=>{
//   try{

//     const { taskId , comment , bugSeverity } = req.body

//     if(!taskId){
//       return res.status(400).json({
//         success:false,
//         message:"Task id is required"
//       })
//     }

//     if(!comment){
//       return res.status(400).json({
//         success:false,
//         message:"Bug comment is required"
//       })
//     }

//     const task = await Task.findById(taskId)
//     .populate("assignedTo createdBy", "firstName lastName email");

//     if(!task){
//       return res.status(404).json({
//         success:false,
//         message:"Task not found"
//       })
//     }

//     let attachmentUrl = null

//     if(req.file){
//       const cloudinaryResponse = await uploadToCloudinary(req.file.path)
//       attachmentUrl = cloudinaryResponse.secure_url
//     }

//     const bug = await BugComment.create({
//       task:taskId,
//       commentedBy:req.user._id,
//       comment,
//       bugSeverity:bugSeverity || "medium",
//       attachmentUrl
//     })

//     task.status = "bug_found"
//     await task.save()
//     const developer = task.assignedTo;
//     const tester = req.user;

//     await notifyBugFound(task, developer, tester, comment);
//     res.status(201).json({
//       success:true,
//       message:"Bug comment added successfully",
//       data:bug
//     })

//   }catch(err){
//     res.status(500).json({
//       success:false,
//       message:"Error adding bug comment",
//       error:err.message
//     })
//   }
// }


// const getBugComments = async (req,res)=>{
//   try{

//     const bugs = await BugComment.find({ task:req.params.taskId })
//       .populate("task","issueKey title")
//       .populate("commentedBy","firstName lastName email role")
//       .sort({ createdAt:-1 })

//     res.status(200).json({
//       success:true,
//       count:bugs.length,
//       data:bugs
//     })

//   }catch(err){
//     res.status(500).json({
//       success:false,
//       error:err.message
//     })
//   }
// }



// // RESOLVE BUG
// const resolveBug = async (req,res)=>{
//   try{

//     const bug = await BugComment.findByIdAndUpdate(
//       req.params.id,
//       {
//         resolved:true,
//         resolvedAt:new Date()
//       },
//       { new:true }
//     ).populate("task")

//     if(!bug){
//       return res.status(404).json({
//         success:false,
//         message:"Bug not found"
//       })
//     }

//   const task = await Task.findById(bug.task)
//     .populate("assignedTo createdBy", "firstName lastName email");

//   const developer = task.assignedTo;
//   const tester = bug.commentedBy;

// await notifyTaskCompleted(task, [tester]);

//     res.status(200).json({
//       success:true,
//       message:"Bug resolved successfully",
//       data:bug
//     })

//   }catch(err){
//     res.status(500).json({
//       success:false,
//       message:"Error resolving bug",
//       error:err.message
//     })
//   }
// }

// // If you want bugs reported ON a tester's tasks:
// const getAssignedBugs = async (req, res) => {
//   try {
//     const userId = req.query.userId;

//     const bugs = await BugComment.find({ commentedBy: userId })
//       .populate("task", "issueKey title")
//       .populate("commentedBy", "firstName lastName")
//       .sort({ createdAt: -1 });

//     res.status(200).json({ success: true, data: bugs });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };


// const getMyReportedBugs = async (req, res) => {
//   try {
//     const userId = req.query.userId;

//     const bugs = await BugComment.find({ commentedBy: userId })
//       .populate("task", "issueKey title")
//       .populate("commentedBy", "firstName lastName")
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       data: bugs
//     });

//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       error: err.message
//     });
//   }
// };

// // GET ALL BUG COMMENTS
// const getAllBugComments = async (req, res) => {
//   try {
//     const bugs = await BugComment.find()
//       .populate("task", "title issueKey")
//       .populate("commentedBy", "firstName lastName")
//       .sort({ createdAt: -1 })

//     res.status(200).json({
//       success: true,
//       data: bugs
//     })
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message })
//   }
// }

// module.exports = {
//   addBugComment,
//   getBugComments,
//   resolveBug,
//   getAssignedBugs,
//   getMyReportedBugs,
//   getAllBugComments
// }

// const BugComment = require("../models/BugCommentModel");
// const Task = require("../models/TaskModel");
// const uploadToCloudinary = require("../utils/CloudinaryUtil");
// const { notifyBugFound } = require("../services/notificationService");

// // ADD BUG COMMENT
// const addBugComment = async (req, res) => {
//   try {
//     const { taskId, comment, bugSeverity } = req.body;

//     if (!taskId) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Task id is required" });
//     }

//     if (!comment) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Bug comment is required" });
//     }

//     const task = await Task.findById(taskId).populate(
//       "assignedTo createdBy",
//       "firstName lastName email"
//     );

//     if (!task) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Task not found" });
//     }

//     let attachmentUrl = null;

//     if (req.file) {
//       const cloudinaryResponse = await uploadToCloudinary(req.file.path);
//       attachmentUrl = cloudinaryResponse.secure_url;
//     }

//     const bug = await BugComment.create({
//       task: taskId,
//       commentedBy: req.user._id,
//       comment,
//       bugSeverity: bugSeverity || "medium",
//       attachmentUrl,
//     });

//     task.status = "bug_found";
//     await task.save();

//     const developer = task.assignedTo;
//     const tester = req.user;

//     try {
//       await notifyBugFound(task, developer, tester, comment);
//     } catch (notifyErr) {
//       console.error("Notification error:", notifyErr.message);
//       // Don't fail the request if notification fails
//     }

//     res.status(201).json({
//       success: true,
//       message: "Bug comment added successfully",
//       data: bug,
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: "Error adding bug comment",
//       error: err.message,
//     });
//   }
// };

// const getBugComments = async (req, res) => {
//   try {
//     const bugs = await BugComment.find({ task: req.params.taskId })
//       .populate("task", "issueKey title")
//       .populate("commentedBy", "firstName lastName email role")
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       count: bugs.length,
//       data: bugs,
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       error: err.message,
//     });
//   }
// };

// // RESOLVE BUG
// const resolveBug = async (req, res) => {
//   try {
//     const bug = await BugComment.findByIdAndUpdate(
//       req.params.id,
//       {
//         resolved: true,
//         resolvedAt: new Date(),
//       },
//       { new: true }
//     ).populate("task commentedBy");

//     if (!bug) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Bug not found" });
//     }

//     // Update task status back to in_progress so developer can fix and resubmit
//     if (bug.task) {
//       await Task.findByIdAndUpdate(bug.task._id || bug.task, {
//         status: "fix_in_progress",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Bug resolved successfully",
//       data: bug,
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: "Error resolving bug",
//       error: err.message,
//     });
//   }
// };

// // Bugs reported by a specific user
// const getAssignedBugs = async (req, res) => {
//   try {
//     const userId = req.query.userId;

//     const bugs = await BugComment.find({ commentedBy: userId })
//       .populate("task", "issueKey title")
//       .populate("commentedBy", "firstName lastName")
//       .sort({ createdAt: -1 });

//     res.status(200).json({ success: true, data: bugs });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// const getMyReportedBugs = async (req, res) => {
//   try {
//     const userId = req.query.userId;

//     const bugs = await BugComment.find({ commentedBy: userId })
//       .populate("task", "issueKey title")
//       .populate("commentedBy", "firstName lastName")
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       data: bugs,
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       error: err.message,
//     });
//   }
// };

// // GET ALL BUG COMMENTS
// const getAllBugComments = async (req, res) => {
//   try {
//     const bugs = await BugComment.find()
//       .populate("task", "title issueKey")
//       .populate("commentedBy", "firstName lastName")
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       data: bugs,
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// module.exports = {
//   addBugComment,
//   getBugComments,
//   resolveBug,
//   getAssignedBugs,
//   getMyReportedBugs,
//   getAllBugComments,
// };


const BugComment = require("../models/BugCommentModel")
const Task       = require("../models/TaskModel")
const uploadToCloudinary = require("../utils/CloudinaryUtil")
const { notifyBugFound } = require("../services/notificationService")
const { createAuditLog } = require("../utils/AuditLogHelper") 

const addBugComment = async (req, res) => {
  try {
    const { taskId, comment, bugSeverity } = req.body
    if (!taskId)   return res.status(400).json({ success: false, message: "Task id is required" })
    if (!comment)  return res.status(400).json({ success: false, message: "Bug comment is required" })

    const task = await Task.findById(taskId).populate("assignedTo createdBy", "firstName lastName email")
    if (!task) return res.status(404).json({ success: false, message: "Task not found" })

    let attachmentUrl = null
    if (req.file) {
      const cloudRes = await uploadToCloudinary(req.file.path)
      attachmentUrl  = cloudRes.secure_url
    }

    const bug = await BugComment.create({
      task: taskId, commentedBy: req.user._id,
      comment, bugSeverity: bugSeverity || "medium", attachmentUrl
    })
    await createAuditLog({
      action: "bug_reported",
      performedBy: req.user._id,
      performedByRole: req.user.role,
      targetEntity: "bug",
      targetId: bug._id,
      targetName: comment
    })

    task.status = "bug_found"
    await task.save()

    try { await notifyBugFound(task, task.assignedTo, req.user, comment) }
    catch (e) { console.error("Notification error:", e.message) }

    res.status(201).json({ success: true, message: "Bug comment added successfully", data: bug })
  } catch (err) {
    res.status(500).json({ success: false, message: "Error adding bug comment", error: err.message })
  }
}

const getBugComments = async (req, res) => {
  try {
    const bugs = await BugComment.find({ task: req.params.taskId })
      .populate("task",        "issueKey title")
      .populate("commentedBy", "firstName lastName email role")
      .sort({ createdAt: -1 })
    res.status(200).json({ success: true, count: bugs.length, data: bugs })
  } catch (err) { res.status(500).json({ success: false, error: err.message }) }
}

// NEW — used by /bugcomments/:id for Bug Details pages
const getSingleBug = async (req, res) => {
  try {
    const bug = await BugComment.findById(req.params.id)
      .populate("task",        "title issueKey status")
      .populate("commentedBy", "firstName lastName email role")
    if (!bug) return res.status(404).json({ success: false, message: "Bug not found" })
    res.status(200).json({ success: true, data: bug })
  } catch (err) { res.status(500).json({ success: false, error: err.message }) }
}

const resolveBug = async (req, res) => {
  try {
    const bug = await BugComment.findByIdAndUpdate(
      req.params.id,
      { resolved: true, resolvedAt: new Date() },
      { new: true }
    ).populate("task commentedBy")
    await createAuditLog({
      action: "bug_resolved",
      performedBy: req.user._id,
      performedByRole: req.user.role,
      targetEntity: "bug",
      targetId: bug._id,
      targetName: bug.comment
    })

    if (!bug) return res.status(404).json({ success: false, message: "Bug not found" })

    if (bug.task) {
      await Task.findByIdAndUpdate(bug.task._id || bug.task, { status: "fix_in_progress" })
    }

    res.status(200).json({ success: true, message: "Bug resolved successfully", data: bug })
  } catch (err) {
    res.status(500).json({ success: false, message: "Error resolving bug", error: err.message })
  }
}

const getAssignedBugs = async (req, res) => {
  try {
    const bugs = await BugComment.find({ commentedBy: req.query.userId })
      .populate("task",        "issueKey title")
      .populate("commentedBy", "firstName lastName")
      .sort({ createdAt: -1 })
    res.status(200).json({ success: true, data: bugs })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
}

const getMyReportedBugs = async (req, res) => {
  try {
    const bugs = await BugComment.find({ commentedBy: req.query.userId })
      .populate("task",        "issueKey title")
      .populate("commentedBy", "firstName lastName")
      .sort({ createdAt: -1 })
    res.status(200).json({ success: true, data: bugs })
  } catch (err) { res.status(500).json({ success: false, error: err.message }) }
}

const getAllBugComments = async (req, res) => {
  try {
    const bugs = await BugComment.find()
      .populate("task",        "title issueKey")
      .populate("commentedBy", "firstName lastName")
      .sort({ createdAt: -1 })
    res.status(200).json({ success: true, data: bugs })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
}

module.exports = {
  addBugComment, getBugComments, getSingleBug,
  resolveBug, getAssignedBugs, getMyReportedBugs, getAllBugComments
}