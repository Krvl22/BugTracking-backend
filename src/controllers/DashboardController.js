const User = require("../models/UserModel")
const Project = require("../models/ProjectModel")
const Task = require("../models/TaskModel")

const getDashboardStats = async (req,res)=>{
  try{

    const totalUsers = await User.countDocuments()

    const activeProjects = await Project.countDocuments({
      status:"active"
    })

    const totalBugs = await Task.countDocuments({
      type:"bug"
    })

    const stats = {
      totalUsers,
      activeProjects,
      totalBugs
    }

    res.status(200).json({
      success:true,
      data:stats
    })

  }catch(err){
    res.status(500).json({
      success:false,
      message:"Error fetching dashboard stats"
    })
  }
}

module.exports = {
  getDashboardStats
}