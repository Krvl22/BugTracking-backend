const AuditLog = require("../models/AuditLogModel")

const createAuditLog = async ({
  action,
  performedBy,
  performedByRole,
  targetEntity,
  targetId,
  targetName,
  details
}) => {
  try {
    await AuditLog.create({
      action,
      performedBy,
      performedByRole,
      targetEntity,
      targetId,
      targetName,
      details: details || "",
      createdAt: new Date()
    })
  } catch (err) {
    console.error("Audit Log Error:", err.message)
  }
}

module.exports = { createAuditLog }