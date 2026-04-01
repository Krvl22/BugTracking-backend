const sprintSchema = new mongoose.Schema({
  name: String,
  startDate: Date,
  endDate: Date,

  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project"
  },

  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task"
    }
  ],

  status: {
    type: String,
    enum: ["active", "completed"],
    default: "active"
  }
}, { timestamps: true });