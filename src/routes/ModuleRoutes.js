const router = require("express").Router()
const ModuleController = require("../controllers/ModuleController")
const validateToken    = require("../middleware/AuthMiddleware")

// FIX: added GET / route so /modules?projectId=xxx works
// Frontend fetches /modules?projectId=xxx — this was missing, causing modules to always return empty
router.get("/",                   validateToken, ModuleController.getAllModules)
router.post("/",                  validateToken, ModuleController.createModule)
router.get("/project/:projectId", validateToken, ModuleController.getAllModules)  // keep for backward compat
router.get("/:id",                validateToken, ModuleController.getModule)
router.put("/:id",                validateToken, ModuleController.updateModule)
router.delete("/:id",             validateToken, ModuleController.deleteModule)

module.exports = router