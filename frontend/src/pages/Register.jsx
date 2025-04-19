import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
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

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    setTimeout(() => {
      localStorage.setItem("authToken", "mock-jwt-token");
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: "1",
          name,
          email,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            name,
          )}&background=random`,
        }),
      );

      toast({
        title: "Registration successful",
        description: "Your account has been created.",
      });

      setLoading(false);
      navigate("/dashboard");
    }, 1000);
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
              />
              <TextField
                id="password"
                label="Password"
                type="password"
                required
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <TextField
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                required
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
