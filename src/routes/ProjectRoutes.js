const router = require("express").Router()
const ProjectController = require("../controllers/ProjectController")
router.post("/", ProjectController.createProject)
router.get("/", ProjectController.getAllProjects)
router.get("/:id", ProjectController.getProject)
router.put("/:id", ProjectController.updateProject)
router.delete("/:id", ProjectController.deleteProject)
router.patch("/:id/status", ProjectController.changeProjectStatus)
module.exports = router