const router = require("express").Router()
const BugCommentController = require("../controllers/BugCommentController")

router.post("/", BugCommentController.addBugComment)
router.get("/task/:taskId", BugCommentController.getBugComments)
router.patch("/:id/resolve", BugCommentController.resolveBug)

module.exports = router