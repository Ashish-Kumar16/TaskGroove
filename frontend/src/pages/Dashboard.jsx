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
  Skeleton,
} from "@mui/material";
import DashboardLayout from "../components/layouts/DashboardLayout.jsx";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppRedux";
import { fetchUserProjects } from "@/store/projectsSlice";
import { fetchAssignedTasks } from "@/store/tasksSlice";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authToken = localStorage.getItem("authToken");
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const reduxUser = useAppSelector((state) => state.auth?.user);
  const member = useAppSelector((state) =>
    state.members.members.find((m) => m.email === storedUser?.email),
  );
  const user = member || reduxUser || storedUser;
  const projects = useAppSelector((state) => state.projects.projects) || [];
  const assignedTasks = useAppSelector((state) => state.tasks.tasks) || [];
  const loading = useAppSelector(
    (state) => state.projects.loading || state.tasks.loading,
  );
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    if (!authToken) {
      navigate("/login", { replace: true });
      return;
    }

    if (!user) {
      console.log("Dashboard: No user data found, but token exists");
    }

    dispatch(fetchUserProjects());
    dispatch(fetchAssignedTasks());
  }, [dispatch, navigate, authToken, user]);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  if (!user) {
    return null;
  }

  const recentActivities = assignedTasks.slice(0, 5).map((task) => ({
    id: task.id,
    action: task.completed ? "completed" : "updated",
    task: task.title,
    status: task.status,
    project: task.project?.name || "Unknown Project",
    time: new Date(task.dueDate).toLocaleTimeString(),
  }));

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        {loading ? (
          <Box>
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
                <Skeleton variant="text" width={200} height={40} />
                <Skeleton variant="text" width={300} height={20} />
              </Box>
              <Skeleton variant="rectangular" width={120} height={36} />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Skeleton variant="rectangular" width={300} height={48} />
            </Box>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              {[...Array(3)].map((_, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card>
                    <CardHeader
                      title={<Skeleton variant="text" width={100} />}
                    />
                    <CardContent>
                      <Skeleton variant="text" width={50} height={40} />
                      <Skeleton variant="text" width={120} />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Card>
              <CardHeader
                title={<Skeleton variant="text" width={150} />}
                subheader={<Skeleton variant="text" width={200} />}
              />
              <Divider />
              <CardContent>
                <Grid container spacing={2}>
                  {[...Array(5)].map((_, index) => (
                    <Grid item xs={12} key={index}>
                      <Paper
                        sx={{
                          p: 2,
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 2,
                        }}
                      >
                        <Skeleton variant="circular" width={40} height={40} />
                        <Box sx={{ flexGrow: 1 }}>
                          <Skeleton variant="text" width="80%" />
                          <Skeleton variant="text" width="60%" />
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Box>
        ) : (
          <>
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
                  "&:hover": { backgroundColor: "#333333" },
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
                        <Typography variant="h5">
                          {assignedTasks.length}
                        </Typography>
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
                              backgroundColor: (theme) =>
                                theme.palette.grey[300],
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
                              <Typography
                                variant="caption"
                                color="textSecondary"
                              >
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
                              {task.project?.name || "Unknown Project"} • Due:{" "}
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
                  {projects.map((project) => {
                    const progress =
                      project.progress !== undefined && !isNaN(project.progress)
                        ? Math.min(Math.max(project.progress, 0), 100)
                        : 0;

                    return (
                      <Grid item xs={12} md={4} key={project.id}>
                        <Card>
                          <CardHeader
                            title={project.name}
                            subheader={`${project.tasksCompleted || 0} of ${
                              project.totalTasks || 0
                            } tasks completed`}
                          />
                          <Divider />
                          <CardContent>
                            <Box sx={{ mt: 1, mb: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={progress}
                                sx={{
                                  backgroundColor: (theme) =>
                                    theme.palette.grey[300],
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
                              {progress}% complete
                            </Typography>
                          </CardContent>
                          <CardActions>
                            <Button
                              fullWidth
                              variant="text"
                              onClick={() =>
                                navigate(`/projects/${project.id}`)
                              }
                              sx={{ color: "black" }}
                            >
                              View Project
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/projects")}
                  sx={{ color: "black" }}
                >
                  View All Projects
                </Button>
              </Box>
            )}
          </>
        )}
      </Box>
    </DashboardLayout>
  );
};

export default Dashboard;
