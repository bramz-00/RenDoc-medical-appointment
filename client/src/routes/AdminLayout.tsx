import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

export default function AdminLayout() {
  const { isAdmin, user, token, loading } = useAuthStore();

  if (loading || (token && !user)) {
    return <div>Loading...</div>; // Wait for whoami
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
