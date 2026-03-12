const ProjectModel = require("../models/ProjectModel")
const ModuleModel = require("../models/ModuleModel")
const taskSchema = require("../models/TaskModel")

const createTask = async(req,res)=>{
    try{
        const task = await taskSchema.create({
            title:req.body.title,
            description:req.body.description,
            project:req.body.project,
            module:req.body.module,
            createdBy:req.body.createdBy,
            priority:req.body.priority || "medium"
        })
        const populated = await task.populate([
            {path:"project", select:"name"},
            {path:"module", select:"name"},
            {path:"createdBy", select:"firstName lastName"}
        ])
        res.status(201).json({
        message:"Task Created",
        data:populated
    })
    } 
    catch(err){
        res.status(500).json({
            message:"Error Creating Task",
            err:err.message
        })
    }
}

const getAllTasks = async(req,res)=>{
    try{
        const search = req.query.search || ""
        const status = req.query.status || ""
        const priority = req.query.priority || ""
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit

        const filter = {}
        if(req.query.project) filter.project = req.query.project
        if(req.query.module) filter.module = req.query.module
        if(req.query.assignedTo) filter.assignedTo = req.query.assignedTo
        if(status) filter.status = status
        if(priority) filter.priority = priority
        if(search) filter.title = { $regex: search, $options: "i" }

        const total = await taskSchema.countDocuments(filter)
        const tasks = await taskSchema.find(filter)
            .populate("project" ,"name")
            .populate("module" ,"name")
            .populate("assignedTo" ,"firstName lastName email")
            .populate("createdBy" ,"firstName lastName email")
            .sort({createdAt:-1})
            .skip(skip)
            .limit(limit)

        res.status(200).json({
            message:"All Tasks Fetched",
            data:tasks
        })
    }
    catch(err){
        res.status(500).json({
            message:"Error fetching all Tasks",
            err:err.message
        })
    }
}

const getTask = async(req,res)=>{
    try{
        const getTaskByID = await taskSchema.findById(req.params.id)
        .populate("project", "name")
        .populate("module", "name")
        .populate("assignedTo", "firstName lastName email")
        .populate("createdBy", "firstName lastName email")

        if(!getTaskByID){
            return res.status(404).json({message:"Task Not Found"})
        }

        res.status(200).json({
            message:"Task Fetched",
            data:getTaskByID
        })
    }
    catch(err){
        res.status(500).json({
            message:"Error Fetching Task",
            err:err.message
        })
    }
}

const assignTask = async(req,res)=>{
    try{
        const taskAssign = await taskSchema.findByIdAndUpdate(
            req.params.id,
            {
                assignedTo: req.body.developerId,
                status: "assigned",
                startTime: Date.now()
            },
            { new: true }).populate("assignedTo", "firstName lastName email")

        if(!taskAssign){
            return res.status(404).json({message:"Task Not Found"})
        }
        res.status(200).json({
            message:"Task Submitted Successfully",
            data:taskAssign
        })
    }
    catch(err){
        res.status(500).json({
            message:"Error Assigning Task",
            err:err.message
        })
    }
}

const submitTask = async(req,res)=>{
    try{
        const taskSubmit = await taskSchema.findByIdAndUpdate(req.params.id,{status:"submitted"},{new:true})
        
        if(!taskSubmit){
            return res.status(404).json({message:"Task Not Found"})
        }
        res.status(200).json({
            message:"Task Submitted Successfully",
            data:taskSubmit
        })
    }
    catch(err){
        res.status(500).json({
            message:"Error Submitting Task",
            err:err.message
        })
    }
}

const updateTask = async(req,res)=>{
    try{
        const taskUpdate = await taskSchema.findByIdAndUpdate(req.params.id,req.body,{new:true})

        if(!taskUpdate){
            return res.status(404).json({message:"Task Not Found"})
        }

        res.status(200).json({
            message:"Task Updated Successfully",
            data:taskUpdate
        })
    }
    catch(err){
        res.status(500).json({
            message:"Error Updating Task",
            err:err.message
        })
    }
}

const deleteTask = async(req,res)=>{
    try{
        const taskDelete = await taskSchema.findByIdAndDelete(req.params.id)

        if(!taskDelete){
            return res.status(404).json({message:"Task Not Found"})
        }

        res.status(200).json({
            message:"Task Deleted Successfully",
            data:taskDelete
        })
    }
    catch(err){
        res.status(500).json({
            message:"Error Deleting Task",
            err:err.message
        })
    }
}

module.exports={
    createTask,
    getAllTasks,
    getTask,
    assignTask,
    submitTask,
    updateTask,
    deleteTask
}