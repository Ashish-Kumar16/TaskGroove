import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import {
  Box,
  Container,
  Typography,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
  Checkbox,
  Chip,
  Tabs,
  Tab,
  InputAdornment,
  Menu,
  MenuItem,
  Divider,
  CircularProgress,
  Avatar,
} from "@mui/material";
import { Search, Plus, MoreHorizontal } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppRedux";
import { fetchTasks, updateTask, deleteTask } from "@/store/tasksSlice";
import { format } from "date-fns";

const Tasks = () => {
  const dispatch = useAppDispatch();
  const { tasks, loading, error } = useAppSelector((state) => state.tasks);
  const currentUser = useAppSelector((state) => state.auth.user);
  const [searchQuery, setSearchQuery] = useState("");
  const [tabValue, setTabValue] = useState("all");
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuTaskId, setMenuTaskId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const toggleCompletion = async (task) => {
    try {
      await dispatch(
        updateTask({
          id: task._id,
          completed: !task.completed,
          status: !task.completed ? "Done" : "To Do",
        }),
      ).unwrap();
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const deleteTaskHandler = async (id) => {
    try {
      await dispatch(deleteTask(id)).unwrap();
      handleMenuClose();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuTaskId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuTaskId(null);
  };

  const filteredTasks = tasks.filter((task) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      task.title.toLowerCase().includes(searchLower) ||
      (task.description &&
        task.description.toLowerCase().includes(searchLower)) ||
      (task.project?.name &&
        task.project.name.toLowerCase().includes(searchLower));

    if (!matchesSearch) return false;

    switch (tabValue) {
      case "mine":
        return task.assignee?._id === currentUser?._id;
      case "completed":
        return task.completed;
      case "overdue":
        return !task.completed && new Date(task.dueDate) < new Date();
      default:
        return true;
    }
  });

  if (loading)
    return (
      <DashboardLayout>
        <Container sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Container>
      </DashboardLayout>
    );

  if (error)
    return (
      <DashboardLayout>
        <Container sx={{ py: 4 }}>
          <Typography color="error">Error: {error}</Typography>
        </Container>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <Container sx={{ py: 4 }}>
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
              "&:hover": { backgroundColor: "#333333" },
            }}
          >
            Add Task
          </Button>
        </Box>

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
        </Box>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{ mb: 3 }}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="All Tasks" value="all" />
          <Tab label="My Tasks" value="mine" />
          <Tab label="Completed" value="completed" />
          <Tab label="Overdue" value="overdue" />
        </Tabs>

        <Card>
          <CardHeader
            title={
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "40px 1fr 120px 120px 120px 120px 40px",
                  fontWeight: "medium",
                  fontSize: 14,
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <span></span>
                <span>Task</span>
                <span>Status</span>
                <span>Due Date</span>
                <span>Project</span>
                <span>Assignee</span>
                <span></span>
              </Box>
            }
          />
          <Divider />
          <CardContent sx={{ p: 0 }}>
            {filteredTasks.length === 0 ? (
              <Box sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
                No tasks found matching your criteria
              </Box>
            ) : (
              filteredTasks.map((task) => (
                <Box
                  key={task._id}
                  sx={{
                    display: "grid",
                    gridTemplateColumns:
                      "40px 1fr 120px 120px 120px 120px 40px",
                    alignItems: "center",
                    gap: 1,
                    p: 2,
                    "&:hover": { backgroundColor: "action.hover" },
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Checkbox
                    checked={task.completed}
                    onChange={() => toggleCompletion(task)}
                    size="small"
                    color="primary"
                  />

                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: "medium",
                        textDecoration: task.completed
                          ? "line-through"
                          : "none",
                        color: task.completed
                          ? "text.secondary"
                          : "text.primary",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {task.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "block",
                      }}
                    >
                      {task.description}
                    </Typography>
                  </Box>

                  <Chip
                    label={task.status}
                    size="small"
                    sx={{
                      backgroundColor:
                        task.status === "Done"
                          ? "success.light"
                          : task.status === "In Progress"
                          ? "info.light"
                          : "grey.100",
                      color:
                        task.status === "Done"
                          ? "success.dark"
                          : task.status === "In Progress"
                          ? "info.dark"
                          : "text.primary",
                    }}
                  />

                  <Typography variant="body2">
                    {task.dueDate
                      ? format(new Date(task.dueDate), "MMM dd, yyyy")
                      : "-"}
                  </Typography>

                  <Typography variant="body2" noWrap>
                    {task.project?.name || "-"}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {task.assignee?.avatar ? (
                      <Avatar
                        src={task.assignee.avatar}
                        sx={{ width: 24, height: 24 }}
                      />
                    ) : (
                      <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                        {task.assignee?.name?.charAt(0) || "?"}
                      </Avatar>
                    )}
                    <Typography variant="body2" noWrap>
                      {task.assignee?.name || "Unassigned"}
                    </Typography>
                  </Box>

                  <Button
                    size="small"
                    onClick={(e) => handleMenuOpen(e, task._id)}
                    sx={{ minWidth: 0 }}
                  >
                    <MoreHorizontal size={16} />
                  </Button>
                </Box>
              ))
            )}
          </CardContent>
        </Card>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
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
            onClick={() => deleteTaskHandler(menuTaskId)}
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
