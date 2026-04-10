const router = require("express").Router()
const BugCommentController = require("../controllers/BugCommentController")
const upload        = require("../middleware/UploadMiddleware")
const validateToken = require("../middleware/AuthMiddleware")

router.get("/",               validateToken,                         BugCommentController.getAllBugComments)
router.post("/",              validateToken, upload.single("image"), BugCommentController.addBugComment)
router.get("/task/:taskId",   validateToken,                         BugCommentController.getBugComments)
router.get("/:id",            validateToken,                         BugCommentController.getSingleBug)
router.patch("/:id/resolve",  validateToken,                         BugCommentController.resolveBug)

module.exports = router