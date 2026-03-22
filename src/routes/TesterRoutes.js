const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/AuthMiddleware")
const testerController = require("../controllers/TesterController")

router.get("/dashboard", validateToken, testerController.getTesterDashboard)
router.get("/tasks", validateToken, testerController.getTasksForTesting)
router.get("/bugs", validateToken, testerController.getAllTesterBugs)
router.post("/bugs", validateToken, testerController.addBugComment)
router.patch("/tasks/:id/approve", validateToken, testerController.approveTask)

module.exports = router;