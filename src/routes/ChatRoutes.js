const express    = require("express")
const router     = express.Router()
const validateToken  = require("../middleware/AuthMiddleware")
const { getMessages, sendMessage } = require("../controllers/ChatController")

router.get("/:taskId",  validateToken, getMessages)
router.post("/:taskId", validateToken, sendMessage)

module.exports = router