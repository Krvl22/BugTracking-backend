const router = require("express").Router()
const NotificationController = require("../controllers/NotificationController")

router.get("/", NotificationController.getMyNotifications)
router.put("/read-all", NotificationController.markAllNotificationsRead)
router.put("/:id/read", NotificationController.markNotificationRead)

module.exports = router