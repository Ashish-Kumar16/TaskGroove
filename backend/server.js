require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const morgan = require("morgan"); // ✅ Import morgan

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev")); // ✅ Logger middleware

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/members", require("./routes/memberRoutes"));

// Error handling for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
