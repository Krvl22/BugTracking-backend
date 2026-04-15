const router = require("express").Router()
const ProjectController = require("../controllers/ProjectController")
const ModuleController = require("../controllers/ModuleController")

const validateToken = require("../middleware/AuthMiddleware")

router.post("/", validateToken, ProjectController.createProject)
router.get("/", validateToken,ProjectController.getAllProjects)
router.get("/:id", validateToken,ProjectController.getProject)
router.put("/:id", validateToken,ProjectController.updateProject)
router.delete("/:id", validateToken, ProjectController.deleteProject)
router.patch("/:id/status", validateToken,ProjectController.changeProjectStatus)
router.patch("/:id/add-member", validateToken, ProjectController.addTeamMember)
router.delete("/:id/remove-member", validateToken, ProjectController.removeTeamMember)
router.patch("/:id/add-member", validateToken, ProjectController.addTeamMember)
router.delete("/:id/remove-member", validateToken, ProjectController.removeTeamMember)
router.post("/:id/modules", validateToken, ModuleController.createModule)
router.get("/:id/modules", validateToken, ModuleController.getAllModules)
module.exports = router