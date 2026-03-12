const ProjectModel = require("../models/ProjectModel")  
const moduleSchema = require("../models/ModuleModel")

const createModule = async(req,res)=>{
    
    try{
        const module = await moduleSchema.create({
            name:req.body.name,
            description:req.body.description,
            project:req.body.project,
            createdBy:req.body.createdBy
        })
        const populated = await module.populate([
            {path:"project", select:"name"},
            {path:"createdBy" , select:"firstName lastName"}
        ])

        res.status(201).json({
            message:"Module Created Succssfully",
            data :populated 
        })

    }
    catch(err){
        res.status(500).json({
            message:"Module cannot be created",
            err:err.message
        })
    }
}

const getAllModules = async(req,res)=>{
    
    try{
        const search = req.query.search || ""
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit

        const filter = {
            project:req.params.projectId,
            name:{$regex:search ,$options:"i"}
        }
        const total = await moduleSchema.countDocuments(filter)
        const modules = await moduleSchema.find(filter)
            .populate("createdBy" , "firstName lastName email")
            .populate("project" , "name description")
            .sort({createdAt:-1})
            .skip(skip)
            .limit(limit)

        res.status(200).json({
            message:"All Feteched Modules",
            pagination:{
                total,
                page, 
                limit,
                totalPages:Math.ceil(total / limit)
            },
            data:modules
        })
        
    } 
    catch(err){
        res.status(500).json({
            message:"modules cannot be fetched",
            err:err.message
        })
    }
}

const getModule = async(req,res)=>{
    
    try{
        const getModuleByID = await moduleSchema.findById(req.params.id)
        .populate("createdBy","firstName lastName")
        .populate({
            path:"project",
            select:"name status",
            populate:{
                path:"createdBy",
                select:"firstName lastName"
            }
        })
        if(!getModuleByID){
            return res.status(404).json({message:"Module not found"})
        }
        res.status(200).json({
            message:"Module Fetched  Succssfully",
            data:getModuleByID
        })        
    } 
    catch(err){
        res.status(500).json({
            message:"Error Fetching Module",
            err:err.message
        })
    }
}

const updateModule = async(req,res)=>{
    try{
        const moduleUpdate = await moduleSchema.findByIdAndUpdate(req.params.id,req.body,{new:true})
        .populate("project","name")
        .populate("createdBy","firstName lastName")
        
        if(!moduleUpdate){
            return res.status(404).json({message:"Module not found"})
        }
        
        res.status(201).json({
            message:"Module Updated Successfully",
            data:moduleUpdate
        })
    } 
    catch(err){
        res.status(500).json({
            message:"Error Updating Module",
            err:err.message
        })
    }
}

const deleteModule = async(req,res)=>{
    try{
        const moduleDelete = await moduleSchema.findByIdAndDelete(req.params.id)
        
        if(!moduleDelete){
            return res.status(404).json({message:"Module not Found"})
        }
        
        res.status(200).json({
            message:"Module Deleted",
            data:moduleDelete
        })
    } 
    catch(err){
        res.status(500).json({
            message:"Error Deleting Module",
            err:err.message
        })
    }
}

module.exports={
    createModule,
    getAllModules,
    getModule,
    updateModule,
    deleteModule
}


    