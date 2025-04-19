import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardHeader,
  CardContent,
  Typography,
  TextField,
  FormGroup,
  FormControlLabel,
  Switch,
  CircularProgress,
} from "@mui/material";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layouts/DashboardLayout";

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: true,
    theme: "light",
  });

  const handleChange = (field) => (event) => {
    const value = field === "theme" ? event.target.value : event.target.checked;
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Mock save - replace with real API call
    setTimeout(() => {
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully.",
      });
      setLoading(false);
    }, 500);
  };

  return (
    <DashboardLayout>
      <Box p={4} maxWidth={600} mx="auto">
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          Manage your account preferences
        </Typography>

        <Box component="form" onSubmit={handleSave} mt={3}>
          <Card>
            <CardHeader
              title="Profile Settings"
              subheader="Update your profile information and preferences"
            />
            <CardContent>
              <Box mb={2}>
                <TextField
                  fullWidth
                  label="Display Name"
                  defaultValue="Test User"
                  variant="outlined"
                />
              </Box>
              <Box mb={2}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  defaultValue="test@example.com"
                  variant="outlined"
                />
              </Box>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications}
                      onChange={handleChange("notifications")}
                      sx={{
                        "& .MuiSwitch-track": {
                          backgroundColor: "#000",
                        },
                        "& .MuiSwitch-thumb": {
                          color: "#000",
                        },
                        // when checked, the track stays black
                        "&.Mui-checked .MuiSwitch-track": {
                          backgroundColor: "#000",
                        },
                      }}
                    />
                  }
                  label="Enable Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.emailUpdates}
                      onChange={handleChange("emailUpdates")}
                      sx={{
                        "& .MuiSwitch-track": {
                          backgroundColor: "#000",
                        },
                        "& .MuiSwitch-thumb": {
                          color: "#000",
                        },
                        "&.Mui-checked .MuiSwitch-track": {
                          backgroundColor: "#000",
                        },
                      }}
                    />
                  }
                  label="Email Updates"
                />
              </FormGroup>

              <Box mt={3}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={loading && <CircularProgress size={20} />}
                  sx={{
                    background: "black",
                    "&:hover": {
                      backgroundColor: "#333333",
                    },
                  }}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </DashboardLayout>
  );
};

export default Settings;
