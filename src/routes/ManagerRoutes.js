// const express = require("express");
// const router = express.Router();
// const validateToken = require("../middleware/AuthMiddleware");
// const ManagerController = require("../controllers/ManagerController");

// router.get("/dashboard",validateToken, ManagerController.getManagerDashboard);
// router.get("/projects",validateToken, ManagerController.getManagerProjects);
// router.get("/team",validateToken , ManagerController.getAllTeamMembers)
// router.get("/bugs",validateToken, ManagerController.getAllManagerBugs)
// router.get("/tasks",validateToken,ManagerController.getManagerTasks)
// router.post("/tasks",validateToken, ManagerController.createTask)
// router.get("/reports",validateToken, ManagerController.getManagerReports)
// router.patch("/projects/:id/add-member",validateToken, ManagerController.addMemberToProject)
// router.patch("/projects/:id/remove-member",validateToken, ManagerController.removeMemberToProject)
// module.exports = router;


const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/AuthMiddleware");
const ManagerController = require("../controllers/ManagerController");

router.get("/dashboard",                    validateToken, ManagerController.getManagerDashboard);
router.get("/projects",                     validateToken, ManagerController.getManagerProjects);
router.get("/my-project",                   validateToken, ManagerController.getManagerProject);   // NEW
router.get("/team",                         validateToken, ManagerController.getAllTeamMembers);
router.get("/bugs",                         validateToken, ManagerController.getAllManagerBugs);
router.get("/tasks",                        validateToken, ManagerController.getManagerTasks);
router.post("/tasks",                       validateToken, ManagerController.createTask);
router.get("/reports",                      validateToken, ManagerController.getManagerReports);
router.patch("/projects/:id/add-member",    validateToken, ManagerController.addMemberToProject);
router.patch("/projects/:id/remove-member", validateToken, ManagerController.removeMemberToProject);

module.exports = router;