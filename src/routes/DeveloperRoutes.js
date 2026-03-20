const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/AuthMiddleware")

const { getMyTasks } = require("../controllers/TaskController");
const { getAssignedBugs } = require("../controllers/BugCommentController");

router.get("/tasks",validateToken, getMyTasks);
router.get("/bugs",validateToken, getAssignedBugs);

module.exports = router;