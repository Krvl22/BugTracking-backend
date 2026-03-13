const router = require("express").Router()
const AuditLogController = require("../controllers/AuditLogController")

router.get("/", AuditLogController.getAllLogs)
router.get("/user/:userId", AuditLogController.getLogsByUser)
router.get("/entity/:entityType/:entityId", AuditLogController.getLogsByEntity)

module.exports = router