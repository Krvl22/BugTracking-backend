const router = require("express").Router()
const NotificationController = require("../controllers/NotificationController")
const validateToken = require("../middleware/AuthMiddleware")

router.get("/", validateToken,NotificationController.getMyNotifications)
router.put("/read-all",validateToken, NotificationController.markAllNotificationsRead)
router.put("/:id/read", validateToken,NotificationController.markNotificationRead)

module.exports = router