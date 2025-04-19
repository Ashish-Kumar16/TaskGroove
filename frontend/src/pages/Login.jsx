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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      localStorage.setItem("authToken", "mock-jwt-token");
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: "1",
          name: "Test User",
          email,
          avatar:
            "https://ui-avatars.com/api/?name=Test+User&background=random",
        }),
      );

      toast({
        title: "Login successful",
        description: "Welcome back!",
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
