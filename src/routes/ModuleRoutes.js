const router = require("express").Router()
const ModuleController = require("../controllers/ModuleController")

router.post("/", ModuleController.createModule)
router.get("/project/:projectId", ModuleController.getAllModules)
router.get("/:id", ModuleController.getModule)
router.put("/:id", ModuleController.updateModule)
router.delete("/:id", ModuleController.deleteModule)

module.exports = router