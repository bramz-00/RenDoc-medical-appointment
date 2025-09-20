import UserLayout from "@/layouts/UserLayout";
import { useAuthStore } from "@/stores/authStore";
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Avatar,
    Stack,
    Chip,
    Paper,
    LinearProgress,
    IconButton,
    Badge,
    Divider,
} from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleIcon from "@mui/icons-material/People";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import NotificationsIcon from "@mui/icons-material/Notifications";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import CancelIcon from "@mui/icons-material/Cancel";

export default function Dashboard() {
    const { user, logout } = useAuthStore();

    const handleLogout = async () => {
        if (window.confirm("Are you sure you want to logout?")) {
            await logout();
        }
    }

    const upcomingAppointments = [
        {
            id: 1,
            title: "Consultation with Dr. Sarah Smith",
            patient: "John Anderson",
            time: "Today, 10:00 AM",
            duration: "30 min",
            type: "In-person",
            status: "Confirmed",
            priority: "High",
        },
        {
            id: 2,
            title: "Follow-up Session",
            patient: "Emma Wilson",
            time: "Tomorrow, 2:00 PM",
            duration: "45 min",
            type: "Video Call",
            status: "Confirmed",
            priority: "Medium",
        },
        {
            id: 3,
            title: "Initial Assessment",
            patient: "Michael Brown",
            time: "Sept 23, 9:00 AM",
            duration: "60 min",
            type: "In-person",
            status: "Pending",
            priority: "Low",
        },
        {
            id: 4,
            title: "Group Therapy Session",
            patient: "Multiple Clients",
            time: "Sept 24, 3:00 PM",
            duration: "90 min",
            type: "In-person",
            status: "Confirmed",
            priority: "Medium",
        },
    ];

    const todaySchedule = [
        { time: "9:00 AM", title: "Team Standup", duration: "15 min" },
        { time: "10:00 AM", title: "Dr. Smith Consultation", duration: "30 min" },
        { time: "11:30 AM", title: "Break", duration: "30 min" },
        { time: "12:00 PM", title: "Emma Wilson Session", duration: "45 min" },
        { time: "2:00 PM", title: "Lunch Break", duration: "60 min" },
        { time: "3:00 PM", title: "Documentation", duration: "60 min" },
    ];

    const recentActivities = [
        { action: "New appointment booked", patient: "Alice Johnson", time: "2 hours ago" },
        { action: "Session completed", patient: "Robert Davis", time: "4 hours ago" },
        { action: "Appointment rescheduled", patient: "Lisa Parker", time: "Yesterday" },
    ];

    return (
        <UserLayout>
            <Box sx={{ p: 3, maxWidth: 1400, mx: "auto" }}>
                {/* Welcome Header */}
                <Box sx={{ mb: 4 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                        <Box>
                            <Typography variant="h4" fontWeight="bold" color="text.primary">
                                Good morning, {user?.firstname || 'Dr. Smith'}! 👋
                            </Typography>
                            <Typography variant="body1" color="text.secondary" mt={1}>
                                You have 3 appointments scheduled for today
                            </Typography>
                        </Box>
                        <Stack direction="row" spacing={1}>
                            <IconButton color="primary">
                                <Badge badgeContent={4} color="error">
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>
                            <Button 
                                variant="contained" 
                                startIcon={<CalendarTodayIcon />}
                                sx={{ px: 3, borderRadius: 2 }}
                            >
                                Book Appointment
                            </Button>
                        </Stack>
                    </Stack>
                </Box>

                {/* Stats Cards */}
                <Grid container spacing={3} mb={4}>
                    <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                        <Card sx={{ 
                            p: 3, 
                            borderRadius: 3,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <Box sx={{ position: 'relative', zIndex: 2 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Typography variant="h6" fontWeight="medium">
                                        Today's Appointments
                                    </Typography>
                                    <EventAvailableIcon sx={{ fontSize: 28 }} />
                                </Stack>
                                <Typography variant="h3" fontWeight="bold" mb={1}>
                                    {upcomingAppointments.filter(apt => apt.time.includes('Today')).length}
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                    2 confirmed, 1 pending
                                </Typography>
                            </Box>
                        </Card>
                    </Grid>
                    
                    <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                        <Card sx={{ 
                            p: 3, 
                            borderRadius: 3,
                            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                            color: 'white'
                        }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6" fontWeight="medium">
                                    This Week
                                </Typography>
                                <AccessTimeIcon sx={{ fontSize: 28 }} />
                            </Stack>
                            <Typography variant="h3" fontWeight="bold" mb={1}>
                                12
                            </Typography>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <TrendingUpIcon sx={{ fontSize: 16 }} />
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                    +15% from last week
                                </Typography>
                            </Stack>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                        <Card sx={{ 
                            p: 3, 
                            borderRadius: 3,
                            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                            color: 'white'
                        }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6" fontWeight="medium">
                                    Active Clients
                                </Typography>
                                <PeopleIcon sx={{ fontSize: 28 }} />
                            </Stack>
                            <Typography variant="h3" fontWeight="bold" mb={1}>
                                48
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                3 new this week
                            </Typography>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                        <Card sx={{ 
                            p: 3, 
                            borderRadius: 3,
                            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                            color: 'white'
                        }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6" fontWeight="medium">
                                    Completion Rate
                                </Typography>
                                <CheckCircleIcon sx={{ fontSize: 28 }} />
                            </Stack>
                            <Typography variant="h3" fontWeight="bold" mb={1}>
                                94%
                            </Typography>
                            <LinearProgress 
                                variant="determinate" 
                                value={94} 
                                sx={{ 
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    '& .MuiLinearProgress-bar': {
                                        backgroundColor: 'white'
                                    }
                                }} 
                            />
                        </Card>
                    </Grid>
                </Grid>

                <Grid container spacing={3}>
                    {/* Today's Schedule */}
                    <Grid size={{ xs: 12, lg: 4 }}>
                        <Card sx={{ borderRadius: 3, height: '100%' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                                    <ScheduleIcon color="primary" />
                                    <Typography variant="h6" fontWeight="bold">
                                        Today's Schedule
                                    </Typography>
                                </Stack>
                                <Stack spacing={2}>
                                    {todaySchedule.map((item, index) => (
                                        <Box key={index}>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Typography variant="body2" color="primary" fontWeight="medium" sx={{ minWidth: 70 }}>
                                                    {item.time}
                                                </Typography>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography variant="body1" fontWeight="medium">
                                                        {item.title}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {item.duration}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                            {index < todaySchedule.length - 1 && <Divider sx={{ my: 1.5 }} />}
                                        </Box>
                                    ))}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Upcoming Appointments */}
                    <Grid size={{ xs: 12, lg: 8 }}>
                        <Card sx={{ borderRadius: 3, height: '100%' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                                    <Typography variant="h6" fontWeight="bold">
                                        Upcoming Appointments
                                    </Typography>
                                    <Button variant="text" color="primary">
                                        View All
                                    </Button>
                                </Stack>
                                <Grid container spacing={2}>
                                    {upcomingAppointments.map((appointment) => (
                                        <Grid size={{ xs: 12, md: 6 }} key={appointment.id}>
                                            <Paper 
                                                sx={{ 
                                                    p: 2.5, 
                                                    borderRadius: 2,
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                    transition: 'all 0.2s ease',
                                                    '&:hover': {
                                                        boxShadow: 2,
                                                        borderColor: 'primary.main'
                                                    }
                                                }}
                                            >
                                                <Stack direction="row" justifyContent="space-between" alignItems="start" mb={2}>
                                                    <Box sx={{ flex: 1 }}>
                                                        <Typography variant="subtitle1" fontWeight="bold" mb={0.5}>
                                                            {appointment.title}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary" mb={1}>
                                                            {appointment.patient}
                                                        </Typography>
                                                    </Box>
                                                    <Chip
                                                        icon={appointment.status === "Confirmed" ? <CheckCircleIcon /> : 
                                                              appointment.status === "Pending" ? <PendingIcon /> : <CancelIcon />}
                                                        label={appointment.status}
                                                        color={
                                                            appointment.status === "Confirmed" ? "success" :
                                                            appointment.status === "Pending" ? "warning" : "error"
                                                        }
                                                        size="small"
                                                        sx={{ fontWeight: 'medium' }}
                                                    />
                                                </Stack>
                                                
                                                <Stack spacing={1}>
                                                    <Stack direction="row" alignItems="center" spacing={1}>
                                                        <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                        <Typography variant="body2">
                                                            {appointment.time} • {appointment.duration}
                                                        </Typography>
                                                    </Stack>
                                                    <Stack direction="row" alignItems="center" spacing={1}>
                                                        {appointment.type === "Video Call" ? 
                                                            <VideoCallIcon sx={{ fontSize: 16, color: 'text.secondary' }} /> :
                                                            <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                        }
                                                        <Typography variant="body2">
                                                            {appointment.type}
                                                        </Typography>
                                                    </Stack>
                                                </Stack>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Quick Actions */}
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" fontWeight="bold" mb={3}>
                        Quick Actions
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <Button 
                                fullWidth 
                                variant="outlined" 
                                size="large"
                                startIcon={<CalendarTodayIcon />}
                                sx={{ py: 1.5, borderRadius: 2 }}
                            >
                                New Appointment
                            </Button>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <Button 
                                fullWidth 
                                variant="outlined" 
                                size="large"
                                startIcon={<PeopleIcon />}
                                sx={{ py: 1.5, borderRadius: 2 }}
                            >
                                Manage Clients
                            </Button>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <Button 
                                fullWidth 
                                variant="outlined" 
                                size="large"
                                startIcon={<VideoCallIcon />}
                                sx={{ py: 1.5, borderRadius: 2 }}
                            >
                                Start Video Call
                            </Button>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <Button 
                                fullWidth 
                                variant="outlined" 
                                size="large"
                                startIcon={<TrendingUpIcon />}
                                sx={{ py: 1.5, borderRadius: 2 }}
                            >
                                View Reports
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </UserLayout>
    );
}