// const mongoose = require("mongoose")
// const Schema = mongoose.Schema

// const taskSchema = new Schema({

//   issueKey:{
//     type:String,
//     required:true,
//     unique:true
//   },

//   issueNumber:{
//     type:Number,
//     required:true
//   },

//   title:{
//     type:String,
//     required:true
//   },

//   description:{
//     type:String,
//     default:""
//   },

//   type:{
//     type:String,
//     default:"task",
//     enum:["task","bug","improvement"]
//   },

//   project:{
//     type:mongoose.Schema.Types.ObjectId,
//     ref:"projects",
//     required:true
//   },

//   module:{
//     type:mongoose.Schema.Types.ObjectId,
//     ref:"modules",
//     required:true
//   },

//   createdBy:{
//     type:mongoose.Schema.Types.ObjectId,
//     ref:"users",
//     required:true
//   },

//   assignedTo:{
//     type:mongoose.Schema.Types.ObjectId,
//     ref:"users",
//     default:null
//   },

//   assignedBy:{
//     type:mongoose.Schema.Types.ObjectId,
//     ref:"users",
//     default:null
//   },

//   testedBy:{
//     type:mongoose.Schema.Types.ObjectId,
//     ref:"users",
//     default:null
//   },

//   completedBy:{
//     type:mongoose.Schema.Types.ObjectId,
//     ref:"users",
//     default:null
//   },

//   attachmentUrl: {
//     type: String,
//     default: null,
//   },

//   // attachments: [
//   //   {
//   //     fileName: String,
//   //     filePath: String,
//   //     uploadedAt: {
//   //       type: Date,
//   //       default: Date.now
//   //     }
//   //   }
//   // ],

//   status:{
//     type:String,
//     default:"to_do",
//     enum:[
//       "to_do",
//       "assigned",
//       "in_progress",
//       "submitted",
//       "in_testing",
//       "bug_found",
//       "fix_in_progress",
//       "resubmitted",
//       "completed"
//     ]
//   },

//   priority:{
//     type:String,
//     default:"medium",
//     enum:["low","medium","high","urgent"]
//   },

//   dueDate:{
//     type:Date,
//     default:null
//   },

//   assignedAt:{
//     type:Date,
//     default:null
//   },

//   submittedAt:{
//     type:Date,
//     default:null
//   },

//   completedAt:{
//     type:Date,
//     default:null
//   },

//   submissionCount:{
//     type:Number,
//     default:0
//   },

//   reassignmentCount:{
//     type:Number,
//     default:0
//   }

// },{timestamps:true})

// module.exports = mongoose.model("tasks",taskSchema)

const mongoose = require("mongoose")
const Schema   = mongoose.Schema

const taskSchema = new Schema({

  issueKey: { type: String, required: true, unique: true },
  issueNumber: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, default: "" },

  type: {
    type: String, default: "task",
    enum: ["task", "bug", "improvement"]
  },

  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "projects", required: true
  },

  // FIX: was required:true — tasks don't always have a module
  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "modules",
    required: false,   // ← FIXED
    default: null
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users", required: true
  },

  assignedTo:  { type: mongoose.Schema.Types.ObjectId, ref: "users", default: null },
  assignedBy:  { type: mongoose.Schema.Types.ObjectId, ref: "users", default: null },
  testedBy:    { type: mongoose.Schema.Types.ObjectId, ref: "users", default: null },
  completedBy: { type: mongoose.Schema.Types.ObjectId, ref: "users", default: null },

  attachmentUrl: { type: String, default: null },

  status: {
    type: String, default: "to_do",
    enum: ["to_do", "assigned", "in_progress", "submitted", "in_testing",
           "bug_found", "fix_in_progress", "resubmitted", "completed"]
  },

  priority: {
    type: String, default: "medium",
    enum: ["low", "medium", "high", "urgent"]
  },

  dueDate:          { type: Date, default: null },
  assignedAt:       { type: Date, default: null },
  submittedAt:      { type: Date, default: null },
  completedAt:      { type: Date, default: null },
  submissionCount:  { type: Number, default: 0 },
  reassignmentCount:{ type: Number, default: 0 }

}, { timestamps: true })

module.exports = mongoose.model("tasks", taskSchema)