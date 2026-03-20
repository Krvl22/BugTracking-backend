const router = require("express").Router()
const AuditLogController = require("../controllers/AuditLogController")
const validateToken = require("../middleware/AuthMiddleware")

router.get("/",validateToken, AuditLogController.getAllLogs)
router.get("/user/:userId", validateToken,AuditLogController.getLogsByUser)
router.get("/entity/:entityType/:entityId",validateToken, AuditLogController.getLogsByEntity)

module.exports = router