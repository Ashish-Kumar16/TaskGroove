const Project = require("../models/Project");

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("members", "name avatar")
      .populate("createdBy", "name");
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    
    const project = await Project.findById(req.params.id)
      .populate("members", "name avatar")
      .populate("createdBy", "name");
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createProject = async (req, res) => {
  try {
    const { name, description, dueDate, status, columns } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Project name is required" });
    }

    const project = new Project({
      name,
      description,
      dueDate,
      status: status || "Not Started",
      columns: columns || [
        { id: "todo", title: "To Do" },
        { id: "inprogress", title: "In Progress" },
        { id: "review", title: "In Review" },
        { id: "done", title: "Done" },
      ],
      createdBy: req.user._id,
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { name, description, dueDate, status, columns, members } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (
      !project.createdBy.equals(req.user._id) &&
      !project.members.includes(req.user._id)
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    project.name = name || project.name;
    project.description = description || project.description;
    project.dueDate = dueDate || project.dueDate;
    project.status = status || project.status;
    project.columns = columns || project.columns;
    project.members = members || project.members;

    await project.save();
    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!project.createdBy.equals(req.user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await project.remove();
    res.json({ message: "Project deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getUserProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ createdBy: req.user._id }, { members: req.user._id }],
    })
      .populate("members", "name avatar")
      .populate("createdBy", "name");
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
