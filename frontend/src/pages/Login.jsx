// src/pages/Login.jsx
import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Box,
  Container,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  TextField,
  Typography,
  Link,
  CircularProgress,
} from "@mui/material";
import { useToast } from "@/hooks/use-toast";
import { login } from "@/lib/api";
import { setCredentials } from "@/store/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const validateInputs = () => {
    if (!email.trim()) {
      toast({
        title: "Validation Error",
        description: "Email is required.",
        variant: "destructive",
      });
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return false;
    }
    if (!password.trim()) {
      toast({
        title: "Validation Error",
        description: "Password is required.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateInputs()) {
      return;
    }

    setLoading(true);

    try {
      const credentials = { email, password };
      console.log("Sending login request with payload:", credentials);
      const { token, user } = await login(credentials);

      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));
      dispatch(setCredentials({ token, user }));

      toast({
        title: "Login successful",
        description: "Welcome back!",
      });

      console.log("Navigating to home page (/)");
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 100);
    } catch (error) {
      console.error("Login error:", {
        message: error.message,
        status: error.status,
        response: error.response,
      });
      const errorMessage =
        error.message === "Invalid credentials"
          ? "Incorrect email or password."
          : error.message === "Please provide email and password"
          ? "Email and password are required."
          : error.message || "Unable to log in. Please try again.";
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "grey.50",
      }}
    >
      <Container maxWidth="sm">
        <Card>
          <CardHeader
            title={
              <Typography variant="h5" component="h1" fontWeight="bold">
                Login
              </Typography>
            }
            subheader={
              <Typography variant="body2">
                Enter your credentials to access your account
              </Typography>
            }
          />
          <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
            <CardContent
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                id="email"
                label="Email"
                type="email"
                placeholder="name@example.com"
                required
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!email && !/\S+@\S+\.\S+/.test(email)}
                helperText={
                  email && !/\S+@\S+\.\S+/.test(email)
                    ? "Please enter a valid email"
                    : ""
                }
                autoComplete="email"
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="subtitle2">Password</Typography>
                <Link
                  component={RouterLink}
                  to="/forgot-password"
                  variant="body2"
                >
                  Forgot password?
                </Link>
              </Box>
              <TextField
                id="password"
                label="Password"
                type="password"
                required
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </CardContent>
            <CardActions
              sx={{
                flexDirection: "column",
                gap: 2,
                p: 2,
              }}
            >
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
                sx={{
                  background: "black",
                  "&:hover": {
                    backgroundColor: "#333333",
                  },
                }}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
              <Typography variant="body2" align="center">
                Don't have an account?{" "}
                <Link component={RouterLink} to="/register">
                  Sign up
                </Link>
              </Typography>
            </CardActions>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;
