// const ProjectModel = require("../models/ProjectModel")

// // CREATE PROJECT
// const createProject = async (req,res)=>{
//   try{

//     const { name, description, projectKey, createdBy } = req.body

//     if(!name || !projectKey || !createdBy){
//       return res.status(400).json({
//         success:false,
//         message:"name, projectKey and createdBy are required"
//       })
//     }

//     const existingProject = await ProjectModel.findOne({
//       $or:[
//         { name:name },
//         { projectKey:projectKey }
//       ]
//     })

//     if(existingProject){
//       return res.status(400).json({
//         success:false,
//         message:"Project with this name or key already exists"
//       })
//     }

//     const project = await ProjectModel.create({
//       name,
//       description,
//       projectKey,
//       createdBy
//     })

//     res.status(201).json({
//       success:true,
//       message:"Project created successfully",
//       data:project
//     })

//   }catch(err){
//     res.status(500).json({
//       success:false,
//       message:"Error while creating project",
//       error:err.message
//     })
//   }
// }


// // GET ALL PROJECTS
// const getAllProjects = async (req,res)=>{
//   try{

//     const projects = await ProjectModel.find()
//       .populate("createdBy","firstName lastName email")
//       //.populate("teamMembers","firstName lastName role")
//       .sort({ createdAt:-1 })

//     res.status(200).json({
//       success:true,
//       message:"Projects fetched successfully",
//       data:projects
//     })

//   }catch(err){
//     res.status(500).json({
//       success:false,
//       message:"Error fetching projects",
//       error:err.message
//     })
//   }
// }

// // GET SINGLE PROJECT
// const getProject = async (req,res)=>{
//   try{

//     const project = await ProjectModel.findById(req.params.id)
//       .populate("createdBy","firstName lastName email")
//       .populate("teamMembers","firstName lastName role")
//       .populate("modules","name")

//     if(!project){
//       return res.status(404).json({
//         success:false,
//         message:"Project not found"
//       })
//     }

//     res.status(200).json({
//       success:true,
//       data:project
//     })

//   }catch(err){
//     res.status(500).json({
//       success:false,
//       error:err.message
//     })
//   }
// }

// // UPDATE PROJECT
// const updateProject = async (req,res)=>{
//   try{

//     const project = await ProjectModel.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new:true, runValidators:true }
//     )

//     if(!project){
//       return res.status(404).json({
//         success:false,
//         message:"Project not found"
//       })
//     }

//     res.status(200).json({
//       success:true,
//       message:"Project updated successfully",
//       data:project
//     })

//   }catch(err){
//     res.status(500).json({
//       success:false,
//       message:"Error updating project",
//       error:err.message
//     })
//   }
// }


// // DELETE PROJECT
// const deleteProject = async (req,res)=>{
//   try{

//     const project = await ProjectModel.findByIdAndDelete(req.params.id)

//     if(!project){
//       return res.status(404).json({
//         success:false,
//         message:"Project not found"
//       })
//     }

//     res.status(200).json({
//       success:true,
//       message:"Project deleted successfully",
//       data:project
//     })

//   }catch(err){
//     res.status(500).json({
//       success:false,
//       message:"Error deleting project",
//       error:err.message
//     })
//   }
// }


// // CHANGE PROJECT STATUS
// const changeProjectStatus = async (req,res)=>{
//   try{

//     const project = await ProjectModel.findByIdAndUpdate(
//       req.params.id,
//       { status:req.body.status },
//       { new:true }
//     )

//     if(!project){
//       return res.status(404).json({
//         success:false,
//         message:"Project not found"
//       })
//     }

//     res.status(200).json({
//       success:true,
//       message:"Project status updated",
//       data:project
//     })

//   }catch(err){
//     res.status(500).json({
//       success:false,
//       message:"Error updating project status",
//       error:err.message
//     })
//   }
// }


// module.exports={
//   createProject,
//   getAllProjects,
//   getProject,
//   updateProject,
//   deleteProject,
//   changeProjectStatus
// }


const ProjectModel = require("../models/ProjectModel")

