const express = require("express");
const router = express.Router();
const adminController = require("../controllers/AdminController");
const validateToken = require("../middleware/AuthMiddleware"); // ✅ add this

router.get("/stats",validateToken ,adminController.getAdminStats);
router.get("/recent-users",validateToken ,adminController.getRecentUsers);
router.get("/projects",validateToken, adminController.getAllProjects);

module.exports = router;