const ModuleModel = require("../models/ModuleModel")

// CREATE MODULE
const createModule = async(req,res)=>{
  try{

    const module = await ModuleModel.create({
      name:req.body.name,
      description:req.body.description,
      project:req.body.project,
      createdBy:req.body.createdBy
    })

    res.status(201).json({
      success:true,
      message:"Module created successfully",
      data:module
    })

  }catch(err){
    res.status(500).json({
      success:false,
      message:"Error creating module",
      error:err.message
    })
  }
}


// GET ALL MODULES BY PROJECT
const getAllModules = async(req,res)=>{
  try{

    const modules = await ModuleModel.find({
      project:req.query.projectId,
      isActive:true
    })
    .populate("project","name")
    .populate("createdBy","firstName lastName")

    res.status(200).json({
      success:true,
      message:"Modules fetched successfully",
      data:modules
    })

  }catch(err){
    res.status(500).json({
      success:false,
      message:"Error fetching modules",
      error:err.message
    })
  }
}


// GET SINGLE MODULE
const getModule = async(req,res)=>{
  try{

    const module = await ModuleModel.findById(req.params.id)
      .populate("project","name")
      .populate("createdBy","firstName lastName")

    if(!module){
      return res.status(404).json({
        success:false,
        message:"Module not found"
      })
    }

    res.status(200).json({
      success:true,
      message:"Module fetched successfully",
      data:module
    })

  }catch(err){
    res.status(500).json({
      success:false,
      message:"Error fetching module",
      error:err.message
    })
  }
}


// UPDATE MODULE
const updateModule = async(req,res)=>{
  try{

    const module = await ModuleModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new:true }
    )

    if(!module){
      return res.status(404).json({
        success:false,
        message:"Module not found"
      })
    }

    res.status(200).json({
      success:true,
      message:"Module updated successfully",
      data:module
    })

  }catch(err){
    res.status(500).json({
      success:false,
      message:"Error updating module",
      error:err.message
    })
  }
}


// DELETE MODULE
const deleteModule = async(req,res)=>{
  try{

    const module = await ModuleModel.findByIdAndUpdate(
      req.params.id,
      { isActive:false, status:"inactive" },
      { new:true }
    )

    if(!module){
      return res.status(404).json({
        success:false,
        message:"Module not found"
      })
    }

    res.status(200).json({
      success:true,
      message:"Module deleted successfully",
      data:module
    })

  }catch(err){
    res.status(500).json({
      success:false,
      message:"Error deleting module",
      error:err.message
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