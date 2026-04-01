const router = require("express").Router()
const TaskController = require("../controllers/TaskController")
const upload  = require("../middleware/UploadMiddleware")
const validateToken = require("../middleware/AuthMiddleware")

router.post("/",validateToken,upload.single("image") ,TaskController.createTask)
router.get("/",validateToken,TaskController.getAllTasks)
router.get("/:id",validateToken, TaskController.getTask)
router.patch("/:id/assign",validateToken, TaskController.assignTask)
router.patch("/:id/submit",validateToken, TaskController.submitTask)
router.put("/:id",validateToken, TaskController.updateTask)
router.delete("/:id",validateToken, TaskController.deleteTask)
router.get("/testing-queue", validateToken, TaskController.getTasksForTesting);

module.exports = router