import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import UserLayout from "@/layouts/UserLayout"
import { useForm } from "react-hook-form";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router-dom";

interface LoginFormInputs {
  email: string;
  password: string;
}
export default function LoginPage() {
  const { register, handleSubmit } = useForm<LoginFormInputs>();
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();
  const onSubmit = async (data: LoginFormInputs) => {
    try {
      await login(data);
      navigate('/')
      console.log("Login successful!");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };



  return (
    <UserLayout>
      <Container
        maxWidth="sm"
        sx={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",

        }}
      >
        <Card
          elevation={0}
          sx={{ width: "100%", borderRadius: 3, p: 2, backdropFilter: "blur(8px)" }}
        >
          <CardContent>
            <Typography
              variant="h5"
              component="h1"
              textAlign="center"
              gutterBottom
              fontWeight="bold"
            >
              Welcome Back
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              mb={3}
            >
              Please sign in to continue
            </Typography>

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <TextField
                label="Email Address"
                fullWidth
                {...register("email", { required: true })}
                margin="normal"
                variant="outlined"
                required
              />

              <TextField
                label="Password"
                {...register("password", { required: true })}
                type={showPassword ? "text" : "password"}
                fullWidth
                margin="normal"
                variant="outlined"
                required
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
                sx={{ mt: 3, py: 1.3, borderRadius: 2, fontWeight: "bold" }}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </Box>

          </CardContent>
        </Card>
      </Container>
    </UserLayout>

  );
}
