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
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import UserLayout from "@/layouts/UserLayout"
import api from "@/api/client";
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    api.post('/auth/login',form).then(res=>{
      console.log(res.data)
      localStorage.setItem("token", res.data.data.token);
    }).catch(err=>{
      console.error("Login error:", err);
    })
    
    console.log("Login submitted:", form);
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

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                label="Email Address"
                name="email"
                fullWidth
                margin="normal"
                variant="outlined"
                value={form.email}
                onChange={handleChange}
                required
              />

              <TextField
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                fullWidth
                margin="normal"
                variant="outlined"
                value={form.password}
                onChange={handleChange}
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
                Login
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </UserLayout>

  );
}
