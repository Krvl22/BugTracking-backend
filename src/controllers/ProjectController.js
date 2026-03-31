// // const ProjectModel = require("../models/ProjectModel")

// // // CREATE PROJECT
// // const createProject = async (req,res)=>{
// //   try{

// //     const { name, description, projectKey, createdBy } = req.body

// //     if(!name || !projectKey || !createdBy){
// //       return res.status(400).json({
// //         success:false,
// //         message:"name, projectKey and createdBy are required"
// //       })
// //     }

// //     const existingProject = await ProjectModel.findOne({
// //       $or:[
// //         { name:name },
// //         { projectKey:projectKey }
// //       ]
// //     })

// //     if(existingProject){
// //       return res.status(400).json({
// //         success:false,
// //         message:"Project with this name or key already exists"
// //       })
// //     }

// //     const project = await ProjectModel.create({
// //       name,
// //       description,
// //       projectKey,
// //       createdBy
// //     })

// //     res.status(201).json({
// //       success:true,
// //       message:"Project created successfully",
// //       data:project
// //     })

// //   }catch(err){
// //     res.status(500).json({
// //       success:false,
// //       message:"Error while creating project",
// //       error:err.message
// //     })
// //   }
// // }


// // // GET ALL PROJECTS
// // const getAllProjects = async (req,res)=>{
// //   try{

// //     const projects = await ProjectModel.find()
// //       .populate("createdBy","firstName lastName email")
// //       //.populate("teamMembers","firstName lastName role")
// //       .sort({ createdAt:-1 })

// //     res.status(200).json({
// //       success:true,
// //       message:"Projects fetched successfully",
// //       data:projects
// //     })

// //   }catch(err){
// //     res.status(500).json({
// //       success:false,
// //       message:"Error fetching projects",
// //       error:err.message
// //     })
// //   }
// // }

// // // GET SINGLE PROJECT
// // const getProject = async (req,res)=>{
// //   try{

// //     const project = await ProjectModel.findById(req.params.id)
// //       .populate("createdBy","firstName lastName email")
// //       .populate("teamMembers","firstName lastName role")
// //       .populate("modules","name")

// //     if(!project){
// //       return res.status(404).json({
// //         success:false,
// //         message:"Project not found"
// //       })
// //     }

// //     res.status(200).json({
// //       success:true,
// //       data:project
// //     })

// //   }catch(err){
// //     res.status(500).json({
// //       success:false,
// //       error:err.message
// //     })
// //   }
// // }

// // // UPDATE PROJECT
// // const updateProject = async (req,res)=>{
// //   try{

// //     const project = await ProjectModel.findByIdAndUpdate(
// //       req.params.id,
// //       req.body,
// //       { new:true, runValidators:true }
// //     )

// //     if(!project){
// //       return res.status(404).json({
// //         success:false,
// //         message:"Project not found"
// //       })
// //     }

// //     res.status(200).json({
// //       success:true,
// //       message:"Project updated successfully",
// //       data:project
// //     })

// //   }catch(err){
// //     res.status(500).json({
// //       success:false,
// //       message:"Error updating project",
// //       error:err.message
// //     })
// //   }
// // }


// // // DELETE PROJECT
// // const deleteProject = async (req,res)=>{
// //   try{

// //     const project = await ProjectModel.findByIdAndDelete(req.params.id)

// //     if(!project){
// //       return res.status(404).json({
// //         success:false,
// //         message:"Project not found"
// //       })
// //     }

// //     res.status(200).json({
// //       success:true,
// //       message:"Project deleted successfully",
// //       data:project
// //     })

// //   }catch(err){
// //     res.status(500).json({
// //       success:false,
// //       message:"Error deleting project",
// //       error:err.message
// //     })
// //   }
// // }


// // // CHANGE PROJECT STATUS
// // const changeProjectStatus = async (req,res)=>{
// //   try{

// //     const project = await ProjectModel.findByIdAndUpdate(
// //       req.params.id,
// //       { status:req.body.status },
// //       { new:true }
// //     )

