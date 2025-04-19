import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  ListItemText,
  Checkbox,
  OutlinedInput,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Mail,
  PhoneCall,
  MoreHorizontal,
  Plus,
  Search,
  UserPlus,
  Edit,
  Trash2,
  User,
  FolderSymlink,
} from "lucide-react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppRedux";
import { addMember, removeMember, updateMember } from "@/store/membersSlice";
import { addMemberToProject } from "@/store/projectsSlice";
import { useToast } from "@/hooks/use-toast";

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const Team = () => {
  const members = useAppSelector((state) => state.members.members);
  const projects = useAppSelector((state) => state.projects.projects);
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Team Member",
  });
  const [editMember, setEditMember] = useState({
    id: null,
    name: "",
    email: "",
    phone: "",
    role: "",
    avatar: "",
    projects: [],
  });
  const [selectedProjects, setSelectedProjects] = useState([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Filter members based on search query
  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAddDialogOpen = () => {
    setOpenAddDialog(true);
  };

  const handleAddDialogClose = () => {
    setOpenAddDialog(false);
    setNewMember({
      name: "",
      email: "",
      phone: "",
      role: "Team Member",
    });
  };

  const handleViewMember = (memberId) => {
    const member = members.find((m) => m.id === memberId);
    if (member) {
      setEditMember({ ...member });
      setOpenViewDialog(true);
    }
    handleMenuClose();
  };

  const handleViewDialogClose = () => {
    setOpenViewDialog(false);
  };

  const handleEditMember = (memberId) => {
    const member = members.find((m) => m.id === memberId);
    if (member) {
      setEditMember({ ...member });
      setOpenEditDialog(true);
    }
    handleMenuClose();
  };

  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
  };

  const handleAssignProject = (memberId) => {
    const member = members.find((m) => m.id === memberId);
    if (member) {
      setEditMember({ ...member });
      // Set initially selected projects
      const currentProjectIds = member.projects
        ? member.projects.map((p) => p.id.toString())
        : [];
      setSelectedProjects(currentProjectIds);
      setOpenAssignDialog(true);
    }
    handleMenuClose();
  };

  const handleAssignDialogClose = () => {
    setOpenAssignDialog(false);
    setSelectedProjects([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditMember((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProjectSelectionChange = (event) => {
    const { value } = event.target;
    setSelectedProjects(value);
  };

  const handleAddMember = () => {
    if (!newMember.name || !newMember.email) {
      toast({
        title: "Validation Error",
        description: "Name and email are required fields.",
        variant: "destructive",
      });
      return;
    }

    const newId = Math.max(...members.map((m) => m.id), 0) + 1;
    const memberToAdd = {
      id: newId,
      name: newMember.name,
      email: newMember.email,
      phone: newMember.phone || "+1 (555) 000-0000",
      role: newMember.role,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        newMember.name,
      )}&background=random`,
      projects: [],
    };

    dispatch(addMember(memberToAdd));
    toast({
      title: "Team member added",
      description: `${newMember.name} has been added to the team successfully.`,
    });

    handleAddDialogClose();
  };

  const handleSaveEditMember = () => {
    if (!editMember.name || !editMember.email) {
      toast({
        title: "Validation Error",
        description: "Name and email are required fields.",
        variant: "destructive",
      });
      return;
    }

    dispatch(updateMember(editMember));
    toast({
      title: "Team member updated",
      description: `${editMember.name}'s information has been updated successfully.`,
    });

    handleEditDialogClose();
  };

  const handleAssignProjectsToMember = () => {
    const memberToUpdate = { ...editMember };

    // Create project assignment array
    const projectAssignments = selectedProjects.map((projectId) => {
      const project = projects.find(
        (p) => p.id.toString() === projectId.toString(),
      );
      return {
        id: parseInt(projectId),
        name: project.name,
      };
    });

    // Update member with new project assignments
    memberToUpdate.projects = projectAssignments;
    dispatch(updateMember(memberToUpdate));

    // Also update projects with this member
    selectedProjects.forEach((projectId) => {
      const memberInfo = {
        id: memberToUpdate.id,
        name: memberToUpdate.name,
        avatar: memberToUpdate.avatar,
      };
      dispatch(
        addMemberToProject({
          projectId: parseInt(projectId),
          member: memberInfo,
        }),
      );
    });

    toast({
      title: "Projects assigned",
      description: `${editMember.name} has been assigned to the selected projects.`,
    });

    handleAssignDialogClose();
  };

  const handleRemoveMember = (id) => {
    dispatch(removeMember(id));
    setAnchorEl(null);
    toast({
      title: "Team member removed",
      description: "Team member has been removed successfully.",
    });
  };

  const handleMenuOpen = (event, memberId) => {
    setAnchorEl(event.currentTarget);
    setSelectedMemberId(memberId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedMemberId(null);
  };

  return (
    <DashboardLayout>
      <Box sx={{ p: 3, maxWidth: 1200, margin: "0 auto" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Team
            </Typography>
            <Typography color="text.secondary">
              Manage your team members
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<UserPlus />}
            onClick={handleAddDialogOpen}
            sx={{
              background: "black",
              "&:hover": {
                backgroundColor: "#333333",
              },
            }}
          >
            Add Member
          </Button>
        </Box>

        <Box sx={{ mb: 4, maxWidth: 500 }}>
          <TextField
            fullWidth
            placeholder="Search team members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <Search style={{ marginRight: 8, color: "rgba(0,0,0,0.54)" }} />
              ),
            }}
          />
        </Box>

        <Grid container spacing={3}>
          {filteredMembers.map((member) => (
            <Grid item xs={12} sm={6} md={4} key={member.id}>
              <StyledCard>
                <CardHeader
                  action={
                    <IconButton onClick={(e) => handleMenuOpen(e, member.id)}>
                      <MoreHorizontal />
                    </IconButton>
                  }
                  avatar={
                    <Avatar
                      src={member.avatar}
                      alt={member.name}
                      sx={{ width: 40, height: 40 }}
                    >
                      {member.name.substring(0, 2).toUpperCase()}
                    </Avatar>
                  }
                  title={member.name}
                  subheader={member.role}
                />
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Mail
                      style={{ marginRight: 8, color: "rgba(0,0,0,0.54)" }}
                    />
                    <Typography variant="body2">{member.email}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <PhoneCall
                      style={{ marginRight: 8, color: "rgba(0,0,0,0.54)" }}
                    />
                    <Typography variant="body2">{member.phone}</Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Projects:
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {member.projects && member.projects.length > 0 ? (
                      member.projects.map((project) => (
                        <Chip
                          key={project.id}
                          label={project.name}
                          size="small"
                          variant="outlined"
                        />
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No projects assigned
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>

        {/* Member Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleViewMember(selectedMemberId)}>
            <User size={16} style={{ marginRight: 8 }} />
            View Profile
          </MenuItem>
          <MenuItem onClick={() => handleEditMember(selectedMemberId)}>
            <Edit size={16} style={{ marginRight: 8 }} />
            Edit Member
          </MenuItem>
          <MenuItem onClick={() => handleAssignProject(selectedMemberId)}>
            <FolderSymlink size={16} style={{ marginRight: 8 }} />
            Assign to Project
          </MenuItem>
          <MenuItem
            onClick={() => handleRemoveMember(selectedMemberId)}
            sx={{ color: "error.main" }}
          >
            <Trash2 size={16} style={{ marginRight: 8 }} />
            Remove Member
          </MenuItem>
        </Menu>

        {/* Add Member Dialog */}
        <Dialog
          open={openAddDialog}
          onClose={handleAddDialogClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Add New Team Member</DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Box
              component="form"
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
            >
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={newMember.name}
                onChange={handleInputChange}
                required
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={newMember.email}
                onChange={handleInputChange}
                required
              />
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={newMember.phone}
                onChange={handleInputChange}
              />
              <FormControl fullWidth>
                <InputLabel id="role-select-label">Role</InputLabel>
                <Select
                  labelId="role-select-label"
                  id="role-select"
                  name="role"
                  value={newMember.role}
                  label="Role"
                  onChange={handleInputChange}
                >
                  <MenuItem value="Project Manager">Project Manager</MenuItem>
                  <MenuItem value="Frontend Developer">
                    Frontend Developer
                  </MenuItem>
                  <MenuItem value="Backend Developer">
                    Backend Developer
                  </MenuItem>
                  <MenuItem value="UI/UX Designer">UI/UX Designer</MenuItem>
                  <MenuItem value="QA Engineer">QA Engineer</MenuItem>
                  <MenuItem value="Team Member">Team Member</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAddDialogClose} sx={{ color: "black" }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleAddMember}
              sx={{
                background: "black",
                "&:hover": {
                  backgroundColor: "#333333",
                },
              }}
            >
              Add Member
            </Button>
          </DialogActions>
        </Dialog>

        {/* View Member Dialog */}
        <Dialog
          open={openViewDialog}
          onClose={handleViewDialogClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Team Member Profile</DialogTitle>
          <DialogContent>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 3,
                mt: 2,
              }}
            >
              <Avatar
                src={editMember.avatar}
                alt={editMember.name}
                sx={{ width: 100, height: 100, mb: 2 }}
              />
              <Typography variant="h5">{editMember.name}</Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {editMember.role}
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body1" fontWeight="medium">
                  Contact Information
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Mail style={{ marginRight: 8, color: "rgba(0,0,0,0.54)" }} />
                  <Typography variant="body2">{editMember.email}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <PhoneCall
                    style={{ marginRight: 8, color: "rgba(0,0,0,0.54)" }}
                  />
                  <Typography variant="body2">{editMember.phone}</Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="body1" fontWeight="medium">
                  Assigned Projects
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {editMember.projects && editMember.projects.length > 0 ? (
                    editMember.projects.map((project) => (
                      <Chip
                        key={project.id}
                        label={project.name}
                        variant="outlined"
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No projects assigned
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleViewDialogClose} sx={{ color: "black" }}>
              Close
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                handleViewDialogClose();
                handleEditMember(editMember.id);
              }}
              sx={{
                color:"white",
                backgroundColor: "black",
                "&:hover": {
                  backgroundColor: "#333333",
                },
              }}
            >
              Edit
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Member Dialog */}
        <Dialog
          open={openEditDialog}
          onClose={handleEditDialogClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Edit Team Member</DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Box
              component="form"
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
            >
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={editMember.name}
                onChange={handleEditInputChange}
                required
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={editMember.email}
                onChange={handleEditInputChange}
                required
              />
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={editMember.phone}
                onChange={handleEditInputChange}
              />
              <FormControl fullWidth>
                <InputLabel id="edit-role-select-label">Role</InputLabel>
                <Select
                  labelId="edit-role-select-label"
                  id="edit-role-select"
                  name="role"
                  value={editMember.role}
                  label="Role"
                  onChange={handleEditInputChange}
                >
                  <MenuItem value="Project Manager">Project Manager</MenuItem>
                  <MenuItem value="Frontend Developer">
                    Frontend Developer
                  </MenuItem>
                  <MenuItem value="Backend Developer">
                    Backend Developer
                  </MenuItem>
                  <MenuItem value="UI/UX Designer">UI/UX Designer</MenuItem>
                  <MenuItem value="QA Engineer">QA Engineer</MenuItem>
                  <MenuItem value="Team Member">Team Member</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditDialogClose} sx={{ color: "black" }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveEditMember}
              sx={{
                background: "black",
                "&:hover": {
                  backgroundColor: "#333333",
                },
              }}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>

        {/* Assign Project Dialog */}
        <Dialog
          open={openAssignDialog}
          onClose={handleAssignDialogClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Assign Projects to {editMember.name}</DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <FormControl fullWidth sx={{ mt: 1 }}>
              <InputLabel id="assign-projects-label">Projects</InputLabel>
              <Select
                labelId="assign-projects-label"
                id="assign-projects"
                multiple
                value={selectedProjects}
                onChange={handleProjectSelectionChange}
                input={<OutlinedInput label="Projects" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => {
                      const project = projects.find(
                        (p) => p.id.toString() === value.toString(),
                      );
                      return (
                        <Chip
                          key={value}
                          label={project ? project.name : value}
                        />
                      );
                    })}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id.toString()}>
                    <Checkbox
                      checked={
                        selectedProjects.indexOf(project.id.toString()) > -1
                      }
                    />
                    <ListItemText
                      primary={project.name}
                      secondary={project.description.substring(0, 40) + "..."}
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAssignDialogClose} sx={{ color: "black" }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleAssignProjectsToMember}
              sx={{
                background: "black",
                "&:hover": {
                  backgroundColor: "#333333",
                },
              }}
            >
              Assign Projects
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
};

export default Team;
