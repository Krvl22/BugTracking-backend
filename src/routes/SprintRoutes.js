const express = require("express")
const router = express.Router()

const validateToken = require("../middleware/AuthMiddleware")
const sprintController = require("../controllers/SprintController")

router.post("/", validateToken, sprintController.createSprint)
router.get("/", validateToken, sprintController.getSprints)

module.exports = router