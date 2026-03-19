const express = require("express");
const router = express.Router();
const adminController = require("../controllers/AdminController");

router.get("/stats", adminController.getAdminStats);
router.get("/recent-users", adminController.getRecentUsers);
router.get("/projects", adminController.getAllProjects);

module.exports = router;