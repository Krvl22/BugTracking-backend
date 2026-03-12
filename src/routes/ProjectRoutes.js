const router=require("express").Router()
const ProjectController = require("../controllers/ProjectController")

router.post("/create",ProjectController.createProject)
router.get("/all",ProjectController.getAllProjects)
router.get("/:id",ProjectController.getProject)
router.put("/:id",ProjectController.updateProject)
router.delete("/:id",ProjectController.deleteProject)

module.exports=router