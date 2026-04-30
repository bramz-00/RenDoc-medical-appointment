import UserLayout from "@/layouts/UserLayout";
import { useAuthStore } from "@/stores/authStore";
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Stack,
    Chip,
    Paper,
    IconButton,
    Badge,
    Divider,
    CircularProgress,
} from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleIcon from "@mui/icons-material/People";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useState, useEffect } from "react";
import { dashboardService, type DashboardStats } from "@/services/dashboardService";
import { format, isToday } from "date-fns";

export default function Dashboard() {
    const { user, loading: authLoading } = useAuthStore();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await dashboardService.getStats();
                setStats(data);
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };
        if (user) {
            fetchStats();
        }
    }, [user]);

    if (authLoading || loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: 2 }}>
                <CircularProgress size={60} thickness={4} />
                <Typography variant="h6" color="primary">Loading your dashboard...</Typography>
            </Box>
        );
    }

    const appointments = stats?.upcomingAppointments || stats?.recentAppointments || [];
    
    const todaySchedule = appointments
        .filter(apt => isToday(new Date(apt.appointmentDate)))
        .map(apt => ({
            time: format(new Date(apt.appointmentDate), "hh:mm a"),
            title: user?.role === 'DOCTOR' ? `Patient: ${apt.patient.user.firstname} ${apt.patient.user.lastname}` : `Dr. ${apt.doctor.user.firstname} ${apt.doctor.user.lastname}`,
            duration: "30 min" // Default duration
        }));

    const getRoleStats = () => {
        if (user?.role === 'ADMIN') {
            return [
                { label: "Total Doctors", value: stats?.totalDoctors || 0, sub: "Registered doctors", icon: <PeopleIcon />, color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
                { label: "Total Patients", value: stats?.totalPatients || 0, sub: "Registered patients", icon: <PeopleIcon />, color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
                { label: "System Appointments", value: stats?.totalAppointments || 0, sub: "Total bookings", icon: <EventAvailableIcon />, color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
                { label: "Total Cabinets", value: stats?.totalCabinets || 0, sub: "Medical facilities", icon: <LocationOnIcon />, color: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" },
            ];
        } else if (user?.role === 'DOCTOR') {
            return [
                { label: "Today's Appointments", value: stats?.todayAppointments || 0, sub: `${stats?.pendingAppointments || 0} pending`, icon: <EventAvailableIcon />, color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
                { label: "This Week", value: stats?.thisWeekAppointments || 0, sub: "New bookings this week", icon: <AccessTimeIcon />, color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
                { label: "Active Clients", value: stats?.activeClients || 0, sub: "Unique patients seen", icon: <PeopleIcon />, color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
                { label: "Rate", value: `${Math.round(((stats?.confirmedAppointments || 0) / (stats?.totalAppointments || 1)) * 100)}%`, sub: "Confirmation rate", icon: <CheckCircleIcon />, color: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" },
            ];
        } else {
            return [
                { label: "Upcoming Appointments", value: stats?.upcomingCount || 0, sub: "Confirmed bookings", icon: <EventAvailableIcon />, color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
                { label: "Total Seen", value: stats?.totalAppointments || 0, sub: "All time appointments", icon: <AccessTimeIcon />, color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
                { label: "Active Doctors", value: stats?.totalDoctorsSeen || 0, sub: "Doctors you've visited", icon: <PeopleIcon />, color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
                { label: "Wait Time", value: "15m", sub: "Avg. wait time", icon: <AccessTimeIcon />, color: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" },
            ];
        }
    };

    const roleStats = getRoleStats();

    return (
        <UserLayout>
            <Box sx={{ p: 3, maxWidth: 1400, mx: "auto" }}>
                {/* Welcome Header */}
                <Box sx={{ mb: 4 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                        <Box>
                            <Typography variant="h4" fontWeight="bold" color="text.primary">
                                Good morning, {user?.firstname || 'User'}! 👋
                            </Typography>
                            <Typography variant="body1" color="text.secondary" mt={1}>
                                You have {stats?.todayAppointments || 0} appointments scheduled for today
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

                {/* Stats Cards (Static for now) */}
                <Grid container spacing={3} mb={4}>
                    {roleStats.map((stat, idx) => (
                        <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={idx}>
                            <Card sx={{ 
                                p: 3, 
                                borderRadius: 4,
                                background: stat.color,
                                color: 'white',
                                position: 'relative',
                                overflow: 'hidden',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                                transition: 'transform 0.3s ease',
                                '&:hover': { transform: 'translateY(-5px)' }
                            }}>
                                <Box sx={{ position: 'relative', zIndex: 2 }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                                        <Typography variant="h6" fontWeight="600" sx={{ opacity: 0.9 }}>
                                            {stat.label}
                                        </Typography>
                                        <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.2)' }}>
                                            {stat.icon}
                                        </Box>
                                    </Stack>
                                    <Typography variant="h3" fontWeight="bold" mb={1}>
                                        {stat.value}
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                        {stat.sub}
                                    </Typography>
                                </Box>
                                <Box sx={{
                                    position: 'absolute',
                                    right: -20,
                                    bottom: -20,
                                    opacity: 0.1,
                                    transform: 'rotate(-15deg)'
                                }}>
                                    {stat.icon && <stat.icon.type sx={{ fontSize: 120 }} />}
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Grid container spacing={3}>
                    {/* Today's Schedule */}
                    <Grid size={{ xs: 12, lg: 4 }}>
                        <Card sx={{ borderRadius: 3, height: '100%' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                                    <ScheduleIcon color="primary" />
                                    <Typography variant="h6" fontWeight="bold">Today's Schedule</Typography>
                                </Stack>
                                <Stack spacing={2}>
                                    {todaySchedule.map((item, index) => (
                                        <Box key={index}>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Typography variant="body2" color="primary" fontWeight="medium" sx={{ minWidth: 70 }}>{item.time}</Typography>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography variant="body1" fontWeight="medium">{item.title}</Typography>
                                                    <Typography variant="caption" color="text.secondary">{item.duration}</Typography>
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
                                <Typography variant="h6" fontWeight="bold" mb={3}>
                                    {user?.role === 'ADMIN' ? 'Recent Appointments' : 'Upcoming Appointments'}
                                </Typography>
                                <Grid container spacing={2}>
                                    {appointments.length > 0 ? appointments.map((appointment: any) => (
                                        <Grid size={{ xs: 12, md: 6 }} key={appointment.id}>
                                            <Paper sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none', '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' }, transition: 'all 0.2s' }}>
                                                <Stack direction="row" justifyContent="space-between" mb={1}>
                                                    <Typography variant="subtitle1" fontWeight="bold">
                                                        {user?.role === 'ADMIN' 
                                                            ? `Dr. ${appointment.doctor.user.lastname} → ${appointment.patient.user.firstname}`
                                                            : user?.role === 'DOCTOR' 
                                                                ? `Patient: ${appointment.patient.user.firstname} ${appointment.patient.user.lastname}` 
                                                                : `Dr. ${appointment.doctor.user.firstname} ${appointment.doctor.user.lastname}`
                                                        }
                                                    </Typography>
                                                    <Chip 
                                                        label={appointment.status} 
                                                        size="small" 
                                                        color={appointment.status === 'CONFIRMED' ? 'success' : appointment.status === 'PENDING' ? 'warning' : 'default'} 
                                                        sx={{ fontWeight: '600', borderRadius: 1 }}
                                                    />
                                                </Stack>
                                                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                                                    <LocationOnIcon sx={{ fontSize: 14 }} />
                                                    {appointment.doctor.cabinet?.name || "Online Consultation"}
                                                </Typography>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <AccessTimeIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                                                    <Typography variant="body2" fontWeight="500">
                                                        {format(new Date(appointment.appointmentDate), "MMM dd, yyyy - hh:mm a")}
                                                    </Typography>
                                                </Stack>
                                            </Paper>
                                        </Grid>
                                    )) : (
                                        <Grid size={{ xs: 12 }}>
                                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                                <CalendarTodayIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                                                <Typography color="text.secondary">No appointments found</Typography>
                                            </Box>
                                        </Grid>
                                    )}
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </UserLayout>
    );
}