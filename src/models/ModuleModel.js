const mongoose=require("mongoose")
const Schema=mongoose.Schema

const moduleSchema = new Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true
    },
    project:{
        type:Schema.Types.ObjectId,
        ref:"projects",
        required:true
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    status:{
        type:String,
        default:"active",
        enum:["active","inactive","completed"]
    },
    isActive: { 
        type: Boolean, 
        default: true 
    }

},{timestamps:true})

module.exports=mongoose.model("modules",moduleSchema)