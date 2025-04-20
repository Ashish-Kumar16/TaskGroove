const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, required: true },
  priority: { type: String, default: "Medium" },
  dueDate: { type: Date },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  completed: { type: Boolean, default: false },
  comments: [
    {
      text: { type: String, required: true },
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  attachments: [{ type: String }],
});

module.exports = mongoose.model("Task", taskSchema);
