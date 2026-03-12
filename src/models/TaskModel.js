const mongoose = require("mongoose")
const Schema = mongoose.Schema

const taskSchema = new Schema({

    title:{
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
    module:{
        type:Schema.Types.ObjectId,
        ref:"modules",
        required:true
    },
    assignedTo: {
    type: Schema.Types.ObjectId,
    ref: "users",
    default: null   // ← not required at creation
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    status:{
        type:String,
        default:"pending",
        enum:[
            //"pending","assigned","inprogress","submitted","testing","bugfound","reassigned","resubmitted","completed"
            "pending",      // just created
            "assigned",     // given to developer
            "inprogress",   // developer working
            "submitted",    // developer submitted
            "testing",      // tester is testing
            "bugfound",     // tester found bug
            "reassigned",   // sent back to developer
            "resubmitted",  // developer fixed and resubmitted
            "completed"     // tester approved
        ]

    },
    priority:{
        type:String,
        default:"medium",
        enum:["low","medium","high","critical"]
    },
    startTime:{
        type:Date,
        default:null
    },
    endTime:{
        type:Date,
        default:null
    },
    reassignCount:{
        type:Number,
        default:0
    },
    assignedBy:{ 
        type: Schema.Types.ObjectId, 
        ref: "users", 
        default: null 
    },
    testedBy:{ type: Schema.Types.ObjectId, 
        ref: "users", 
        default: null 
    },
    completedBy:{ type: Schema.Types.ObjectId, 
        ref: "users", 
        default: null 
    },
    dueDate:{ type: Date, 
        default: null 
    },
    submissionCount:{ type: Number, 
        default: 0 
    },
    bugCount:{ 
        type: Number, 
        default: 0 
    },
    submittedAt:{ 
        type: Date, 
        default: null 
    },
    completedAt:{ 
        type: Date, 
        default: null 
    },
    totalTimeTaken:    
    { 
        type: Number, 
        default: 0 
    },
    submissionHistory: [{
        submittedBy: { 
            type: Schema.Types.ObjectId, 
            ref: "users" 
        },
        submittedAt:{ 
            type: Date, 
            default: Date.now 
        },
        type:{ 
            type: String, 
            enum: ["submit", "resubmit"] 
        },
        note:{ 
            type: String, 
            default: "" 
        }
}]
},{timestamps:true})
module.exports = mongoose.model("tasks",taskSchema)