const express = require("express")
const app = express()
const cors = require("cors")
//load env file.. using process
require("dotenv").config()
app.use(express.json())
app.use(cors()) //allow all requests

const DBConnection = require("./src/utils/DBConnection")
DBConnection()

require("./src/models/UserModel")
require("./src/models/ProjectModel")
require("./src/models/ModuleModel")
require("./src/models/TaskModel")

const userRoutes = require("./src/routes/UserRoutes")
app.use("/user",userRoutes)

const projectRoutes = require("./src/routes/ProjectRoutes")
app.use("/project",projectRoutes)

const moduleRoutes = require("./src/routes/ModuleRoutes")
app.use("/module",moduleRoutes)

const taskRoutes = require("./src/routes/TaskRoutes")
app.use("/task",taskRoutes)

const PORT = process.env.PORT
app.listen(PORT,()=>{
    console.log(`server started on port ${PORT}`)
})
//server creation