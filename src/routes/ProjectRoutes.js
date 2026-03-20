const router = require("express").Router()
const ProjectController = require("../controllers/ProjectController")
const validateToken = require("../middleware/AuthMiddleware")

router.post("/", validateToken, ProjectController.createProject)
router.get("/", validateToken,ProjectController.getAllProjects)
router.get("/:id", validateToken,ProjectController.getProject)
router.put("/:id", validateToken,ProjectController.updateProject)
router.delete("/:id", validateToken, ProjectController.deleteProject)
router.patch("/:id/status", validateToken,ProjectController.changeProjectStatus)
router.patch("/:id/add-member", validateToken, ProjectController.addTeamMember)
router.delete("/:id/remove-member", validateToken, ProjectController.removeTeamMember)
module.exports = router