// //     if(!project){
// //       return res.status(404).json({
// //         success:false,
// //         message:"Project not found"
// //       })
// //     }

// //     res.status(200).json({
// //       success:true,
// //       message:"Project status updated",
// //       data:project
// //     })

// //   }catch(err){
// //     res.status(500).json({
// //       success:false,
// //       message:"Error updating project status",
// //       error:err.message
// //     })
// //   }
// // }


// // module.exports={
// //   createProject,
// //   getAllProjects,
// //   getProject,
// //   updateProject,
// //   deleteProject,
// //   changeProjectStatus
// // }


// // const ProjectModel = require("../models/ProjectModel")

// // // CREATE PROJECT
// // const createProject = async (req,res)=>{
// //   try{

// //     const { name, description, projectKey, createdBy } = req.body

// //     if(!name || !projectKey || !createdBy){
// //       return res.status(400).json({
// //         success:false,
// //         message:"name, projectKey and createdBy are required"
// //       })
// //     }

// //     const existingProject = await ProjectModel.findOne({
// //       $or:[ { name:name }, { projectKey:projectKey } ]
// //     })

// //     if(existingProject){
// //       return res.status(400).json({
// //         success:false,
// //         message:"Project with this name or key already exists"
// //       })
// //     }

// //     const project = await ProjectModel.create({
// //       name, description, projectKey, createdBy
// //     })

// //     res.status(201).json({
// //       success:true,
// //       message:"Project created successfully",
// //       data:project
// //     })

// //   }catch(err){
// //     res.status(500).json({ success:false, message:"Error while creating project", error:err.message })
// //   }
// // }

// // // GET ALL PROJECTS
// // const getAllProjects = async (req,res)=>{
// //   try{
// //     const projects = await ProjectModel.find()
// //       .populate("createdBy","firstName lastName email")
// //       .populate("teamMembers", "firstName lastName role")
// //       .sort({ createdAt:-1 })

// //     res.status(200).json({ success:true, message:"Projects fetched successfully", data:projects })

// //   }catch(err){
// //     res.status(500).json({ success:false, message:"Error fetching projects", error:err.message })
// //   }
// // }

// // // GET SINGLE PROJECT — ✅ FIXED: removed .populate("teamMembers") and .populate("modules") — neither exist as refs in ProjectModel
// // const getProject = async (req,res)=>{
// //   try{

// //     const project = await ProjectModel.findById(req.params.id)
// //       .populate("createdBy","firstName lastName email") // ✅ only this exists in schema
// //       .populate("teamMembers", "firstName lastName role")
      
// //     if(!project){
// //       return res.status(404).json({ success:false, message:"Project not found" })
// //     }

// //     res.status(200).json({ success:true, data:project })

// //   }catch(err){
// //     res.status(500).json({ success:false, error:err.message })
// //   }
// // }

// // // UPDATE PROJECT
// // const updateProject = async (req,res)=>{
// //   try{
// //     const project = await ProjectModel.findByIdAndUpdate(
// //       req.params.id, req.body, { new:true, runValidators:true }
// //     )
// //     if(!project) return res.status(404).json({ success:false, message:"Project not found" })
// //     res.status(200).json({ success:true, message:"Project updated successfully", data:project })
// //   }catch(err){
// //     res.status(500).json({ success:false, message:"Error updating project", error:err.message })
// //   }
// // }

// // // DELETE PROJECT
// // const deleteProject = async (req,res)=>{
// //   try{
// //     const project = await ProjectModel.findByIdAndDelete(req.params.id)
// //     if(!project) return res.status(404).json({ success:false, message:"Project not found" })
// //     res.status(200).json({ success:true, message:"Project deleted successfully", data:project })
// //   }catch(err){
// //     res.status(500).json({ success:false, message:"Error deleting project", error:err.message })
// //   }
// // }

