import React, { useState } from "react";
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Stack,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import UserLayout from "@/layouts/UserLayout"
import { useForm } from "react-hook-form";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router-dom";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

interface LoginFormInputs {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { register, handleSubmit } = useForm<LoginFormInputs>();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormInputs) => {
    setError(null);
    try {
      await login(data);
      navigate('/');
    } catch (err: any) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <UserLayout>
      <Box sx={{ 
        minHeight: "100vh", 
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 5
      }}>
        <Container maxWidth="xs">
          <Card
            elevation={10}
            sx={{ 
              borderRadius: 5, 
              overflow: "hidden",
              bgcolor: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)"
            }}
          >
            <CardContent sx={{ p: 5 }}>
              <Stack alignItems="center" spacing={2} mb={4}>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 3, 
                  bgcolor: "primary.main", 
                  color: "white",
                  boxShadow: "0 8px 16px rgba(25, 118, 210, 0.3)" 
                }}>
                  <LocalHospitalIcon fontSize="large" />
                </Box>
                <Box textAlign="center">
                  <Typography variant="h4" fontWeight="800" color="primary">
                    RenDoc
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your Health, Simplified
                  </Typography>
                </Box>
              </Stack>

              <Typography variant="h6" fontWeight="bold" mb={3} textAlign="center">
                Sign In
              </Typography>

              {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

              <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <Stack spacing={2.5}>
                  <TextField
                    label="Email Address"
                    fullWidth
                    {...register("email", { required: true })}
                    variant="outlined"
                    required
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                  />

                  <TextField
                    label="Password"
                    {...register("password", { required: true })}
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    variant="outlined"
                    required
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={loading}
                    sx={{ 
                        mt: 2, 
                        py: 1.8, 
                        borderRadius: 3, 
                        fontWeight: "bold",
                        fontSize: "1rem",
                        boxShadow: "0 10px 20px rgba(25, 118, 210, 0.2)"
                    }}
                  >
                    {loading ? "Verifying..." : "Login to Workspace"}
                  </Button>
                </Stack>
              </Box>

              <Typography variant="body2" color="text.secondary" textAlign="center" mt={4}>
                By logging in, you agree to our Terms of Service.
              </Typography>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </UserLayout>
  );
}
