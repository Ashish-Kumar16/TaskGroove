import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import {
  Box,
  Container,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppRedux";
import { createTask } from "@/store/tasksSlice";

const NewTask = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const projects = useAppSelector((state) => state.projects.projects);
  const members = useAppSelector((state) => state.members.members);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!projectId || !assigneeId) {
      toast({
        title: "Error",
        description: "Please select a project and assignee.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const taskData = {
      title,
      description,
      status: "To Do",
      priority,
      dueDate,
      projectId,
      assigneeId,
      completed: false,
    };

    try {
      await dispatch(createTask(taskData)).unwrap();
      toast({
        title: "Task created",
        description: "Your new task has been created successfully.",
      });
      navigate("/tasks");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to create task.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Create New Task
          </Typography>
          <Typography color="textSecondary">
            Add a new task to your project
          </Typography>
        </Box>

        <Card>
          <CardHeader
            title={<Typography variant="h6">Task Details</Typography>}
            subheader={
              <Typography variant="body2">
                Fill in the task information below
              </Typography>
            }
          />
          <Box component="form" onSubmit={handleSubmit}>
            <CardContent
              sx={{ display: "flex", flexDirection: "column", gap: 3 }}
            >
              <TextField
                label="Task Title"
                placeholder="Enter task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Description"
                placeholder="Enter task description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                minRows={4}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel id="project-label">Project</InputLabel>
                <Select
                  labelId="project-label"
                  value={projectId}
                  label="Project"
                  onChange={(e) => setProjectId(e.target.value)}
                  required
                >
                  {projects.map((project) => (
                    <MenuItem key={project._id} value={project._id}>
                      {project.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="assignee-label">Assignee</InputLabel>
                <Select
                  labelId="assignee-label"
                  value={assigneeId}
                  label="Assignee"
                  onChange={(e) => setAssigneeId(e.target.value)}
                  required
                >
                  {members.map((member) => (
                    <MenuItem key={member._id} value={member._id}>
                      {member.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="priority-label">Priority</InputLabel>
                <Select
                  labelId="priority-label"
                  value={priority}
                  label="Priority"
                  onChange={(e) => setPriority(e.target.value)}
                  required
                >
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Due Date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </CardContent>
            <CardActions sx={{ p: 3, justifyContent: "flex-end" }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
                sx={{
                  background: "black",
                  "&:hover": { backgroundColor: "#333333" },
                }}
              >
                {loading ? "Creating..." : "Create Task"}
              </Button>
            </CardActions>
          </Box>
        </Card>
      </Container>
    </DashboardLayout>
  );
};

export default NewTask;
