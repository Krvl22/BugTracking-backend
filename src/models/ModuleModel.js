const mongoose = require("mongoose")
const Schema = mongoose.Schema

const moduleSchema = new Schema({

  name:{
    type:String,
    required:true
  },

  description:{
    type:String,
    default:""
  },

  project:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"projects",
    required:true
  },

  createdBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"users",
    required:true
  },

  status:{
    type:String,
    default:"active",
    enum:["active","inactive","completed"]
  },

  isActive:{
    type:Boolean,
    default:true
  }

},{timestamps:true})

module.exports = mongoose.model("modules", moduleSchema)