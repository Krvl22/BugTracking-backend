const router = require("express").Router()
const TaskController = require("../controllers/TaskController")
const upload  = require("../middleware/UploadMiddleware")
const testMiddleware = require("../middleware/TestMiddleware")

router.post("/",upload.single("image") ,TaskController.createTask)
router.get("/",testMiddleware ,TaskController.getAllTasks)
router.get("/:id", TaskController.getTask)
router.patch("/:id/assign", TaskController.assignTask)
router.patch("/:id/submit", TaskController.submitTask)
router.put("/:id", TaskController.updateTask)
router.delete("/:id", TaskController.deleteTask)

module.exports = router