const AuditLog = require("../models/AuditLogModel")


// ─────────────────────────────────────────
// HELPER FUNCTION
// Used internally by other controllers
// ─────────────────────────────────────────
const createAuditLog = async ({
  action,
  performedBy,
  performedByRole,
  targetEntity,
  targetId,
  targetName = "",
  details = ""
}) => {

  try {

    await AuditLog.create({
      action,
      performedBy,
      performedByRole,
      targetEntity,
      targetId,
      targetName,
      details
    })

  } catch (err) {

    // Audit logging should never break the main request
    console.error("Audit log failed:", err.message)

  }

}



// ─────────────────────────────────────────
// GET ALL LOGS (Admin)
// GET /api/audit
// ─────────────────────────────────────────
const getAllLogs = async (req,res)=>{

  try{

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit

    const total = await AuditLog.countDocuments()

    const logs = await AuditLog.find()
      .populate("performedBy","firstName lastName email role")
      .sort({ createdAt:-1 })
      .skip(skip)
      .limit(limit)

    res.status(200).json({
      success:true,
      message:"Audit logs fetched successfully",
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data:logs
    })

  }
  catch(err){

    res.status(500).json({
      success:false,
      message:"Error fetching audit logs",
      error:err.message
    })

  }

}



// ─────────────────────────────────────────
// GET LOGS BY USER
// GET /api/audit/user/:userId
// ─────────────────────────────────────────
const getLogsByUser = async (req,res)=>{

  try{

    const logs = await AuditLog.find({
      performedBy:req.params.userId
    })
      .populate("performedBy","firstName lastName email role")
      .sort({ createdAt:-1 })

    res.status(200).json({
      success:true,
      message:"User audit logs fetched",
      data:logs
    })

  }
  catch(err){

    res.status(500).json({
      success:false,
      message:"Error fetching user logs",
      error:err.message
    })

  }

}



// ─────────────────────────────────────────
// GET LOGS BY ENTITY
// GET /api/audit/entity/:entityType/:entityId
// Example: task history
// ─────────────────────────────────────────
const getLogsByEntity = async (req,res)=>{

  try{

    const { entityType , entityId } = req.params

    const logs = await AuditLog.find({
      targetEntity:entityType,
      targetId:entityId
    })
      .populate("performedBy","firstName lastName email role")
      .sort({ createdAt:-1 })

    res.status(200).json({
      success:true,
      message:"Entity audit history fetched",
      count:logs.length,
      data:logs
    })

  }
  catch(err){

    res.status(500).json({
      success:false,
      message:"Error fetching entity logs",
      error:err.message
    })

  }

}



module.exports = {
  createAuditLog,
  getAllLogs,
  getLogsByUser,
  getLogsByEntity
}