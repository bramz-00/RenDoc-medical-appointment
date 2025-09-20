import UserLayout from "@/layouts/UserLayout";
import { useAuthStore } from "@/stores/authStore";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import { useEffect } from "react";

export default function Profile() {
  const { user, fetchUser, logout } = useAuthStore();

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      await logout();
    }
  };



  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography variant="h6" color="text.secondary">
          Loading profile...
        </Typography>
      </Box>
    );
  }

  return (
    <UserLayout>
     <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
      <Card
      
        sx={{
          width: 600,
          borderRadius: 3,
          border: "1px solid #e0e0e0",
          boxShadow: "none",
        }}
      >
        <CardContent>
          {/* Profile Header */}
          <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
            <Avatar
              sx={{
                bgcolor: deepPurple[500],
                width: 100,
                height: 100,
                fontSize: 36,
                mb: 2,
              }}
            >
              {user.firstname?.[0]}
              {user.lastname?.[0]}
            </Avatar>
            <Typography variant="h5" fontWeight="bold">
              {user.firstname} {user.lastname}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                mt: 1,
                px: 2,
                py: 0.5,
                borderRadius: 1,
                bgcolor: "primary.main",
                color: "white",
              }}
            >
              {user.role}
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Profile Details */}
          <Box display="flex" flexDirection="column" gap={2}>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="subtitle2" color="text.secondary">
                First Name
              </Typography>
              <Typography variant="body1">{user.firstname}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="subtitle2" color="text.secondary">
                Last Name
              </Typography>
              <Typography variant="body1">{user.lastname}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="subtitle2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1">{user.email}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="subtitle2" color="text.secondary">
                Role
              </Typography>
              <Typography variant="body1">{user.role}</Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Actions */}
          <Box display="flex" justifyContent="center" gap={2}>
            <Button variant="outlined" color="primary">
              Edit Profile
            </Button>
            <Button variant="outlined" color="error" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>     
    </UserLayout>
  
  );
}
