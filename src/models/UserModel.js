const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        select: false  
    },
    role: {
    type: String,
    default: "developer",
    enum: ["admin", "manager", "developer", "tester"] 
    },
    profilePic:{
        type:String,
        default:""
    },
    status:{
        type:String,
        default:"active",
        enum:["active","inactive","deleted","blocked"]
    },
    isActive: { 
        type: Boolean, 
        default: true 
    },
    lastLogin: { 
        type: Date, 
        default: null 
    }

})
module.exports = mongoose.model("users",userSchema)