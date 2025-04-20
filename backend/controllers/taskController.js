const mongoose = require("mongoose");
const Task = require("../models/Task");
const Project = require("../models/Project");

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("project", "name")
      .populate("assignee", "name avatar");
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getAssignedTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignee: req.user._id })
      .populate("project", "name")
      .populate("assignee", "name avatar");
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getTaskById = async (req, res) => {
  try {
    // Validate ObjectId
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const task = await Task.findById(req.params.id)
      .populate("project", "name")
      .populate("assignee", "name avatar");
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Add authorization check
    const project = await Project.findById(task.project);
    if (
      !project.members.includes(req.user._id) &&
      !project.createdBy.equals(req.user._id)
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.createTask = async (req, res) => {
  try {
    console.log("Received req.body:", req.body); // Debug log
    const {
      title,
      description,
      status,
      priority,
      dueDate,
      projectId,
      assigneeId,
    } = req.body;

    // Validate required fields
    if (!title || !projectId || !status) {
      return res
        .status(400)
        .json({ message: "Title, project, and status are required" });
    }

    // Check if projectId is a valid ObjectId
    if (!mongoose.isValidObjectId(projectId)) {
      console.log("Invalid projectId:", projectId); // Debug log
      return res.status(400).json({ message: "Invalid project ID" });
    }

    // Verify the project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check user authorization
    if (
      !project.members.includes(req.user._id) &&
      !project.createdBy.equals(req.user._id)
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to create tasks for this project" });
    }

    // Create the task
    const task = new Task({
      title,
      description,
      status,
      priority,
      dueDate,
      project: projectId,
      assignee: assigneeId,
      completed: false,
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error("Error in createTask:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      dueDate,
      assigneeId,
      completed,
    } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const project = await Project.findById(task.project);
    if (
      !project.members.includes(req.user._id) &&
      !project.createdBy.equals(req.user._id)
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.dueDate = dueDate || task.dueDate;
    task.assignee = assigneeId || task.assignee;
    task.completed = completed !== undefined ? completed : task.completed;

    await task.save();
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const project = await Project.findById(task.project);
    if (
      !project.createdBy.equals(req.user._id) &&
      !project.members.includes(req.user._id)
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await task.remove();
    res.json({ message: "Task deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
