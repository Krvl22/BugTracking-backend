const mongoose = require("mongoose")
const Schema = mongoose.Schema

const projectSchema = new Schema({
    name:{
        type:String,
        required: true
    },
    description:{
        type:String,
        required: true
    },
    status: {
        type: String,
        default: "active",
        enum: ["active", "inactive", "completed"]
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    startDate: { 
        type: Date, 
        default: null 
    },
    endDate:   { 
        type: Date, 
        default: null 
    },
    isActive:  { 
        type: Boolean, 
        default: true }
},
{timestamps:true})
module.exports=mongoose.model("projects",projectSchema)