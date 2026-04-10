
const router = require("express").Router()
const userController = require("../controllers/UserController")
const validateToken = require("../middleware/AuthMiddleware")
const upload = require("../middleware/UploadMiddleware")

router.post("/register", userController.registerUser)
router.post("/login", userController.loginUser)
router.post("/forgot-password", userController.forgotpassword)
router.post("/reset-password/:token", userController.resetPassword)
router.get("/", validateToken, userController.getAllUsers)
router.patch("/profile-pic", validateToken, upload.single("profilePic"), userController.updateProfilePic)
router.patch("/profile-pic/remove", validateToken, userController.removeProfilePic)

router.put("/:id", validateToken, userController.updateUser)
router.patch("/:id/block", validateToken, userController.blockUser)
router.patch("/:id/reactivate", validateToken, userController.reactivateUser)
router.delete("/:id", validateToken, userController.deleteUser)

module.exports = router