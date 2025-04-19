import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import {
  Box,
  Container,
  Typography,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";

const NewProject = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    dueDate: "",
    status: "Not Started",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleStatusChange = (e) => {
    setFormData((prev) => ({ ...prev, status: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({
        title: "Invalid input",
        description: "Project name is required.",
        variant: "destructive",
      });
      return;
    }
    if (!formData.dueDate) {
      toast({
        title: "Invalid input",
        description: "Due date is required.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      toast({
        title: "Project created",
        description: "Your new project has been created successfully.",
      });
      navigate("/projects");
    }, 500);
  };

  return (
    <DashboardLayout>
      <Container sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Create New Project
          </Typography>
          <Typography color="textSecondary">
            Add a new project to your workspace
          </Typography>
        </Box>
        <Card>
          <CardHeader
            title="Project Details"
            subheader="Fill in the information below to create your new project"
          />
          <CardContent>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: "flex", flexDirection: "column", gap: 3 }}
            >
              <TextField
                id="name"
                label="Project Name"
                placeholder="Enter project name"
                required
                fullWidth
                value={formData.name}
                onChange={handleChange}
              />
              <TextField
                id="description"
                label="Description"
                placeholder="Enter project description"
                multiline
                rows={4}
                fullWidth
                value={formData.description}
                onChange={handleChange}
              />
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 2,
                }}
              >
                <TextField
                  id="dueDate"
                  label="Due Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  required
                  fullWidth
                  value={formData.dueDate}
                  onChange={handleChange}
                />
                <FormControl fullWidth>
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    id="status"
                    value={formData.status}
                    label="Status"
                    onChange={handleStatusChange}
                  >
                    <MenuItem value="Not Started">Not Started</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <CardActions sx={{ pt: 0 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  fullWidth
                  sx={{
                    backgroundColor: "black",
                    "&:hover": { backgroundColor: "#333" },
                  }}
                  startIcon={
                    loading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : null
                  }
                >
                  {loading ? "Creating..." : "Create Project"}
                </Button>
              </CardActions>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </DashboardLayout>
  );
};

export default NewProject;
