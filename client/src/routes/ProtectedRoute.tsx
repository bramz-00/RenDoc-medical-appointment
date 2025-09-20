import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

export default function ProtectedLayout() {
  const { token } = useAuthStore();

  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />; // render child routes
}