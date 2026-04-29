import UserLayout from "@/layouts/UserLayout";
import { useAuthStore } from "@/stores/authStore";
import { appointmentService } from "@/services/appointmentService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  IconButton,
  Button,
  Grid,
  Divider,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EventIcon from "@mui/icons-material/Event";
import { format } from "date-fns";

export default function MyAppointments() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: appointments, isLoading } = useQuery({
    queryKey: ["appointments", user?.id],
    queryFn: () => appointmentService.getAppointmentsByPatient(user!.id),
    enabled: !!user,
  });

  const cancelMutation = useMutation({
    mutationFn: (id: number) => appointmentService.cancelAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments", user?.id] });
      alert("Appointment cancelled.");
    },
  });

  return (
    <UserLayout>
      <Box sx={{ p: { xs: 2, md: 5 }, maxWidth: 1000, mx: "auto" }}>
        <Typography variant="h3" fontWeight="800" mb={4}>My Appointments</Typography>

        {isLoading ? <Typography>Loading sessions...</Typography> : (
          <Stack spacing={3}>
            {appointments?.length === 0 && (
              <Box textAlign="center" py={10} bgcolor="rgba(0,0,0,0.01)" borderRadius={4}>
                <Typography color="text.secondary">You don't have any appointments yet.</Typography>
              </Box>
            )}
            {appointments?.map((apt: any) => (
              <Card key={apt.id} sx={{ borderRadius: 4, border: "1px solid #eee", transition: "0.2s", "&:hover": { boxShadow: 3 } }}>
                <CardContent sx={{ p: 4 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12, md: 8 }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ p: 1.5, bgcolor: "primary.light", color: "primary.main", borderRadius: 3 }}>
                          <EventIcon fontSize="large" />
                        </Box>
                        <Box>
                          <Typography variant="h6" fontWeight="bold">
                            Consultation with Dr. {apt.doctor.user.lastname}
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            {format(new Date(apt.appointmentDate), "PPPP 'at' p")}
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: { md: "right" } }}>
                      <Stack direction="row" spacing={2} justifyContent={{ xs: "flex-start", md: "flex-end" }} alignItems="center">
                        <Chip 
                          label={apt.status} 
                          color={apt.status === "CONFIRMED" ? "success" : apt.status === "PENDING" ? "warning" : "default"}
                          sx={{ fontWeight: "bold" }}
                        />
                        {apt.status !== "CANCELLED" && (
                          <Button 
                            color="error" 
                            variant="text" 
                            startIcon={<DeleteOutlineIcon />}
                            onClick={() => {
                                if(window.confirm("Cancel this appointment?")) cancelMutation.mutate(apt.id);
                            }}
                          >
                            Cancel
                          </Button>
                        )}
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Box>
    </UserLayout>
  );
}
