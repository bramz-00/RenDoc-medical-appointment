import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

export default function AdminLayout() {
  const { isAdmin, user, loading } = useAuthStore();

  if (loading) {
    return <div>Loading...</div>; // Or spinner
  }

  if (!user || !isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <div className="admin-layout">
      <Outlet />
    </div>
  );
}