// CREATE PROJECT
const createProject = async (req,res)=>{
  try{

    const { name, description, projectKey, createdBy } = req.body

    if(!name || !projectKey || !createdBy){
      return res.status(400).json({
        success:false,
        message:"name, projectKey and createdBy are required"
      })
    }

    const existingProject = await ProjectModel.findOne({
      $or:[ { name:name }, { projectKey:projectKey } ]
    })

    if(existingProject){
      return res.status(400).json({
        success:false,
        message:"Project with this name or key already exists"
      })
    }

    const project = await ProjectModel.create({
      name, description, projectKey, createdBy
    })

    res.status(201).json({
      success:true,
      message:"Project created successfully",
      data:project
    })

  }catch(err){
    res.status(500).json({ success:false, message:"Error while creating project", error:err.message })
  }
}

// GET ALL PROJECTS
const getAllProjects = async (req,res)=>{
  try{
    const projects = await ProjectModel.find()
      .populate("createdBy","firstName lastName email")
      .populate("teamMembers", "firstName lastName role")
      .sort({ createdAt:-1 })

    res.status(200).json({ success:true, message:"Projects fetched successfully", data:projects })

  }catch(err){
    res.status(500).json({ success:false, message:"Error fetching projects", error:err.message })
  }
}

// GET SINGLE PROJECT — ✅ FIXED: removed .populate("teamMembers") and .populate("modules") — neither exist as refs in ProjectModel
const getProject = async (req,res)=>{
  try{

    const project = await ProjectModel.findById(req.params.id)
      .populate("createdBy","firstName lastName email") // ✅ only this exists in schema
      .populate("teamMembers", "firstName lastName role")
      
    if(!project){
      return res.status(404).json({ success:false, message:"Project not found" })
    }

    res.status(200).json({ success:true, data:project })

  }catch(err){
    res.status(500).json({ success:false, error:err.message })
  }
}

// UPDATE PROJECT
const updateProject = async (req,res)=>{
  try{
    const project = await ProjectModel.findByIdAndUpdate(
      req.params.id, req.body, { new:true, runValidators:true }
    )
    if(!project) return res.status(404).json({ success:false, message:"Project not found" })
    res.status(200).json({ success:true, message:"Project updated successfully", data:project })
  }catch(err){
    res.status(500).json({ success:false, message:"Error updating project", error:err.message })
  }
}

// DELETE PROJECT
const deleteProject = async (req,res)=>{
  try{
    const project = await ProjectModel.findByIdAndDelete(req.params.id)
    if(!project) return res.status(404).json({ success:false, message:"Project not found" })
    res.status(200).json({ success:true, message:"Project deleted successfully", data:project })
  }catch(err){
    res.status(500).json({ success:false, message:"Error deleting project", error:err.message })
  }
}

// CHANGE PROJECT STATUS
const changeProjectStatus = async (req,res)=>{
  try{
    const project = await ProjectModel.findByIdAndUpdate(
      req.params.id, { status:req.body.status }, { new:true }
    )
    if(!project) return res.status(404).json({ success:false, message:"Project not found" })
    res.status(200).json({ success:true, message:"Project status updated", data:project })
  }catch(err){
    res.status(500).json({ success:false, message:"Error updating project status", error:err.message })
  }
}

const addTeamMember = async (req, res) => {
  try {
    const { userId } = req.body
    const project = await ProjectModel.findByIdAndUpdate(
      req.params.id,
      { $push: { teamMembers: userId } },
      { new: true }
    ).populate("teamMembers", "firstName lastName role")

    res.status(200).json({ success: true, data: project })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}
const removeTeamMember = async (req, res) => {
  try {
    const { userId } = req.body
    const project = await ProjectModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { teamMembers: userId } }, // ← $pull not findByIdAndDelete
      { new: true }
    ).populate("teamMembers", "firstName lastName role")

    res.status(200).json({ success: true, data: project })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

module.exports = { 
  createProject, 
  getAllProjects, 
  getProject, 
  updateProject, 
  deleteProject, 
  changeProjectStatus,
  addTeamMember,
  removeTeamMember
}