// src/pages/Index.jsx
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Typography,
  Grid,
  Button,
  Paper,
  Divider,
  CardMedia,
} from "@mui/material";

const Index = () => {
  const navigate = useNavigate();
  const authToken = localStorage.getItem("authToken"); // Check if user is logged in

  useEffect(() => {
    console.log("Index: Rendered, authToken exists?", !!authToken);
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #F1F5F9, #E2E8F0)",
      }}
    >
      {/* Header */}
      <AppBar position="static" color="default" elevation={1}>
        <Container>
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                component="svg"
                viewBox="0 0 24 24"
                sx={{ width: 32, height: 32, color: "black" }}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </Box>
              <Typography
                variant="h6"
                sx={{ ml: 1, fontWeight: "bold", color: "black" }}
              >
                Task Groove
              </Typography>
            </Box>
            <Box>
              {!authToken ? (
                <>
                  <Button
                    component={Link}
                    to="/login"
                    variant="outlined"
                    sx={{
                      borderColor: "black",
                      color: "black",
                      textTransform: "none",
                    }}
                  >
                    Log In
                  </Button>
                  <Button
                    component={Link}
                    to="/register"
                    variant="contained"
                    sx={{
                      bgcolor: "black",
                      color: "white",
                      ml: 2,
                      textTransform: "none",
                      "&:hover": { bgcolor: "grey.800" },
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              ) : (
                <Button
                  component={Link}
                  to="/dashboard"
                  variant="contained"
                  sx={{
                    bgcolor: "black",
                    color: "white",
                    textTransform: "none",
                    "&:hover": { bgcolor: "grey.800" },
                  }}
                >
                  Go to Dashboard
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography
                variant="h2"
                component="h1"
                sx={{ fontWeight: "bold" }}
              >
                Manage projects with ease and efficiency
              </Typography>
              <Typography variant="h6" color="textSecondary">
                Task Groove helps teams organize, track, and manage their work
                in a visual, collaborative, and flexible way.
              </Typography>
              <Box sx={{ display: "flex", gap: 2, pt: 2 }}>
                <Button
                  component={Link}
                  to={authToken ? "/dashboard" : "/register"}
                  variant="contained"
                  sx={{
                    bgcolor: "black",
                    color: "white",
                    px: 4,
                    textTransform: "none",
                    "&:hover": { bgcolor: "grey.800" },
                  }}
                >
                  {authToken ? "Go to Dashboard" : "Get Started"}
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: "black",
                    color: "black",
                    px: 4,
                    textTransform: "none",
                  }}
                >
                  Learn More
                </Button>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <CardMedia
              component="img"
              image="https://source.unsplash.com/cckf4TsHAuw"
              alt="Project Management"
              sx={{ width: "100%", borderRadius: 2, boxShadow: 3 }}
            />
          </Grid>
        </Grid>
      </Container>

      {/* Feature Section */}
      <Box sx={{ backgroundColor: "white", py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            align="center"
            sx={{ fontWeight: "bold", mb: 6 }}
          >
            Powerful Features
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                title: "Task Management",
                desc: "Create, assign, and track tasks with ease. Add descriptions, due dates, attachments, and more.",
                iconBg: "#DBEAFE",
                iconColor: "black",
              },
              {
                title: "Project Timelines",
                desc: "Keep track of deadlines, milestones, and project schedules with visual timeline tools.",
                iconBg: "#F3E8FF",
                iconColor: "black",
              },
              {
                title: "Team Collaboration",
                desc: "Collaborate with your team in real-time. Share updates, files, and communicate effectively.",
                iconBg: "#DCFCE7",
                iconColor: "black",
              },
            ].map((feature, idx) => (
              <Grid item xs={12} md={4} key={idx}>
                <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 1 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: feature.iconBg,
                      borderRadius: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                    }}
                  >
                    <Box
                      component="svg"
                      viewBox="0 0 24 24"
                      sx={{ width: 24, height: 24, color: feature.iconColor }}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </Box>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "semibold", mb: 1 }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {feature.desc}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ backgroundColor: "#1E293B", color: "white", py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                Task Groove
              </Typography>
              <Typography variant="body2" color="grey.300">
                Modern project management solution for teams of all sizes.
              </Typography>
            </Grid>
            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Integrations", "Changelog"],
              },
              {
                title: "Resources",
                links: ["Documentation", "Guides", "Support", "API"],
              },
              {
                title: "Company",
                links: ["About", "Blog", "Careers", "Contact"],
              },
            ].map((section, idx) => (
              <Grid item xs={12} md={3} key={idx}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "medium", mb: 2 }}
                >
                  {section.title}
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {section.links.map((link) => (
                    <Typography
                      key={link}
                      component="a"
                      href="#"
                      variant="body2"
                      sx={{
                        color: "white",
                        textDecoration: "none",
                        "&:hover": { textDecoration: "underline" },
                      }}
                    >
                      {link}
                    </Typography>
                  ))}
                </Box>
              </Grid>
            ))}
          </Grid>
          <Divider sx={{ backgroundColor: "grey.700", my: 4 }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography variant="body2" color="grey.400">
              © {new Date().getFullYear()} Task Groove. All rights reserved.
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              {["Terms", "Privacy", "Cookies"].map((item) => (
                <Typography
                  key={item}
                  component="a"
                  href="#"
                  variant="body2"
                  sx={{
                    color: "grey.400",
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  {item}
                </Typography>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Index;
