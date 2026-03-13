const router = require("express").Router()
const TaskController = require("../controllers/TaskController")

router.post("/", TaskController.createTask)
router.get("/", TaskController.getAllTasks)
router.get("/:id", TaskController.getTask)
router.patch("/:id/assign", TaskController.assignTask)
router.patch("/:id/submit", TaskController.submitTask)
router.put("/:id", TaskController.updateTask)
router.delete("/:id", TaskController.deleteTask)

module.exports = router