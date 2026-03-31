// const express = require("express");
// const router = express.Router();
// const validateToken = require("../middleware/AuthMiddleware")
// const developerController = require("../controllers/DeveloperController")

// router.get("/projects", validateToken, developerController.getDeveloperProjects)
// router.get("/bugs", validateToken, developerController.getAllDeveloperBugs)
// router.get("/tasks", validateToken, developerController.getDeveloperTasks)
// router.patch("/tasks/:id/submit", validateToken, developerController.submitTasks)

// module.exports = router;

const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/AuthMiddleware");
const developerController = require("../controllers/DeveloperController");
const upload = require("../middleware/UploadMiddleware");

router.get("/projects", validateToken, developerController.getDeveloperProjects);
router.get("/bugs", validateToken, developerController.getAllDeveloperBugs);
router.get("/tasks", validateToken, developerController.getDeveloperTasks);
router.patch(
  "/tasks/:id/submit",
  validateToken,
  upload.single("file"),
  developerController.submitTasks
);

module.exports = router;