import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router-dom";

const pages = ["Products", "Services", "About"];

const Header = () => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleLogout = async () => {
    handleCloseUserMenu();
    await logout();

  };

  return (
    <AppBar
      position="sticky"
      color="primary"
      elevation={2}
      sx={{ px: 2, background: "linear-gradient(90deg, #1976d2, #1565c0)" }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Logo */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              fontWeight: "bold",
              letterSpacing: ".1rem",
              color: "inherit",
              textDecoration: "none",
              mr: 4,
            }}
          >
            RenDoc
          </Typography>

          {/* Mobile Nav */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="menu"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page}
                  onClick={() => {
                    handleCloseNavMenu();
                    navigate(`/${page.toLowerCase()}`);
                  }}
                >
                  <Typography sx={{ fontWeight: 500 }}>{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Desktop Nav */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, gap: 3 }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => navigate(`/${page.toLowerCase()}`)}
                sx={{
                  color: "white",
                  fontWeight: 500,
                  textTransform: "none",
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                }}
              >
                {page}
              </Button>
            ))}
          </Box>

          {/* User Menu */}
          {user && (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Account settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar sx={{ bgcolor: "secondary.main" }}>
                    {user.firstname?.[0]}
                    {user.lastname?.[0]}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorElUser}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    minWidth: 200, // ⬅️ wider dropdown
                    borderRadius: 2,
                    mt: 1,
                  },
                }}
              >
                <MenuItem
                  onClick={() => {
                    handleCloseUserMenu();
                    navigate("/profile");
                  }}
                >
                  <Typography sx={{ fontWeight: 500 }}>Profile</Typography>
                </MenuItem>

                {user.role === "ADMIN" && (
                  <MenuItem
                    onClick={() => {
                      handleCloseUserMenu();
                      navigate("/admin");
                    }}
                  >
                    <Typography sx={{ fontWeight: 500 }}>Admin Dashboard</Typography>
                  </MenuItem>
                )}

                <MenuItem onClick={handleLogout}>
                  <Typography sx={{ fontWeight: 500, color: "error.main" }}>
                    Logout
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