// // // CHANGE PROJECT STATUS
// // const changeProjectStatus = async (req,res)=>{
// //   try{
// //     const project = await ProjectModel.findByIdAndUpdate(
// //       req.params.id, { status:req.body.status }, { new:true }
// //     )
// //     if(!project) return res.status(404).json({ success:false, message:"Project not found" })
// //     res.status(200).json({ success:true, message:"Project status updated", data:project })
// //   }catch(err){
// //     res.status(500).json({ success:false, message:"Error updating project status", error:err.message })
// //   }
// // }

// // const addTeamMember = async (req, res) => {
// //   try {
// //     const { userId } = req.body
// //     const project = await ProjectModel.findByIdAndUpdate(
// //       req.params.id,
// //       { $push: { teamMembers: userId } },
// //       { new: true }
// //     ).populate("teamMembers", "firstName lastName role")

// //     res.status(200).json({ success: true, data: project })
// //   } catch (err) {
// //     res.status(500).json({ success: false, error: err.message })
// //   }
// // }
// // const removeTeamMember = async (req, res) => {
// //   try {
// //     const { userId } = req.body
// //     const project = await ProjectModel.findByIdAndUpdate(
// //       req.params.id,
// //       { $pull: { teamMembers: userId } }, // ← $pull not findByIdAndDelete
// //       { new: true }
// //     ).populate("teamMembers", "firstName lastName role")

// //     res.status(200).json({ success: true, data: project })
// //   } catch (err) {
// //     res.status(500).json({ success: false, error: err.message })
// //   }
// // }

// // module.exports = { 
// //   createProject, 
// //   getAllProjects, 
// //   getProject, 
// //   updateProject, 
// //   deleteProject, 
// //   changeProjectStatus,
// //   addTeamMember,
// //   removeTeamMember
// // }


// const ProjectModel = require("../models/ProjectModel")

// // ✅ Helper — safe date formatter for display (never returns "Invalid Date")
// const formatDate = (d) => {
//   if (!d) return null
//   const parsed = new Date(d)
//   return isNaN(parsed.getTime()) ? null : parsed.toISOString()
// }

// // CREATE PROJECT
// const createProject = async (req, res) => {
//   try {
//     const { name, description, projectKey, createdBy, startDate, endDate } = req.body

//     if (!name || !projectKey || !createdBy) {
//       return res.status(400).json({
//         success: false,
//         message: "name, projectKey and createdBy are required"
//       })
//     }

//     // ✅ End date cannot be before start date
//     if (startDate && endDate) {
//       const start = new Date(startDate)
//       const end   = new Date(endDate)
//       if (!isNaN(start) && !isNaN(end) && end < start) {
//         return res.status(400).json({
//           success: false,
//           message: "End date cannot be before start date"
//         })
//       }
//     }

//     const existingProject = await ProjectModel.findOne({
//       $or: [{ name }, { projectKey }]
//     })

//     if (existingProject) {
//       return res.status(400).json({
//         success: false,
//         message: "Project with this name or key already exists"
//       })
//     }

//     // ✅ Parse dates properly before saving — avoids "Invalid Date" on display
//     const projectData = {
//       name,
//       description,
//       projectKey: projectKey.toUpperCase().trim(),
//       createdBy,
//       startDate: startDate ? new Date(startDate) : null,
//       endDate:   endDate   ? new Date(endDate)   : null,
//     }

//     const project = await ProjectModel.create(projectData)

//     res.status(201).json({
//       success: true,
//       message: "Project created successfully",
//       data: project
//     })

//   } catch (err) {
//     res.status(500).json({ success: false, message: "Error while creating project", error: err.message })
//   }
// }

// // GET ALL PROJECTS
// const getAllProjects = async (req, res) => {
//   try {
//     const projects = await ProjectModel.find()
//       .populate("createdBy", "firstName lastName email")
//       .populate("teamMembers", "firstName lastName role")
//       .sort({ createdAt: -1 })

//     res.status(200).json({ success: true, message: "Projects fetched successfully", data: projects })

