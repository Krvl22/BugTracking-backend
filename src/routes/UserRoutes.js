const router = require("express").Router()
const userController = require("../controllers/UserController")
const validateToken = require("../middleware/AuthMiddleware")

router.post("/register", userController.registerUser)
router.post("/login", userController.loginUser)
router.get("/", validateToken, userController.getAllUsers)
router.put("/:id", validateToken, userController.updateUser)
router.patch("/:id/block", validateToken, userController.blockUser)
router.patch("/:id/reactivate",validateToken, userController.reactivateUser)
router.delete("/:id", validateToken, userController.deleteUser)
router.post("/forgot-password", userController.forgotpassword)
router.post("/reset-password/:token", userController.resetPassword)

module.exports = router