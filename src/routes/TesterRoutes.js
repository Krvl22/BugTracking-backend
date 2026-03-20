const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/AuthMiddleware")

const { getTasksForTesting } = require("../controllers/TaskController");
const { getMyReportedBugs } = require("../controllers/BugCommentController");

router.get("/tasks", validateToken,getTasksForTesting);
router.get("/my-bugs",validateToken, getMyReportedBugs);

module.exports = router;