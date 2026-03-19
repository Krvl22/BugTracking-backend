const express = require("express");
const router = express.Router();

const { getMyTasks } = require("../controllers/TaskController");
const { getAssignedBugs } = require("../controllers/BugCommentController");

router.get("/tasks", getMyTasks);
router.get("/bugs", getAssignedBugs);

module.exports = router;