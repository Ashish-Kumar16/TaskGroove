import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  TextField,
  IconButton,
  Button,
  Checkbox,
  Chip,
  Tabs,
  Tab,
  InputAdornment,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import { Search, Plus, Filter, MoreHorizontal } from "lucide-react";

// Mock Data
const tasksData = [
  {
    id: 1,
    title: "Design new dashboard",
    description: "Create mockups for the new admin dashboard",
    status: "In Progress",
    priority: "High",
    dueDate: "2023-05-15",
    project: { id: 1, name: "Website Redesign" },
    assignee: {
      id: 1,
      name: "John Doe",
      avatar: "https://ui-avatars.com/api/?name=John+Doe&background=random",
    },
    completed: false,
  },
  {
    id: 2,
    title: "Implement authentication",
    description: "Set up user authentication and authorization",
    status: "To Do",
    priority: "Medium",
    dueDate: "2023-05-20",
    project: { id: 2, name: "Backend API" },
    assignee: {
      id: 1,
      name: "John Doe",
      avatar: "https://ui-avatars.com/api/?name=John+Doe&background=random",
    },
    completed: false,
  },
  {
    id: 3,
    title: "Create user documentation",
    description: "Write documentation for the user guide",
    status: "To Do",
    priority: "Low",
    dueDate: "2023-05-25",
    project: { id: 3, name: "Documentation" },
    assignee: {
      id: 2,
      name: "Jane Smith",
      avatar: "https://ui-avatars.com/api/?name=Jane+Smith&background=random",
    },
    completed: false,
  },
  {
    id: 4,
    title: "Fix navigation bug",
    description: "Resolve issue with the mobile navigation menu",
    status: "In Progress",
    priority: "High",
    dueDate: "2023-05-12",
    project: { id: 1, name: "Website Redesign" },
    assignee: {
      id: 3,
      name: "Mike Johnson",
      avatar: "https://ui-avatars.com/api/?name=Mike+Johnson&background=random",
    },
    completed: false,
  },
  {
    id: 5,
    title: "Update dependencies",
    description: "Update all packages to their latest versions",
    status: "Done",
    priority: "Medium",
    dueDate: "2023-05-08",
    project: { id: 2, name: "Backend API" },
    assignee: {
      id: 1,
      name: "John Doe",
      avatar: "https://ui-avatars.com/api/?name=John+Doe&background=random",
    },
    completed: true,
  },
];

const Tasks = () => {
  const [tasks, setTasks] = useState(tasksData);
  const [searchQuery, setSearchQuery] = useState("");
  const [tabValue, setTabValue] = useState("all");
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuTaskId, setMenuTaskId] = useState(null);
  const navigate = useNavigate();

  // Handlers
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const toggleCompletion = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuTaskId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuTaskId(null);
  };

  // Filtering
  const filtered = tasks.filter((task) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      task.title.toLowerCase().includes(q) ||
      task.description.toLowerCase().includes(q) ||
      task.project.name.toLowerCase().includes(q);

    if (!matchSearch) return false;

    switch (tabValue) {
      case "mine":
        // stubbed: filter by assignee id === 1
        return task.assignee.id === 1;
      case "completed":
        return task.completed;
      case "overdue":
        return !task.completed && new Date(task.dueDate) < new Date();
      default:
        return true;
    }
  });

  return (
    <DashboardLayout>
      <Container sx={{ py: 4 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h4" gutterBottom>
              Tasks
            </Typography>
            <Typography color="textSecondary">
              Manage your tasks across all projects
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Plus size={16} />}
            onClick={() => navigate("/tasks/new")}
            sx={{
              background: "black",
              "&:hover": {
                backgroundColor: "#333333",
              },
            }}
          >
            Add Task
          </Button>
        </Box>

        {/* Search & Filter */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: 2,
            mb: 3,
          }}
        >
          <TextField
            fullWidth
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={16} />
                </InputAdornment>
              ),
            }}
          />
          <Button variant="outlined" startIcon={<Filter size={16} />}>
            Filter
          </Button>
        </Box>

        {/* Tabs */}
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="All Tasks" value="all" />
          <Tab label="My Tasks" value="mine" />
          <Tab label="Completed" value="completed" />
          <Tab label="Overdue" value="overdue" />
        </Tabs>

        {/* Task Table */}
        <Card>
          <CardHeader
            title={
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "5fr 2fr 2fr 2fr 1fr auto",
                  fontWeight: "medium",
                  fontSize: 14,
                }}
              >
                <span>Task</span>
                <span>Status</span>
                <span>Due Date</span>
                <span>Project</span>
                <span>Assignee</span>
                <span />
              </Box>
            }
          />
          <Divider />
          <CardContent sx={{ p: 0 }}>
            {filtered.length === 0 ? (
              <Box sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
                No tasks found. Try adjusting your search.
              </Box>
            ) : (
              filtered.map((task) => (
                <Box
                  key={task.id}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "5fr 2fr 2fr 2fr 1fr auto",
                    alignItems: "center",
                    gap: 1,
                    p: 1,
                    "&:hover": { backgroundColor: "action.hover" },
                  }}
                >
                  {/* Title + Checkbox */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Checkbox
                      checked={task.completed}
                      onChange={() => toggleCompletion(task.id)}
                      size="small"
                    />
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          textDecoration: task.completed
                            ? "line-through"
                            : "none",
                          color: task.completed
                            ? "text.secondary"
                            : "text.primary",
                        }}
                      >
                        {task.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        noWrap
                        sx={{ color: "text.secondary" }}
                      >
                        {task.description}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Status */}
                  <Chip
                    label={task.status}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderColor:
                        task.status === "In Progress"
                          ? "primary.main"
                          : task.status === "To Do"
                          ? "grey.500"
                          : "success.main",
                      color:
                        task.status === "In Progress"
                          ? "primary.main"
                          : task.status === "To Do"
                          ? "grey.700"
                          : "success.main",
                    }}
                  />

                  {/* Due Date */}
                  <Typography variant="body2">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </Typography>

                  {/* Project */}
                  <Typography variant="body2">{task.project.name}</Typography>

                  {/* Assignee */}
                  <Avatar
                    src={task.assignee.avatar}
                    sx={{ width: 28, height: 28, margin: "0 auto" }}
                  >
                    {task.assignee.name.slice(0, 2).toUpperCase()}
                  </Avatar>

                  {/* Actions */}
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, task.id)}
                  >
                    <MoreHorizontal size={16} />
                  </IconButton>
                </Box>
              ))
            )}
          </CardContent>
        </Card>

        {/* Menu for Actions */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem
            onClick={() => {
              navigate(`/tasks/${menuTaskId}`);
              handleMenuClose();
            }}
          >
            View Details
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate(`/tasks/${menuTaskId}/edit`);
              handleMenuClose();
            }}
          >
            Edit Task
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={() => {
              deleteTask(menuTaskId);
              handleMenuClose();
            }}
            sx={{ color: "error.main" }}
          >
            Delete Task
          </MenuItem>
        </Menu>
      </Container>
    </DashboardLayout>
  );
};

export default Tasks;
