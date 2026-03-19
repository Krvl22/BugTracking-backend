const express = require("express");
const router = express.Router();

const { getTasksForTesting } = require("../controllers/TaskController");
const { getMyReportedBugs } = require("../controllers/BugCommentController");

router.get("/tasks", getTasksForTesting);
router.get("/my-bugs", getMyReportedBugs);

module.exports = router;