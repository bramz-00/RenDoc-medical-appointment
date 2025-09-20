import { useAuthStore } from "@/stores/authStore";
import { Button } from "@mui/material";
import { useEffect } from "react";

export default function Dashboard() {
  const { user, fetchUser,logout } = useAuthStore();

  const handleLogout = async ()=>{
    if(window.confirm("Are you sure you want to logout?")){
        await logout();
        }       
  }
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <div>
      <h1>Dashboard</h1>
      {user ? <p>Welcome, {user.firstname} {user.lastname} {user.role}</p> : <p>Loading...</p>}
        <Button 
        variant="outlined" color="error"
        onClick={handleLogout}>Logout</Button>
    </div>
  );

  }