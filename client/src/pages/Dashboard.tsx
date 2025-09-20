import UserLayout from "@/layouts/UserLayout";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@mui/material";

export default function Dashboard() {
    const { user,logout } = useAuthStore();

    const handleLogout = async () => {
        if (window.confirm("Are you sure you want to logout?")) {
            await logout();
        }
    }


    return (
        <UserLayout>
            <h1>Dashboard</h1>
            {user ? <p>Welcome, {user.firstname} {user.lastname} {user.role}</p> : <p>Loading...</p>}
            <Button
                variant="outlined" color="error"
                onClick={handleLogout}>Logout</Button>
        </UserLayout>
    );

}