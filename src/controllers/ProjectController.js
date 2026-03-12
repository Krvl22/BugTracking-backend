const ProjectModel = require("../models/ProjectModel")

const createProject = async(req,res)=>{

    try{
        const project = await ProjectModel.create({
            name:req.body.name,
            description:req.body.description,
            createdBy:req.body.createdBy
        })
        res.status(201).json({
            message:"Project created Successfully",
            data:project       
        })

    } 
    catch(err){
        res.status(500).json({
            message:"Error while creating Project",
            err:err.message
        })
    }
}

const getAllProjects =async(req,res)=>{

    try{
        const getProjects = await ProjectModel.find()
        .populate("createdBy","firstName lastName email")
        .sort({createdAt:-1})

        res.status(200).json({
            message:"Projects Fetched Succssfully",
            data:getProjects
        })
    }
    catch(err){
        res.status(500).json({
            message:"Error fetching Projects",
            err:err.message
        })
    }
}


const getProject = async(req,res)=>{
    try{
        const getProjectByID = await ProjectModel.findById(req.params.id)
        .populate("createdBy","firstName lastName email")

        if(!getProjectByID)
        {
            return res.status(404).json({ message: "Project not found" })
        }

        res.status(200).json({
            message:"Project Fetched Successfully",
            data:getProjectByID
        })
    }
    catch(err){
        res.status(500).json({
            message:"Error Fetching Project",
            err:err.message
        })
    }
}

const updateProject = async(req,res)=>{

    try{
        const projectUpdate = await ProjectModel.findByIdAndUpdate(req.params.id,req.body,{new:true})
           
        if(!projectUpdate) {
            return res.status(404).json({ message: "Project not found" })
        } 
        res.status(201).json({
            message:"Project Updated Successfully",
            data : projectUpdate
        })
    }
    catch(err){
        res.status(500).json({
            message:"Error Updating Project",
            err:err.message
        })
    }
}

const deleteProject = async(req,res)=>{

    try{
        const projectDelete = await ProjectModel.findByIdAndDelete(req.params.id)

        if(!projectDelete){
            return res.status(404).json({message:"Project not  found"})
        }
        res.status(200).json({
            message:"Project Deleted Succssfully",
            data:projectDelete
        })
    }
    catch(err){
        res.status(500).json({
            message:"Error while Deleting Project",
            err:err.message
        })
    }
}

module.exports={
    createProject,
    getAllProjects,
    getProject,
    updateProject,
    deleteProject
}