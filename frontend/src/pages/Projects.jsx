// src/pages/Projects.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Avatar,
  TextField,
  Grid,
  Tabs,
  Tab,
  Menu,
  MenuItem,
  LinearProgress,
  Chip,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  CircularProgress,
} from "@mui/material";
import { Search, MoreHorizontal, Plus } from "lucide-react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppRedux";
import { fetchProjects, deleteProject } from "@/store/projectsSlice";
import { fetchTasks } from "@/store/tasksSlice";

const Projects = () => {
  const dispatch = useAppDispatch();
  const {
    projects,
    loading: projectsLoading,
    error: projectsError,
  } = useAppSelector((state) => state.projects);
  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
  } = useAppSelector((state) => state.tasks);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("grid");
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuProjectId, setMenuProjectId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchTasks());
  }, [dispatch]);

  const calculateProjectStats = (projectId) => {
    const projectTasks = tasks.filter((task) => task.project === projectId);
    const totalTasks = projectTasks.length;
    const completedTasks = projectTasks.filter(
      (t) => t.status === "Completed",
    ).length;
    const progress =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return { totalTasks, completedTasks, progress };
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDeleteProject = async (id) => {
    try {
      await dispatch(deleteProject(id)).unwrap();
      handleMenuClose();
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  const handleMenuOpen = (event, projectId) => {
    setMenuAnchor(event.currentTarget);
    setMenuProjectId(projectId);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setMenuProjectId(null);
  };

  const statusColor = (status) => {
    switch (status) {
      case "In Progress":
        return "primary";
      case "Completed":
        return "success";
      case "Not Started":
        return "warning";
      default:
        return "default";
    }
  };

  const loading = projectsLoading || tasksLoading;
  const error = projectsError || tasksError;

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <DashboardLayout>
      <Box p={4}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Box>
            <Typography variant="h4">Projects</Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Manage your team projects
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Plus />}
            onClick={() => navigate("/projects/new")}
            sx={{ background: "black", "&:hover": { backgroundColor: "#333" } }}
          >
            New Project
          </Button>
        </Box>

        <Box mb={3}>
          <TextField
            fullWidth
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <Search style={{ marginRight: 8 }} />,
            }}
          />
        </Box>

        <Tabs value={view} onChange={(e, val) => setView(val)} sx={{ mb: 3 }}>
          <Tab label="Grid View" value="grid" />
          <Tab label="List View" value="list" />
        </Tabs>

        {view === "grid" && (
          <Grid container spacing={2}>
            {filteredProjects.map((project) => {
              const { progress, totalTasks, completedTasks } =
                calculateProjectStats(project._id);

              return (
                <Grid item xs={12} sm={6} md={4} key={project._id}>
                  <Card>
                    <CardHeader
                      title={project.name}
                      subheader={
                        <Typography variant="body2" noWrap>
                          {project.description}
                        </Typography>
                      }
                      action={
                        <>
                          <Button
                            onClick={(e) => handleMenuOpen(e, project._id)}
                          >
                            <MoreHorizontal />
                          </Button>
                          <Menu
                            anchorEl={menuAnchor}
                            open={menuProjectId === project._id}
                            onClose={handleMenuClose}
                          >
                            <MenuItem
                              onClick={() => {
                                navigate(`/projects/${project._id}`);
                                handleMenuClose();
                              }}
                            >
                              View Project
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                navigate(`/projects/${project._id}/edit`);
                                handleMenuClose();
                              }}
                            >
                              Edit Project
                            </MenuItem>
                            <MenuItem
                              onClick={() => handleDeleteProject(project._id)}
                              sx={{ color: "error.main" }}
                            >
                              Delete Project
                            </MenuItem>
                          </Menu>
                        </>
                      }
                    />
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">Progress</Typography>
                        <Typography variant="body2">{progress}%</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{ mb: 1 }}
                      />
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={1}
                      >
                        <Typography variant="caption">
                          {completedTasks} of {totalTasks} tasks
                        </Typography>
                        <Chip
                          label={project.status}
                          size="small"
                          color={statusColor(project.status)}
                        />
                      </Box>
                      <Typography variant="caption" color="textSecondary">
                        Due: {new Date(project.dueDate).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        width="100%"
                      >
                        <Box
                          display="flex"
                          sx={{ "& > :not(:first-of-type)": { ml: -1 } }}
                        >
                          {project.members.map((m) => (
                            <Avatar key={m._id} alt={m.name} src={m.avatar} />
                          ))}
                        </Box>
                        <Button
                          size="small"
                          onClick={() =>
                            navigate(`/projects/${project._id}/board`)
                          }
                        >
                          View Board
                        </Button>
                      </Box>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        {view === "list" && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Project</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Progress</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Team</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProjects.map((project) => {
                  const { progress } = calculateProjectStats(project._id);

                  return (
                    <TableRow
                      key={project._id}
                      hover
                      onClick={() => navigate(`/projects/${project._id}`)}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell>
                        <Typography variant="subtitle2">
                          {project.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="textSecondary"
                          noWrap
                        >
                          {project.description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={project.status}
                          size="small"
                          color={statusColor(project.status)}
                        />
                      </TableCell>
                      <TableCell>
                        <Box>
                          <LinearProgress
                            variant="determinate"
                            value={progress}
                          />
                          <Typography variant="caption">
                            {progress}% complete
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {new Date(project.dueDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Box
                          display="flex"
                          sx={{ "& > :not(:first-of-type)": { ml: -1 } }}
                        >
                          {project.members.map((m) => (
                            <Avatar key={m._id} alt={m.name} src={m.avatar} />
                          ))}
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </DashboardLayout>
  );
};

export default Projects;
