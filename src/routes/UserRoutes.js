const router = require("express").Router()
const userController = require("../controllers/UserController")

router.post("/register", userController.registerUser)
router.post("/login", userController.loginUser)
router.get("/", userController.getAllUsers)
router.put("/:id", userController.updateUser)
router.patch("/:id/block", userController.blockUser)
router.patch("/:id/reactivate", userController.reactivateUser)
router.delete("/:id", userController.deleteUser)
router.post("/forgot-password", userController.forgotPassword)
router.post("/reset-password/:token", userController.resetPassword)
module.exports = router