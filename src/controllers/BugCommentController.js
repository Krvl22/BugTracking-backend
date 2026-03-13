const BugComment = require("../models/BugCommentModel")
const Task = require("../models/TaskModel")

// ADD BUG COMMENT
const addBugComment = async (req,res)=>{
  try{

    const { taskId , comment , bugSeverity , attachmentUrl } = req.body

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

    const bug = await BugComment.create({
      task:taskId,
      commentedBy:req.user._id,
      comment,
      bugSeverity:bugSeverity || "medium",
      attachmentUrl
    })

    // change task status when bug reported
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



// GET BUG COMMENTS FOR A TASK
const getBugComments = async (req,res)=>{
  try{

    const bugs = await BugComment.find({ task:req.params.taskId })
      .populate("commentedBy","firstName lastName email role")
      .sort({ createdAt:-1 })

    res.status(200).json({
      success:true,
      message:"Bug comments fetched successfully",
      count:bugs.length,
      data:bugs
    })

  }catch(err){
    res.status(500).json({
      success:false,
      message:"Error fetching bug comments",
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



module.exports = {
  addBugComment,
  getBugComments,
  resolveBug
}