const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  status: { type: String, default: "Not Started" },
  dueDate: { type: Date },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  columns: [
    {
      id: { type: String, required: true },
      title: { type: String, required: true },
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Project", projectSchema);