//   } catch (err) {
//     res.status(500).json({ success: false, message: "Error fetching projects", error: err.message })
//   }
// }

// // GET SINGLE PROJECT
// const getProject = async (req, res) => {
//   try {
//     const project = await ProjectModel.findById(req.params.id)
//       .populate("createdBy", "firstName lastName email")
//       .populate("teamMembers", "firstName lastName role email")

//     if (!project) {
//       return res.status(404).json({ success: false, message: "Project not found" })
//     }

//     res.status(200).json({ success: true, data: project })

//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message })
//   }
// }

// // UPDATE PROJECT
// const updateProject = async (req, res) => {
//   try {
//     // ✅ Parse dates on update too
//     if (req.body.startDate) req.body.startDate = new Date(req.body.startDate)
//     if (req.body.endDate)   req.body.endDate   = new Date(req.body.endDate)

//     // ✅ End date validation on update
//     if (req.body.startDate && req.body.endDate && req.body.endDate < req.body.startDate) {
//       return res.status(400).json({
//         success: false,
//         message: "End date cannot be before start date"
//       })
//     }

//     const project = await ProjectModel.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     )
//     if (!project) return res.status(404).json({ success: false, message: "Project not found" })
//     res.status(200).json({ success: true, message: "Project updated successfully", data: project })
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Error updating project", error: err.message })
//   }
// }

// // DELETE PROJECT
// const deleteProject = async (req, res) => {
//   try {
//     const project = await ProjectModel.findByIdAndDelete(req.params.id)
//     if (!project) return res.status(404).json({ success: false, message: "Project not found" })
//     res.status(200).json({ success: true, message: "Project deleted successfully", data: project })
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Error deleting project", error: err.message })
//   }
// }

// // CHANGE PROJECT STATUS
// const changeProjectStatus = async (req, res) => {
//   try {
//     const project = await ProjectModel.findByIdAndUpdate(
//       req.params.id,
//       { status: req.body.status },
//       { new: true }
//     )
//     if (!project) return res.status(404).json({ success: false, message: "Project not found" })
//     res.status(200).json({ success: true, message: "Project status updated", data: project })
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Error updating project status", error: err.message })
//   }
// }

// const addTeamMember = async (req, res) => {
//   try {
//     const { userId } = req.body
//     const project = await ProjectModel.findByIdAndUpdate(
//       req.params.id,
//       { $addToSet: { teamMembers: userId } }, // ✅ $addToSet prevents duplicates
//       { new: true }
//     ).populate("teamMembers", "firstName lastName role")

//     res.status(200).json({ success: true, data: project })
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message })
//   }
// }

// const removeTeamMember = async (req, res) => {
//   try {
//     const { userId } = req.body
//     const project = await ProjectModel.findByIdAndUpdate(
//       req.params.id,
//       { $pull: { teamMembers: userId } },
//       { new: true }
//     ).populate("teamMembers", "firstName lastName role")

//     res.status(200).json({ success: true, data: project })
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message })
//   }
// }

// module.exports = {
//   createProject,
//   getAllProjects,
//   getProject,
//   updateProject,
//   deleteProject,
//   changeProjectStatus,
//   addTeamMember,
//   removeTeamMember
// }

const ProjectModel = require("../models/ProjectModel")
const { notifyUser } = require("../services/notificationService")

const formatDate = (d) => {
  if (!d) return null
  const parsed = new Date(d)
  return isNaN(parsed.getTime()) ? null : parsed.toISOString()
}

