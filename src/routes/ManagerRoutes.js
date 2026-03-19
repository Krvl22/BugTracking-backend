const express = require("express");
const router = express.Router();

const { getManagerDashboard } = require("../controllers/ManagerController");

router.get("/dashboard", getManagerDashboard);

module.exports = router;