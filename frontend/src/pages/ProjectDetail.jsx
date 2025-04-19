import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
  TextField,
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

// Mock data arrays omitted for brevity
const projectsData = [
  {
    id: "1",
    name: "Website Redesign",
    description: "Redesign the company website with new branding",
    status: "In Progress",
    progress: 65,
    dueDate: "2023-07-15",
    team: [
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
    tasks: [
      { id: 1, title: "Research competitors", status: "Completed" },
      { id: 2, title: "Create wireframes", status: "In Progress" },
      { id: 3, title: "Design homepage", status: "In Progress" },
      { id: 4, title: "Implement frontend", status: "Not Started" },
    ],
  },
  {
    id: "2",
    name: "Mobile App Development",
    description: "Develop a new mobile application for customers",
    status: "Not Started",
    progress: 15,
    dueDate: "2023-09-30",
    team: [
      {
        id: 3,
        name: "Mike Johnson",
        avatar:
          "https://ui-avatars.com/api/?name=Mike+Johnson&background=random",
      },
    ],
    tasks: [
      { id: 5, title: "Define requirements", status: "In Progress" },
      { id: 6, title: "Create mockups", status: "Not Started" },
    ],
  },
];
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
  const { toast } = useToast();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState("");

  useEffect(() => {
    const found = projectsData.find((p) => p.id === projectId);
    if (found) {
      setProject(found);
    } else {
      toast({
        title: "Project not found",
        description: `Could not find project ${projectId}.`,
        variant: "destructive",
      });
      navigate("/projects");
    }
    setLoading(false);
  }, [projectId, navigate, toast]);

  const availableMembers = project
    ? allTeamMembers.filter((m) => !project.team.some((tm) => tm.id === m.id))
    : [];

  const handleAddTeamMember = () => {
    if (!selectedMember) return;
    const member = allTeamMembers.find(
      (m) => m.id.toString() === selectedMember,
    );
    setProject({ ...project, team: [...project.team, member] });
    setSelectedMember("");
    toast({ title: "Team member added", description: `${member.name} added.` });
  };

  const statusColor = (status) => {
    if (status === "Completed") return "success";
    if (status === "In Progress") return "default";
    return "warning";
  };

  // Task stats
  const totalTasks = project?.tasks.length || 0;
  const completedTasks =
    project?.tasks.filter((t) => t.status === "Completed").length || 0;
  const inProgressTasks =
    project?.tasks.filter((t) => t.status === "In Progress").length || 0;
  const pendingTasks =
    project?.tasks.filter((t) => t.status === "Not Started").length || 0;

  if (loading) {
    return (
      <DashboardLayout>
        <Box p={4}>Loading...</Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box p={4}>
        <Box mb={3} display="flex" alignItems="center" gap={2}>
          <Button
            variant="outlined"
            startIcon={<ChevronLeft />}
            onClick={() => navigate("/projects")}
          >
            Back
          </Button>
          <Typography variant="h4">{project.name}</Typography>
          <Chip label={project.status} color={statusColor(project.status)} />
        </Box>

        <Grid container spacing={3}>
          {/* Project Details */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Project Details" />
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  {project.description}
                </Typography>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Calendar size={16} />
                  <Typography>
                    Due {new Date(project.dueDate).toLocaleDateString()}
                  </Typography>
                </Box>
                <Typography variant="subtitle2">Progress</Typography>
                <LinearProgress
                  variant="determinate"
                  value={project.progress}
                  sx={{ my: 1 }}
                />
                <Typography variant="body2">
                  {project.progress}% Complete
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Team Members */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title="Team Members"
                action={
                  <IconButton onClick={() => {}}>
                    <Plus />
                  </IconButton>
                }
              />
              <CardContent>
                <Box display="flex" gap={2} flexWrap="wrap">
                  {project.team.map((member) => (
                    <Box
                      key={member.id}
                      display="flex"
                      alignItems="center"
                      gap={1}
                    >
                      <Avatar src={member.avatar}>{member.name[0]}</Avatar>
                      <Box>
                        <Typography variant="body2">{member.name}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {allTeamMembers.find((m) => m.id === member.id)?.role}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
                <Dialog
                  open={!!selectedMember}
                  onClose={() => setSelectedMember("")}
                >
                  <DialogTitle>Add Team Member</DialogTitle>
                  <DialogContent>
                    <FormControl fullWidth>
                      <InputLabel id="add-member-label">Member</InputLabel>
                      <Select
                        labelId="add-member-label"
                        value={selectedMember}
                        label="Member"
                        onChange={(e) => setSelectedMember(e.target.value)}
                      >
                        {availableMembers.map((m) => (
                          <MenuItem key={m.id} value={m.id.toString()}>
                            {m.name} — {m.role}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setSelectedMember("")}>
                      Cancel
                    </Button>
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

          {/* Task Summary */}
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
                  {project.tasks.map((task) => (
                    <Box
                      key={task.id}
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
                      <Button onClick={() => navigate(`/tasks/${task.id}`)}>
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
