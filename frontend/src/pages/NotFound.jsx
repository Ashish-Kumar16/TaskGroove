import React, { useEffect } from "react";
import { useLocation, Link as RouterLink } from "react-router-dom";
import { Box, Button, Typography, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const NotFound = () => {
  const location = useLocation();
  const theme = useTheme();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: theme.palette.grey[100],
        p: 2,
      }}
    >
      <Paper elevation={3} sx={{ p: 4, textAlign: "center", maxWidth: 400 }}>
        <Typography variant="h1" component="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          Oops! Page not found
        </Typography>
        <Button
          variant="contained"
          component={RouterLink}
          to="/"
          sx={{ mt: 2 }}
        >
          Return to Home
        </Button>
      </Paper>
    </Box>
  );
};

export default NotFound;
