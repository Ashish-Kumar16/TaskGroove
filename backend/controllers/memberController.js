const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.getMembers = async (req, res) => {
  try {
    const members = await User.find()
      .select("-password")
      .populate("projects", "name");
    res.json(members);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMemberById = async (req, res) => {
  try {
    const member = await User.findById(req.params.id)
      .select("-password")
      .populate("projects", "name");
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    res.json(member);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addMember = async (req, res) => {
  try {
    const { name, email, phone, role } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const defaultPassword = "password123"; // In production, implement email invitation
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      role,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name,
      )}&background=random`,
      projects: [],
    });

    await user.save();
    await user.populate("projects", "name");
    res.status(201).json({ ...user.toObject(), password: undefined });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateMember = async (req, res) => {
  try {
    const { name, email, phone, role, projects } = req.body;
    const member = await User.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // Basic authorization: allow any authenticated user (enhance with RBAC in production)
    member.name = name || member.name;
    member.email = email || member.email;
    member.phone = phone || member.phone;
    member.role = role || member.role;
    member.projects = projects || member.projects;

    await member.save();
    await member.populate("projects", "name"); // Populate projects
    res.json({ ...member.toObject(), password: undefined });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteMember = async (req, res) => {
  try {
    const member = await User.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // Basic authorization: allow any authenticated user (enhance with RBAC in production)
    await member.remove();
    res.json({ message: "Member deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
