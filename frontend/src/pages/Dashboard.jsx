import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  Button,
  Tabs,
  Tab,
  LinearProgress,
  Chip,
  Paper,
  Divider,
} from "@mui/material";
import DashboardLayout from "../components/layouts/DashboardLayout.jsx";

// Mock Data
const recentActivities = [
  {
    id: 1,
    action: "commented on task",
    task: "Update homepage design",
    time: "2 hours ago",
    project: "Website Redesign",
  },
  {
    id: 2,
    action: "completed task",
    task: "Create API documentation",
    time: "5 hours ago",
    project: "Backend API",
  },
  {
    id: 3,
    action: "updated status to",
    task: "Fix navigation bug",
    status: "In Progress",
    time: "Yesterday",
    project: "Bug Fixes",
  },
];

const assignedTasks = [
  {
    id: 1,
    title: "Design new dashboard",
    status: "In Progress",
    dueDate: "2023-05-15",
    priority: "High",
    project: "Website Redesign",
  },
  {
    id: 2,
    title: "Implement authentication",
    status: "To Do",
    dueDate: "2023-05-20",
    priority: "Medium",
    project: "Backend API",
  },
  {
    id: 3,
    title: "Create user documentation",
    status: "To Do",
    dueDate: "2023-05-25",
    priority: "Low",
    project: "Documentation",
  },
];

const projects = [
  {
    id: 1,
    name: "Website Redesign",
    progress: 60,
    tasksCompleted: 12,
    totalTasks: 20,
  },
  {
    id: 2,
    name: "Backend API",
    progress: 30,
    tasksCompleted: 5,
    totalTasks: 15,
  },
  {
    id: 3,
    name: "Mobile App",
    progress: 10,
    tasksCompleted: 2,
    totalTasks: 18,
  },
];

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("overview");
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const userData = localStorage.getItem("user");

    if (!authToken || !userData) {
      navigate("/login");
      return;
    }

    setUser(JSON.parse(userData));
  }, [navigate]);

  if (!user) return null;

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { md: "center" },
            justifyContent: "space-between",
            mb: 3,
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h4" gutterBottom>
              Welcome back, {user.name}
            </Typography>
            <Typography color="textSecondary">
              Here's what's happening with your projects today.
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => navigate("/projects/new")}
            sx={{
              background: "black",
              "&:hover": {
                backgroundColor: "#333333",
              },
            }}
          >
            New Project
          </Button>
        </Box>

        <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="Overview" value="overview" />
          <Tab label="My Tasks" value="tasks" />
          <Tab label="Projects" value="projects" />
        </Tabs>

        {tab === "overview" && (
          <Box>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardHeader title="Total Projects" />
                  <CardContent>
                    <Typography variant="h5">{projects.length}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      +2 from last month
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardHeader title="Tasks Assigned" />
                  <CardContent>
                    <Typography variant="h5">{assignedTasks.length}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      1 due today
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardHeader title="Completion Rate" />
                  <CardContent>
                    <Typography variant="h5">68%</Typography>
                    <Box sx={{ mt: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={68}
                        sx={{
                          // make the track a light grey:
                          backgroundColor: (theme) => theme.palette.grey[300],
                          // fill the bar itself in black:
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: "#000",
                          },
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Card>
              <CardHeader
                title="Recent Activity"
                subheader="Your latest actions across projects"
              />
              <Divider />
              <CardContent>
                <Grid container spacing={2}>
                  {recentActivities.map((activity) => (
                    <Grid item xs={12} key={activity.id}>
                      <Paper
                        sx={{
                          p: 2,
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 2,
                        }}
                      >
                        <Avatar src={user.avatar}>
                          {user.name.slice(0, 2).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body2">
                            You {activity.action}{" "}
                            <strong>{activity.task}</strong>
                            {activity.status && (
                              <strong> {activity.status}</strong>
                            )}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {activity.project} • {activity.time}
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Box>
        )}

        {tab === "tasks" && (
          <Card>
            <CardHeader
              title="My Tasks"
              subheader="Tasks assigned to you across all projects"
            />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                {assignedTasks.map((task) => (
                  <Grid item xs={12} key={task.id}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        p: 2,
                        border: 1,
                        borderColor: "divider",
                        borderRadius: 1,
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle1">
                          {task.title}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {task.project} • Due:{" "}
                          {new Date(task.dueDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Chip
                          label={task.priority}
                          color={
                            task.priority === "High"
                              ? "error"
                              : task.priority === "Medium"
                              ? "warning"
                              : "success"
                          }
                          size="small"
                        />
                        <Chip
                          label={task.status}
                          variant="outlined"
                          size="small"
                        />
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
            <CardActions>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate("/tasks")}
              >
                View All Tasks
              </Button>
            </CardActions>
          </Card>
        )}

        {tab === "projects" && (
          <Box>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              {projects.map((project) => (
                <Grid item xs={12} md={4} key={project.id}>
                  <Card>
                    <CardHeader
                      title={project.name}
                      subheader={`${project.tasksCompleted} of ${project.totalTasks} tasks completed`}
                    />
                    <Divider />
                    <CardContent>
                      <Box sx={{ mt: 1, mb: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={project.progress}
                          sx={{
                            // light grey track
                            backgroundColor: (theme) => theme.palette.grey[300],
                            // black fill bar
                            "& .MuiLinearProgress-bar": {
                              backgroundColor: "#000",
                            },
                          }}
                        />
                      </Box>
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        align="right"
                      >
                        {project.progress}% complete
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        fullWidth
                        variant="text"
                        onClick={() => navigate(`/projects/${project.id}`)}
                        sx={{ color: "black" }}
                      >
                        View Project
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Button
              //   fullWidth
              variant="outlined"
              onClick={() => navigate("/projects")}
              sx={{ color: "black" }}
            >
              View All Projects
            </Button>
          </Box>
        )}
      </Box>
    </DashboardLayout>
  );
};

export default Dashboard;