const createProject = async (req, res) => {
  try {
    const { name, description, projectKey, createdBy, startDate, endDate, teamMembers } = req.body

    if (!name || !projectKey || !createdBy)
      return res.status(400).json({ success: false, message: "name, projectKey and createdBy are required" })

    if (startDate && endDate) {
      const start = new Date(startDate), end = new Date(endDate)
      if (!isNaN(start) && !isNaN(end) && end < start)
        return res.status(400).json({ success: false, message: "End date cannot be before start date" })
    }

    const existingProject = await ProjectModel.findOne({ $or: [{ name }, { projectKey }] })
    if (existingProject)
      return res.status(400).json({ success: false, message: "Project with this name or key already exists" })

    const project = await ProjectModel.create({
      name, description,
      projectKey: projectKey.toUpperCase().trim(),
      createdBy,
      startDate: startDate ? new Date(startDate) : null,
      endDate:   endDate   ? new Date(endDate)   : null,
    })

    // Notify all team members that a new project was created
    if (teamMembers && teamMembers.length > 0) {
      await notifyUser({
        recipients: teamMembers,
        sender:     createdBy,
        type:       "project_created",
        title:      "New Project Created",
        message:    `You have been added to project "${name}"`,
      })
    }

    res.status(201).json({ success: true, message: "Project created successfully", data: project })
  } catch (err) {
    res.status(500).json({ success: false, message: "Error while creating project", error: err.message })
  }
}

const getAllProjects = async (req, res) => {
  try {
    const projects = await ProjectModel.find()
      .populate("createdBy",   "firstName lastName email")
      .populate("teamMembers", "firstName lastName role")
      .sort({ createdAt: -1 })
    res.status(200).json({ success: true, data: projects })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

const getProject = async (req, res) => {
  try {
    const project = await ProjectModel.findById(req.params.id)
      .populate("createdBy",   "firstName lastName email")
      .populate("teamMembers", "firstName lastName role email")
    if (!project) return res.status(404).json({ success: false, message: "Project not found" })
    res.status(200).json({ success: true, data: project })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

const updateProject = async (req, res) => {
  try {
    if (req.body.startDate) req.body.startDate = new Date(req.body.startDate)
    if (req.body.endDate)   req.body.endDate   = new Date(req.body.endDate)

    if (req.body.startDate && req.body.endDate && req.body.endDate < req.body.startDate)
      return res.status(400).json({ success: false, message: "End date cannot be before start date" })

    const project = await ProjectModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate("teamMembers", "_id")
    if (!project) return res.status(404).json({ success: false, message: "Project not found" })

    // Notify all team members that the project was updated
    const memberIds = project.teamMembers.map(m => m._id)
    if (memberIds.length > 0) {
      await notifyUser({
        recipients: memberIds,
        sender:     req.body.updatedBy || null,
        type:       "project_created",   // reusing type — no separate "project_updated" in model enum
        title:      "Project Updated",
        message:    `Project "${project.name}" has been updated`,
      })
    }

    res.status(200).json({ success: true, message: "Project updated successfully", data: project })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

const deleteProject = async (req, res) => {
  try {
    const project = await ProjectModel.findByIdAndDelete(req.params.id)
    if (!project) return res.status(404).json({ success: false, message: "Project not found" })
    res.status(200).json({ success: true, message: "Project deleted successfully", data: project })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

const changeProjectStatus = async (req, res) => {
  try {
    const project = await ProjectModel.findByIdAndUpdate(
      req.params.id, { status: req.body.status }, { new: true }
    )
    if (!project) return res.status(404).json({ success: false, message: "Project not found" })
    res.status(200).json({ success: true, message: "Project status updated", data: project })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

const addTeamMember = async (req, res) => {
  try {
    const { userId } = req.body
    const project = await ProjectModel.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { teamMembers: userId } },
      { new: true }
    ).populate("teamMembers", "firstName lastName role")

    // Notify the newly added member
    await notifyUser({
      recipients: [userId],
      sender:     null,
      type:       "project_created",
      title:      "Added to Project",
      message:    `You have been added to project "${project.name}"`,
    })

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
      { $pull: { teamMembers: userId } },
      { new: true }
    ).populate("teamMembers", "firstName lastName role")
    res.status(200).json({ success: true, data: project })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

module.exports = {
  createProject, getAllProjects, getProject,
  updateProject, deleteProject, changeProjectStatus,
  addTeamMember, removeTeamMember,
}