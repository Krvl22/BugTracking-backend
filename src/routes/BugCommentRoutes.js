const router = require("express").Router()
const BugCommentController = require("../controllers/BugCommentController")
const upload  = require("../middleware/UploadMiddleware")
const testMiddleware = require("../middleware/TestMiddleware")
router.post("/",upload.single("image") ,BugCommentController.addBugComment)
router.get("/task/:taskId",testMiddleware,BugCommentController.getBugComments)
router.patch("/:id/resolve", BugCommentController.resolveBug)

module.exports = router