// pages/UnauthorizedPage.tsx
import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import UserLayout from "@/layouts/UserLayout";
import { useAuthStore } from "@/stores/authStore";

export default function UnauthorizedPage() {
    const navigate = useNavigate();

    return (
        <UserLayout>

            <Container
                maxWidth="sm"
                sx={{
                    minHeight: "80vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                }}
            >
                <Typography variant="h2" fontWeight="bold" color="error" gutterBottom>
                    403 
                </Typography>
                <Typography variant="h5" gutterBottom>
                    You don’t have permission to access this page.
                </Typography>
                <Typography variant="body1" color="text.secondary" mb={3}>
                    Please contact your administrator if you believe this is a mistake.
                </Typography>
                <Box>
                    <Button
                        variant="contained"
                        sx={{ borderRadius: 2, px: 4, py: 1 }}
                        onClick={() => navigate("/")}
                    >
                        Go Home
                    </Button>
                </Box>
            </Container>
        </UserLayout>

    );
}
