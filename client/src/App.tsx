import { Button } from "@mui/material"
import LoginPage from "./pages/LoginPage"
import { Navigate, Route, Routes } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import ProtectedLayout from "./routes/ProtectedRoute"
import PublicLayout from "./routes/PublicRoutes"


function App() {

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
          {/* <Route path="profile" element={<Profile />} /> */}
          {/* you can add more protected routes here */}
        </Route>

        {/* Redirect root to /app */}
        <Route path="/" element={<Navigate to="/" replace />} />
      </Routes>
  )
}

export default App
