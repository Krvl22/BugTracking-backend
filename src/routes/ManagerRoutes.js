const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/AuthMiddleware")

const { getManagerDashboard } = require("../controllers/ManagerController");

router.get("/dashboard",validateToken, getManagerDashboard);

module.exports = router;