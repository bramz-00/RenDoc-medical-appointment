import UserLayout from "@/layouts/UserLayout";
import { useAuthStore } from "@/stores/authStore";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Typography,
  TextField,
  Stack,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { useForm } from "react-hook-form";
import type { UpdateProfileData } from "@/services/userService";

export default function Profile() {
  const { user: authUser, logout } = useAuthStore();
  const { user: profileUser, updateProfile, isUpdating } = useUser(authUser?.id);
  
  const [activeTab, setActiveTab] = useState(0); // 0 for Info, 1 for Security

  // Sync profile data
  const user = profileUser || authUser;

  const infoForm = useForm<UpdateProfileData>({
    defaultValues: {
      firstName: user?.firstname || "",
      lastName: user?.lastname || "",
      email: user?.email || "",
    }
  });

  // Sync form when user data arrives/changes (fixes empty form on refresh)
  useEffect(() => {
    if (user) {
      infoForm.reset({
        firstName: user.firstname,
        lastName: user.lastname,
        email: user.email,
      });
    }
  }, [user, infoForm]);

  const securityForm = useForm<UpdateProfileData>();

  const onUpdateInfo = (data: UpdateProfileData) => {
    updateProfile(data, {
      onSuccess: () => alert("Information updated successfully!")
    });
  };

  const onUpdatePassword = (data: UpdateProfileData) => {
    if (!data.password) return;
    updateProfile({ ...data }, {
      onSuccess: () => {
        alert("Password updated successfully!");
        securityForm.reset();
      }
    });
  };

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      await logout();
    }
  };

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography variant="h6" color="text.secondary">Loading profile...</Typography>
      </Box>
    );
  }

  return (
    <UserLayout>
      <Box sx={{ p: 4, maxWidth: 900, mx: "auto" }}>
        <Typography variant="h4" fontWeight="bold" mb={4}>Account Settings</Typography>
        
        <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
          {/* Sidebar Navigation */}
          <Box sx={{ width: { xs: "100%", md: 240 } }}>
            <Card sx={{ borderRadius: 2, border: "1px solid #e0e0e0", boxShadow: "none" }}>
              <Stack>
                <Button 
                  onClick={() => setActiveTab(0)}
                  sx={{ 
                    justifyContent: "flex-start", p: 2,
                    bgcolor: activeTab === 0 ? "rgba(0, 0, 0, 0.04)" : "transparent",
                    color: activeTab === 0 ? "primary.main" : "text.primary"
                  }}
                >
                  General Information
                </Button>
                <Divider />
                <Button 
                   onClick={() => setActiveTab(1)}
                   sx={{ 
                     justifyContent: "flex-start", p: 2,
                     bgcolor: activeTab === 1 ? "rgba(0, 0, 0, 0.04)" : "transparent",
                     color: activeTab === 1 ? "primary.main" : "text.primary"
                   }}
                >
                  Security & Password
                </Button>
                <Divider />
                <Button color="error" onClick={handleLogout} sx={{ justifyContent: "flex-start", p: 2 }}>
                  Logout
                </Button>
              </Stack>
            </Card>
          </Box>

          {/* Main Content Area */}
          <Box flex={1}>
            {activeTab === 0 && (
              <Card sx={{ borderRadius: 2, border: "1px solid #e0e0e0", boxShadow: "none" }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" mb={1}>Profile Information</Typography>
                  <Typography variant="body2" color="text.secondary" mb={4}>
                    Update your basic account information and email address.
                  </Typography>

                  <form onSubmit={infoForm.handleSubmit(onUpdateInfo)}>
                    <Stack spacing={3}>
                      <Stack direction="row" spacing={2}>
                        <TextField
                          label="First Name"
                          fullWidth
                          {...infoForm.register("firstName", { required: "Required" })}
                        />
                        <TextField
                          label="Last Name"
                          fullWidth
                          {...infoForm.register("lastName", { required: "Required" })}
                        />
                      </Stack>
                      <TextField
                        label="Email Address"
                        fullWidth
                        {...infoForm.register("email", { required: "Required" })}
                      />
                      <Box>
                        <Button variant="contained" type="submit" disabled={isUpdating}>
                          {isUpdating ? "Saving..." : "Save Changes"}
                        </Button>
                      </Box>
                    </Stack>
                  </form>
                </CardContent>
              </Card>
            )}

            {activeTab === 1 && (
              <Card sx={{ borderRadius: 2, border: "1px solid #e0e0e0", boxShadow: "none" }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" mb={1}>Security Settings</Typography>
                  <Typography variant="body2" color="text.secondary" mb={4}>
                    Change your account password to stay secure.
                  </Typography>

                  <form onSubmit={securityForm.handleSubmit(onUpdatePassword)}>
                    <Stack spacing={3}>
                      <TextField
                        label="New Password"
                        type="password"
                        fullWidth
                        {...securityForm.register("password", { 
                          required: "Required",
                          minLength: { value: 4, message: "Min 4 characters" }
                        })}
                        error={!!securityForm.formState.errors.password}
                        helperText={securityForm.formState.errors.password?.message}
                      />
                      <Box>
                        <Button variant="contained" color="primary" type="submit" disabled={isUpdating}>
                          {isUpdating ? "Updating..." : "Update Password"}
                        </Button>
                      </Box>
                    </Stack>
                  </form>
                </CardContent>
              </Card>
            )}
          </Box>
        </Stack>
      </Box>
    </UserLayout>
  );
}
