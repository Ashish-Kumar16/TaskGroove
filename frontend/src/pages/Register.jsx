// src/pages/Register.jsx
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
import { register } from "@/lib/api";
import { setCredentials } from "@/store/authSlice";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const validateInputs = () => {
    if (!name.trim()) {
      toast({
        title: "Validation Error",
        description: "Name is required.",
        variant: "destructive",
      });
      return false;
    }
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
    if (password.length < 6) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return false;
    }
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateInputs()) {
      return;
    }

    setLoading(true);

    try {
      const userData = { name, email, password };
      console.log("Sending register request with payload:", userData);
      const { token, user } = await register(userData);

      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));
      dispatch(setCredentials({ token, user }));

      toast({
        title: "Registration successful",
        description: "Your account has been created.",
      });

      console.log("Navigating to home page (/)");
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 100);
    } catch (error) {
      console.error("Register error:", {
        message: error.message,
        status: error.status,
        response: error.response,
      });
      const errorMessage =
        error.message === "Email already exists"
          ? "This email is already registered."
          : error.message || "Unable to create account.";
      toast({
        title: "Registration failed",
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
                Create an account
              </Typography>
            }
            subheader={
              <Typography variant="body2">
                Enter your information to create an account
              </Typography>
            }
          />
          <Box component="form" onSubmit={handleRegister} sx={{ mt: 1 }}>
            <CardContent
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                id="name"
                label="Full Name"
                placeholder="John Doe"
                required
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
              <TextField
                id="email"
                label="Email"
                type="email"
                placeholder="name@example.com"
                required
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={email && !/\S+@\S+\.\S+/.test(email)}
                helperText={
                  email && !/\S+@\S+\.\S+/.test(email)
                    ? "Please enter a valid email"
                    : ""
                }
                autoComplete="email"
              />
              <TextField
                id="password"
                label="Password"
                type="password"
                required
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={password && password.length < 6}
                helperText={
                  password && password.length < 6
                    ? "Password must be at least 6 characters"
                    : ""
                }
                autoComplete="new-password"
              />
              <TextField
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                required
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={confirmPassword && confirmPassword !== password}
                helperText={
                  confirmPassword && confirmPassword !== password
                    ? "Passwords do not match"
                    : ""
                }
                autoComplete="new-password"
              />
            </CardContent>
            <CardActions sx={{ flexDirection: "column", gap: 2, p: 2 }}>
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
                {loading ? "Creating account..." : "Create account"}
              </Button>
              <Typography variant="body2" align="center">
                Already have an account?{" "}
                <Link component={RouterLink} to="/login">
                  Sign in
                </Link>
              </Typography>
            </CardActions>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default Register;
