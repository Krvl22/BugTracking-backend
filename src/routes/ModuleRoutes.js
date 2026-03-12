const router = require("express").Router()
const ModuleController = require("../controllers/ModuleController")
router.get("/project/:projectId", ModuleController.getAllModules)
router.get("/all", ModuleController.getAllModules)
router.post("/create",ModuleController.createModule)
router.get("/:id",ModuleController.getModule)
router.put("/:id",ModuleController.updateModule)
router.delete("/:id",ModuleController.deleteModule)
module.exports=router