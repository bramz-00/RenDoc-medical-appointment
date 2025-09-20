// pages/NotFoundPage.tsx
import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import UserLayout from "@/layouts/UserLayout";

export default function NotFoundPage() {
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
      <Typography variant="h2" fontWeight="bold" color="primary" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" gutterBottom>
        Oops! Page not found.
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        The page you’re looking for doesn’t exist or has been moved.
      </Typography>
      <Box>
        <Button
          variant="contained"
          sx={{ borderRadius: 2, px: 4, py: 1 }}
          onClick={() => navigate("/")}
        >
          Back to Home
        </Button>
      </Box>
    </Container>   
    </UserLayout>
  
  );
}
