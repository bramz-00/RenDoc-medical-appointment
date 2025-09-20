import { Button } from "@mui/material"
import LoginPage from "./pages/LoginPage"
import { Navigate, Route, Routes } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import ProtectedLayout from "./routes/ProtectedRoute"
import PublicLayout from "./routes/PublicRoutes"
import Profile from "./pages/Profile"
import { useAuthStore } from "./stores/authStore"
import { useEffect } from "react"
import NotFoundPage from "./pages/NotFoundPage"
import UnauthorizedPage from "./pages/UnauthorizedPage"
import AdminLayout from "./routes/AdminLayout"
import AdminDashboard from "./pages/AdminDashboard"


function App() {

  const { token, fetchUser } = useAuthStore();

  useEffect(() => {
    if (token) {
      fetchUser(); // restore user + isAdmin
    }
  }, [token, fetchUser]);
  return (


    <Routes>
      {/* Public routes */}
      <Route path="auth" element={<PublicLayout />}>
        <Route path="login" element={<LoginPage />} />
        {/* <Route path="register" element={<RegisterPage />} /> */}
      </Route>

      {/* Protected routes */}
      <Route path="/" element={<ProtectedLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
          <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          {/* <Route path="users" element={<UserManagement />} /> */}
          {/* <Route path="settings" element={<AdminSettings />} /> */}
        </Route> 
      </Route>

      {/* Redirect root to /app */}
      <Route path="/" element={<Navigate to="/" replace />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
