const BugComment = require("../models/BugCommentModel")
const Task = require("../models/TaskModel")
const uploadToCloudinary = require("../utils/CloudinaryUtil")

// ADD BUG COMMENT
const addBugComment = async (req,res)=>{
  try{

    const { taskId , comment , bugSeverity } = req.body

    if(!taskId){
      return res.status(400).json({
        success:false,
        message:"Task id is required"
      })
    }

    if(!comment){
      return res.status(400).json({
        success:false,
        message:"Bug comment is required"
      })
    }

    const task = await Task.findById(taskId)

    if(!task){
      return res.status(404).json({
        success:false,
        message:"Task not found"
      })
    }

    let attachmentUrl = null

    if(req.file){
      const cloudinaryResponse = await uploadToCloudinary(req.file.path)
      attachmentUrl = cloudinaryResponse.secure_url
    }

    const bug = await BugComment.create({
      task:taskId,
      commentedBy:req.user._id,
      comment,
      bugSeverity:bugSeverity || "medium",
      attachmentUrl
    })

    task.status = "bug_found"
    await task.save()

    res.status(201).json({
      success:true,
      message:"Bug comment added successfully",
      data:bug
    })

  }catch(err){
    res.status(500).json({
      success:false,
      message:"Error adding bug comment",
      error:err.message
    })
  }
}

module.exports = {
  addBugComment
}

const getBugComments = async (req,res)=>{
  try{

    const bugs = await BugComment.find({ task:req.params.taskId })
      .populate("task","issueKey title")
      .populate("commentedBy","firstName lastName email role")
      .sort({ createdAt:-1 })

    res.status(200).json({
      success:true,
      count:bugs.length,
      data:bugs
    })

  }catch(err){
    res.status(500).json({
      success:false,
      error:err.message
    })
  }
}



// RESOLVE BUG
const resolveBug = async (req,res)=>{
  try{

    const bug = await BugComment.findByIdAndUpdate(
      req.params.id,
      {
        resolved:true,
        resolvedAt:new Date()
      },
      { new:true }
    )

    if(!bug){
      return res.status(404).json({
        success:false,
        message:"Bug not found"
      })
    }

    res.status(200).json({
      success:true,
      message:"Bug resolved successfully",
      data:bug
    })

  }catch(err){
    res.status(500).json({
      success:false,
      message:"Error resolving bug",
      error:err.message
    })
  }
}


const getAssignedBugs = async (req, res) => {
  try {
    const userId = req.query.userId;

    const bugs = await Bug.find({ assignedTo: userId })
      .populate("reportedBy")
      .sort({ createdAt: -1 });

    res.json(bugs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getMyReportedBugs = async (req, res) => {
  try {
    const userId = req.query.userId;

    const bugs = await BugComment.find({ commentedBy: userId })
      .populate("task", "issueKey title")
      .populate("commentedBy", "firstName lastName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: bugs
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};


module.exports = {
  addBugComment,
  getBugComments,
  resolveBug,
  getAssignedBugs,
  getMyReportedBugs
}

