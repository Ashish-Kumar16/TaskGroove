import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
  LinearProgress,
  Chip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Calendar,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  ChevronLeft,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { fetchProjectById, updateProject } from "../store/projectsSlice";
import { fetchTasksByProject } from "../store/tasksSlice";

// Fallback list of all possible members (replace with API call in real app)
const allTeamMembers = [
  {
    id: 1,
    name: "John Doe",
    avatar: "https://ui-avatars.com/api/?name=John+Doe&background=random",
    role: "Project Manager",
  },
  {
    id: 2,
    name: "Jane Smith",
    avatar: "https://ui-avatars.com/api/?name=Jane+Smith&background=random",
    role: "Frontend Developer",
  },
  {
    id: 3,
    name: "Mike Johnson",
    avatar: "https://ui-avatars.com/api/?name=Mike+Johnson&background=random",
    role: "Backend Developer",
  },
  {
    id: 4,
    name: "Sarah Wilson",
    avatar: "https://ui-avatars.com/api/?name=Sarah+Wilson&background=random",
    role: "UI/UX Designer",
  },
  {
    id: 5,
    name: "David Brown",
    avatar: "https://ui-avatars.com/api/?name=David+Brown&background=random",
    role: "QA Engineer",
  },
  {
    id: 6,
    name: "Emily Davis",
    avatar: "https://ui-avatars.com/api/?name=Emily+Davis&background=random",
    role: "Product Owner",
  },
];

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const { currentProject, loading: projectLoading } = useSelector(
    (state) => state.projects,
  );
  const { tasks, loading: tasksLoading } = useSelector((state) => state.tasks);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState("");

  useEffect(() => {
    dispatch(fetchProjectById(projectId));
    dispatch(fetchTasksByProject(projectId));
  }, [projectId, dispatch]);

  const handleAddTeamMember = async () => {
    if (!selectedMember) return;

    try {
      // prepare updated member IDs
      const updatedIds = [
        ...currentProject.members.map((m) => m._id || m.id),
        selectedMember,
      ];
      await dispatch(
        updateProject({
          projectId: currentProject.id || currentProject._id,
          projectData: { members: updatedIds },
        }),
      ).unwrap();

      toast({
        title: "Member added",
        description: "Team member added successfully",
      });
      setSelectedMember("");
      setDialogOpen(false);
    } catch (err) {
      toast({
        title: "Error adding member",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  if (projectLoading || tasksLoading) {
    return (
      <DashboardLayout>
        <Box p={4}>
          <LinearProgress />
        </Box>
      </DashboardLayout>
    );
  }

  if (!currentProject) {
    return (
      <DashboardLayout>
        <Box p={4}>Project not found</Box>
      </DashboardLayout>
    );
  }

  // Task statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const inProgressTasks = tasks.filter(
    (t) => t.status === "In Progress",
  ).length;
  const pendingTasks = tasks.filter((t) => t.status === "Not Started").length;

  const statusColor = (status) => {
    if (status === "Completed") return "success";
    if (status === "In Progress") return "default";
    return "warning";
  };

  // filter available members to add
  const availableMembers = allTeamMembers.filter(
    (m) =>
      !currentProject.members.some(
        (mem) => mem._id === m.id || mem.id === m.id,
      ),
  );

  return (
    <DashboardLayout>
      <Box p={4}>
        {/* Header */}
        <Box mb={3} display="flex" alignItems="center" gap={2}>
          <Button
            variant="outlined"
            startIcon={<ChevronLeft />}
            onClick={() => navigate("/projects")}
          >
            Back
          </Button>
          <Typography variant="h4">{currentProject.name}</Typography>
          <Chip
            label={currentProject.status}
            color={statusColor(currentProject.status)}
          />
        </Box>

        <Grid container spacing={3}>
          {/* Project Details Card */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Project Details" />
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  {currentProject.description}
                </Typography>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Calendar size={16} />
                  <Typography>
                    Due {new Date(currentProject.dueDate).toLocaleDateString()}
                  </Typography>
                </Box>
                <Typography variant="subtitle2">Progress</Typography>
                <LinearProgress
                  variant="determinate"
                  value={
                    totalTasks > 0
                      ? Math.round((completedTasks / totalTasks) * 100)
                      : 0
                  }
                  sx={{ my: 1 }}
                />
                <Typography variant="body2">
                  {totalTasks > 0
                    ? Math.round((completedTasks / totalTasks) * 100)
                    : 0}
                  % Complete
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Team Members Card */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title="Team Members"
                action={
                  <IconButton onClick={() => setDialogOpen(true)}>
                    <Plus />
                  </IconButton>
                }
              />
              <CardContent>
                <Box display="flex" gap={2} flexWrap="wrap">
                  {currentProject.members.map((mem) => (
                    <Box
                      key={mem._id || mem.id}
                      display="flex"
                      alignItems="center"
                      gap={1}
                    >
                      <Avatar src={mem.avatar}>{mem.name[0]}</Avatar>
                      <Box>
                        <Typography variant="body2">{mem.name}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {
                            allTeamMembers.find(
                              (m) => m.id === (mem._id || mem.id),
                            )?.role
                          }
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>

                {/* Add Member Dialog */}
                <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                  <DialogTitle>Add Team Member</DialogTitle>
                  <DialogContent>
                    <FormControl fullWidth>
                      <InputLabel id="member-select-label">Member</InputLabel>
                      <Select
                        labelId="member-select-label"
                        value={selectedMember}
                        label="Member"
                        onChange={(e) => setSelectedMember(e.target.value)}
                      >
                        {availableMembers.map((m) => (
                          <MenuItem key={m.id} value={m.id}>
                            {m.name} — {m.role}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button
                      onClick={handleAddTeamMember}
                      disabled={!selectedMember}
                    >
                      Add
                    </Button>
                  </DialogActions>
                </Dialog>
              </CardContent>
            </Card>
          </Grid>

          {/* Task Summary Cards */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {[
                {
                  label: "Completed",
                  value: completedTasks,
                  icon: <CheckCircle size={20} />,
                  color: "success",
                },
                {
                  label: "In Progress",
                  value: inProgressTasks,
                  icon: <Clock size={20} />,
                  color: "default",
                },
                {
                  label: "Pending",
                  value: pendingTasks,
                  icon: <AlertCircle size={20} />,
                  color: "warning",
                },
              ].map((stat) => (
                <Grid item xs={12} sm={4} key={stat.label}>
                  <Card>
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        {stat.icon}
                        <Typography variant="subtitle2">
                          {stat.label}
                        </Typography>
                      </Box>
                      <Typography variant="h5">{stat.value}</Typography>
                      <Typography variant="body2">
                        {totalTasks > 0
                          ? Math.round((stat.value / totalTasks) * 100)
                          : 0}
                        % of tasks
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Tasks List */}
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title={`Tasks (${totalTasks})`}
                action={
                  <Button
                    startIcon={<Plus />}
                    onClick={() =>
                      navigate(`/tasks/new?projectId=${projectId}`)
                    }
                  >
                    Add Task
                  </Button>
                }
              />
              <CardContent>
                <Box display="flex" flexDirection="column" gap={2}>
                  {tasks.map((task) => (
                    <Box
                      key={task._id || task.id}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      p={2}
                      border="1px solid"
                      borderRadius={1}
                    >
                      <Box>
                        <Typography variant="subtitle2">
                          {task.title}
                        </Typography>
                        <Chip
                          label={task.status}
                          color={statusColor(task.status)}
                        />
                      </Box>
                      <Button
                        onClick={() =>
                          navigate(`/tasks/${task._id || task.id}`)
                        }
                      >
                        View
                      </Button>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default ProjectDetail;
