const router = require("express").Router()
const ModuleController = require("../controllers/ModuleController")
const validateToken = require("../middleware/AuthMiddleware")

router.post("/", validateToken,ModuleController.createModule)
router.get("/project/:projectId",validateToken, ModuleController.getAllModules)
router.get("/:id",validateToken, ModuleController.getModule)
router.put("/:id",validateToken, ModuleController.updateModule)
router.delete("/:id",validateToken, ModuleController.deleteModule)

module.exports = router