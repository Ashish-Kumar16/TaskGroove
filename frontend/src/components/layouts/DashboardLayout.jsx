import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import {
  Box,
  Drawer,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Button,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import {
  LayoutDashboard,
  ListTodo,
  FolderKanban,
  Users,
  Settings,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Home,
} from "lucide-react";

const drawerWidth = 256;

const Root = styled("div")({
  display: "flex",
  minHeight: "100vh",
});

const StyledDrawer = styled(Drawer)(() => ({
  width: drawerWidth,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    boxSizing: "border-box",
    backgroundColor: "#fff",
    borderRight: "1px solid rgba(0, 0, 0, 0.12)",
  },
}));

const MainContent = styled("main")({
  flexGrow: 1,
  backgroundColor: "#F8F9FA",
  marginLeft: 0,
  "@media (max-width: 900px)": {
    marginLeft: 0,
  },
});

const DashboardLayout = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/login");
    handleCloseUserMenu();
  };

  const handleOpenUserMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  if (!user) return null;

  const navItems = [
    { path: "/dashboard", icon: <LayoutDashboard />, label: "Dashboard" },
    { path: "/tasks", icon: <ListTodo />, label: "Tasks" },
    { path: "/projects", icon: <FolderKanban />, label: "Projects" },
    { path: "/team", icon: <Users />, label: "Team" },
    { path: "/settings", icon: <Settings />, label: "Settings" },
  ];

  return (
    <Root>
      {/* Mobile Menu Toggle */}
      <Box
        sx={{
          display: { md: "none" },
          position: "fixed",
          top: 16,
          left: 16,
          zIndex: 1100,
        }}
      >
        <IconButton
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Hide sidebar" : "Show sidebar"}
          size="large"
          edge="start"
          sx={{ bgcolor: "background.paper" }}
        >
          {isMobileMenuOpen ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </Box>

      {/* Sidebar (Permanent Drawer) */}
      <StyledDrawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
        }}
      >
        <Box
          sx={{
            p: 2,
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <Home />
            <Typography variant="h6" fontWeight="bold">
              Task Groove
            </Typography>
          </Link>
        </Box>

        <List sx={{ px: 2, py: 3 }}>
          {navItems.map((item) => (
            <ListItem
              key={item.path}
              button
              component={Link}
              to={item.path}
              selected={isActive(item.path)}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                color: isActive(item.path) ? "primary.main" : "text.primary",
                bgcolor: isActive(item.path)
                  ? "primary.lighter"
                  : "transparent",
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>

        <Box sx={{ mt: "auto", p: 2, borderTop: 1, borderColor: "divider" }}>
          <Button
            onClick={handleOpenUserMenu}
            sx={{ width: "100%", justifyContent: "flex-start", gap: 2 }}
          >
            <Avatar src={user.avatar} alt={user.name}>
              {user.name.substring(0, 2).toUpperCase()}
            </Avatar>
            <Box sx={{ textAlign: "left" }}>
              <Typography variant="subtitle2">{user.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseUserMenu}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem
              onClick={() => {
                navigate("/profile");
                handleCloseUserMenu();
              }}
            >
              Profile
            </MenuItem>
            <MenuItem
              onClick={() => {
                navigate("/settings");
                handleCloseUserMenu();
              }}
            >
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
              <LogOut size={16} style={{ marginRight: 8 }} />
              Log out
            </MenuItem>
          </Menu>
        </Box>
      </StyledDrawer>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: drawerWidth },
        }}
      >
        <Box
          sx={{
            p: 2,
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <Home />
            <Typography variant="h6" fontWeight="bold">
              Task Groove
            </Typography>
          </Link>
        </Box>

        <List sx={{ px: 2, py: 3 }}>
          {navItems.map((item) => (
            <ListItem
              key={item.path}
              button
              component={Link}
              to={item.path}
              selected={isActive(item.path)}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                color: isActive(item.path) ? "primary.main" : "text.primary",
                bgcolor: isActive(item.path)
                  ? "primary.lighter"
                  : "transparent",
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
              onClick={() => setIsMobileMenuOpen(false)} // Close drawer on item click
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>

        <Box sx={{ mt: "auto", p: 2, borderTop: 1, borderColor: "divider" }}>
          <Button
            onClick={handleOpenUserMenu}
            sx={{ width: "100%", justifyContent: "flex-start", gap: 2 }}
          >
            <Avatar src={user.avatar} alt={user.name}>
              {user.name.substring(0, 2).toUpperCase()}
            </Avatar>
            <Box sx={{ textAlign: "left" }}>
              <Typography variant="subtitle2">{user.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseUserMenu}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem
              onClick={() => {
                navigate("/profile");
                handleCloseUserMenu();
              }}
            >
              Profile
            </MenuItem>
            <MenuItem
              onClick={() => {
                navigate("/settings");
                handleCloseUserMenu();
              }}
            >
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
              <LogOut size={16} style={{ marginRight: 8 }} />
              Log out
            </MenuItem>
          </Menu>
        </Box>
      </Drawer>

      {/* Main Content */}
      <MainContent>{children}</MainContent>
    </Root>
  );
};

export default DashboardLayout;