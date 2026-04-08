  const express = require("express")
  const app = express()
  const cors = require("cors")
  require("dotenv").config()
  app.use(express.json())
  app.use(cors())

  const DBConnection = require("./src/utils/DBConnection")
  DBConnection()

  const userRoutes = require("./src/routes/UserRoutes")
  app.use("/users", userRoutes)

  const projectRoutes = require("./src/routes/ProjectRoutes")
  app.use("/projects", projectRoutes)

  const moduleRoutes = require("./src/routes/ModuleRoutes")
  app.use("/projects/:projectId/modules", moduleRoutes)
  app.use("/modules", moduleRoutes)

  const taskRoutes = require("./src/routes/TaskRoutes")
  app.use("/tasks", taskRoutes)

  const bugRoutes = require("./src/routes/BugCommentRoutes")
  app.use("/bugcomments", bugRoutes)

  const notificationRoutes = require("./src/routes/NotificationRoutes")
  app.use("/notifications", notificationRoutes)

  const auditRoutes = require("./src/routes/AuditLogRoutes")
  app.use("/audit", auditRoutes)

  const sprintRoutes = require("./src/routes/SprintRoutes")
  app.use("/sprints", sprintRoutes)

  const chatRoutes = require("./src/routes/ChatRoutes")
  app.use("/chat", chatRoutes)

  const adminRoutes = require("./src/routes/AdminRoutes");
  app.use("/admin", adminRoutes);

  const developerRoutes = require("./src/routes/DeveloperRoutes");
  app.use("/developer", developerRoutes);

  const testerRoutes = require("./src/routes/TesterRoutes");
  app.use("/tester", testerRoutes);

  const managerRoutes = require("./src/routes/ManagerRoutes");
  app.use("/manager", managerRoutes);

  const PORT = process.env.PORT || 3000

  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
  })  