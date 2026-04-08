const express  = require("express")
const router   = express.Router()
const validateToken    = require("../middleware/AuthMiddleware")
const testerController = require("../controllers/TesterController")
const upload           = require("../middleware/UploadMiddleware")

router.get("/dashboard",              validateToken,                              testerController.getTesterDashboard)
router.get("/tasks",                  validateToken,                              testerController.getTasksForTesting)
router.get("/bugs",                   validateToken,                              testerController.getAllTesterBugs)
router.post("/bugs",                  validateToken, upload.single("attachment"), testerController.addBugComment)
router.patch("/tasks/:id/approve",    validateToken,                              testerController.approveTask)

// ✅ NEW ROUTES
router.patch("/tasks/:id/reject",     validateToken,                              testerController.rejectTask)
router.patch("/bugs/:id/status",      validateToken,                              testerController.updateBugStatus)
router.get("/history",                validateToken,                              testerController.getTestingHistory)
router.patch("/bugs/:id/resolve", validateToken, testerController.resolveBug)
router.patch("/bugs/:id/reopen",  validateToken, testerController.reopenBug)
module.exports = router