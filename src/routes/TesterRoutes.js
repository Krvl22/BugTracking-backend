// // const express = require("express");
// // const router = express.Router();
// // const validateToken = require("../middleware/AuthMiddleware")
// // const testerController = require("../controllers/TesterController")

// // router.get("/dashboard", validateToken, testerController.getTesterDashboard)
// // router.get("/tasks", validateToken, testerController.getTasksForTesting)
// // router.get("/bugs", validateToken, testerController.getAllTesterBugs)
// // router.post("/bugs", validateToken, testerController.addBugComment)
// // router.patch("/tasks/:id/approve", validateToken, testerController.approveTask)

// // module.exports = router;

// // const express = require("express");
// // const router = express.Router();
// // const validateToken = require("../middleware/AuthMiddleware");
// // const testerController = require("../controllers/TesterController");
// // const upload = require("../middleware/UploadMiddleware");

// // router.get("/dashboard", validateToken, testerController.getTesterDashboard);
// // router.get("/tasks", validateToken, testerController.getTasksForTesting);
// // router.get("/bugs", validateToken, testerController.getAllTesterBugs);
// // // upload.single("image") allows file attachment when reporting a bug
// // router.post(
// //   "/bugs",
// //   validateToken,
// //   upload.single("image"),
// //   testerController.addBugComment
// // );
// // router.patch(
// //   "/tasks/:id/approve",
// //   validateToken,
// //   testerController.approveTask
// // );

// // module.exports = router;


// const router = require("express").Router();
// const BugCommentController = require("../controllers/BugCommentController");
// const upload = require("../middleware/UploadMiddleware");
// const validateToken = require("../middleware/AuthMiddleware");

// // GET all bug comments
// router.get("/", validateToken, BugCommentController.getAllBugComments);

// // POST new bug comment — upload.single("image") handles optional file
// router.post(
//   "/",
//   validateToken,
//   upload.single("image"),
//   BugCommentController.addBugComment
// );

// // GET bug comments for a specific task
// router.get("/task/:taskId", validateToken, BugCommentController.getBugComments);

// // PATCH resolve a bug
// router.patch("/:id/resolve", validateToken, BugCommentController.resolveBug);

// module.exports = router;


const express  = require("express")
const router   = express.Router()
const validateToken    = require("../middleware/AuthMiddleware")
const testerController = require("../controllers/TesterController")
const upload           = require("../middleware/UploadMiddleware")

router.get("/dashboard",           validateToken,                              testerController.getTesterDashboard)
router.get("/tasks",               validateToken,                              testerController.getTasksForTesting)
router.get("/bugs",                validateToken,                              testerController.getAllTesterBugs)
router.post("/bugs",               validateToken, upload.single("attachment"), testerController.addBugComment)
router.patch("/tasks/:id/approve", validateToken,                              testerController.approveTask)

module.exports = router