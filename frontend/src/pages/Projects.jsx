import React, { useState } from "react";
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
  IconButton,
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
} from "@mui/material";
import { Search, MoreHorizontal, Plus } from "lucide-react";
import DashboardLayout from "@/components/layouts/DashboardLayout";

// Mock data
const projectsData = [
  {
    id: 1,
    name: "Website Redesign",
    description: "Redesign the company website with new branding",
    progress: 60,
    status: "In Progress",
    dueDate: "2023-05-30",
    members: [
      {
        id: 1,
        name: "John Doe",
        avatar: "https://ui-avatars.com/api/?name=John+Doe&background=random",
      },
      {
        id: 2,
        name: "Jane Smith",
        avatar: "https://ui-avatars.com/api/?name=Jane+Smith&background=random",
      },
    ],
    tasksCompleted: 12,
    totalTasks: 20,
  },
  {
    id: 2,
    name: "Backend API",
    description: "Build RESTful API for the mobile application",
    progress: 30,
    status: "In Progress",
    dueDate: "2023-06-15",
    members: [
      {
        id: 1,
        name: "John Doe",
        avatar: "https://ui-avatars.com/api/?name=John+Doe&background=random",
      },
      {
        id: 3,
        name: "Mike Johnson",
        avatar:
          "https://ui-avatars.com/api/?name=Mike+Johnson&background=random",
      },
    ],
    tasksCompleted: 5,
    totalTasks: 15,
  },
  {
    id: 3,
    name: "Mobile App",
    description: "Develop a cross-platform mobile application",
    progress: 10,
    status: "To Do",
    dueDate: "2023-07-20",
    members: [
      {
        id: 2,
        name: "Jane Smith",
        avatar: "https://ui-avatars.com/api/?name=Jane+Smith&background=random",
      },
      {
        id: 4,
        name: "Sarah Wilson",
        avatar:
          "https://ui-avatars.com/api/?name=Sarah+Wilson&background=random",
      },
    ],
    tasksCompleted: 2,
    totalTasks: 18,
  },
  {
    id: 4,
    name: "Marketing Campaign",
    description: "Q2 marketing campaign for product launch",
    progress: 90,
    status: "Almost Done",
    dueDate: "2023-05-10",
    members: [
      {
        id: 1,
        name: "John Doe",
        avatar: "https://ui-avatars.com/api/?name=John+Doe&background=random",
      },
      {
        id: 4,
        name: "Sarah Wilson",
        avatar:
          "https://ui-avatars.com/api/?name=Sarah+Wilson&background=random",
      },
    ],
    tasksCompleted: 18,
    totalTasks: 20,
  },
];

const Projects = () => {
  const [projects, setProjects] = useState(projectsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("grid");
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuProjectId, setMenuProjectId] = useState(null);
  const navigate = useNavigate();

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDeleteProject = (id) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    handleMenuClose();
  };

  const handleMenuOpen = (event, projectId) => {
    setMenuAnchor(event.currentTarget);
    setMenuProjectId(projectId);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setMenuProjectId(null);
  };

  // Use default (black) color for "In Progress" status
  const statusColor = (status) => {
    switch (status) {
      case "In Progress":
        return "default";
      case "To Do":
        return "default";
      case "Almost Done":
        return "success";
      default:
        return "secondary";
    }
  };

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
            {filteredProjects.map((project) => (
              <Grid item xs={12} sm={6} md={4} key={project.id}>
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
                        <IconButton
                          onClick={(e) => handleMenuOpen(e, project.id)}
                        >
                          <MoreHorizontal />
                        </IconButton>
                        <Menu
                          anchorEl={menuAnchor}
                          open={menuProjectId === project.id}
                          onClose={handleMenuClose}
                        >
                          <MenuItem
                            onClick={() => {
                              navigate(`/projects/${project.id}`);
                              handleMenuClose();
                            }}
                          >
                            View Project
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              navigate(`/projects/${project.id}/edit`);
                              handleMenuClose();
                            }}
                          >
                            Edit Project
                          </MenuItem>
                          <MenuItem
                            onClick={() => handleDeleteProject(project.id)}
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
                      <Typography variant="body2">
                        {project.progress}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={project.progress}
                      sx={{
                        mb: 1,
                        backgroundColor: (theme) => theme.palette.grey[300],
                        // fill the bar itself in black:
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: "#000",
                        },
                      }}
                    />
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={1}
                    >
                      <Typography variant="caption">
                        {project.tasksCompleted} of {project.totalTasks} tasks
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
                          <Avatar key={m.id} alt={m.name} src={m.avatar} />
                        ))}
                      </Box>
                      <Button
                        size="small"
                        onClick={() =>
                          navigate(`/projects/${project.id}/board`)
                        }
                      >
                        View Board
                      </Button>
                    </Box>
                  </CardActions>
                </Card>
              </Grid>
            ))}
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
                {filteredProjects.map((project) => (
                  <TableRow
                    key={project.id}
                    hover
                    onClick={() => navigate(`/projects/${project.id}`)}
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
                          value={project.progress}
                        />
                        <Typography variant="caption">
                          {project.progress}% complete
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
                          <Avatar key={m.id} alt={m.name} src={m.avatar} />
                        ))}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </DashboardLayout>
  );
};

export default Projects;
