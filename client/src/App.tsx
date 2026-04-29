
import LoginPage from "./pages/LoginPage"
import { Route, Routes } from "react-router-dom"
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
import ManageAvailability from "./pages/ManageAvailability"
import BookAppointment from "./pages/BookAppointment"
import MyAppointments from "./pages/MyAppointments"
import DoctorProfile from "./pages/DoctorProfile"

function App() {
  const { token, fetchUser } = useAuthStore();

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token, fetchUser]);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="auth" element={<PublicLayout />}>
        <Route path="login" element={<LoginPage />} />
      </Route>

      {/* Protected routes */}
      <Route path="/" element={<ProtectedLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="doctor-profile" element={<DoctorProfile />} />
        <Route path="availability" element={<ManageAvailability />} />
        <Route path="book" element={<BookAppointment />} />
        <Route path="appointments" element={<MyAppointments />} />

        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
        </Route>
      </Route>

      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
