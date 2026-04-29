import UserLayout from "@/layouts/UserLayout";
import { useAuthStore } from "@/stores/authStore";
import { doctorService, type Doctor } from "@/services/doctorService";
import { availabilityService, type Availability } from "@/services/availabilityService";
import { appointmentService } from "@/services/appointmentService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box, Button, Card, CardContent, Typography, Stack, Grid, Divider,
  Avatar, CircularProgress, Paper, Fade, Chip, Alert,
} from "@mui/material";
import { useState, useMemo } from "react";
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  isSameDay, isToday, isBefore, startOfDay,
  addMonths, subMonths, getDay,
} from "date-fns";
import VerifiedIcon from "@mui/icons-material/Verified";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

const DAY_LABELS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

export default function BookAppointment() {
  const { user } = useAuthStore();
  const qc = useQueryClient();
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Availability | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  // ── Queries ──
  const { data: doctors, isLoading: loadingDoctors } = useQuery({
    queryKey: ["doctors"],
    queryFn: doctorService.getAllDoctors,
  });

  const { data: slots = [], isLoading: loadingSlots } = useQuery({
    queryKey: ["availability", "available", selectedDoctor?.id],
    queryFn: () => availabilityService.getAvailableSlots(selectedDoctor!.user.id),
    enabled: !!selectedDoctor,
  });

  // ── Group slots by date for quick lookup ──
  const slotsByDate = useMemo(() => {
    const map: Record<string, Availability[]> = {};
    slots.forEach(slot => {
      const key = format(new Date(slot.startTime), "yyyy-MM-dd");
      if (!map[key]) map[key] = [];
      map[key].push(slot);
    });
    return map;
  }, [slots]);

  // ── Days of the current calendar month ──
  const calendarDays = useMemo(() => {
    const start = startOfMonth(calendarMonth);
    const end = endOfMonth(calendarMonth);
    return eachDayOfInterval({ start, end });
  }, [calendarMonth]);

  const firstDayOffset = getDay(startOfMonth(calendarMonth));

  const slotsForSelectedDay = selectedDay
    ? slotsByDate[format(selectedDay, "yyyy-MM-dd")] || []
    : [];

  // ── Mutation ──
  const bookMutation = useMutation({
    mutationFn: (data: any) => appointmentService.createAppointment(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["availability", "available", selectedDoctor?.id] });
      qc.invalidateQueries({ queryKey: ["appointments"] });
      setSelectedSlot(null);
      setSelectedDay(null);
      alert("✅ Rendez-vous confirmé ! Consultez votre tableau de bord.");
    },
    onError: (err: any) => alert("Erreur lors de la réservation : " + err.message),
  });

  const handleBook = () => {
    if (!user || !selectedDoctor || !selectedSlot) return;
    bookMutation.mutate({
      patientId: user.id,
      doctorId: selectedDoctor.id,
      availabilityId: selectedSlot.id,
      notes: "Consultation standard",
    });
  };

  const handleSelectDoctor = (doc: Doctor) => {
    setSelectedDoctor(doc);
    setSelectedSlot(null);
    setSelectedDay(null);
    setCalendarMonth(new Date());
  };

  return (
    <UserLayout>
      <Box sx={{ p: { xs: 2, md: 5 }, maxWidth: 1300, mx: "auto" }}>

        {/* Page Title */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h3" fontWeight="900" sx={{ mb: 0.5, color: "text.primary" }}>
            Prendre un rendez-vous
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Choisissez un médecin, sélectionnez un jour sur le calendrier puis réservez votre créneau.
          </Typography>
        </Box>

        <Grid container spacing={4}>

          {/* ── LEFT: Doctors List ── */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>Spécialistes disponibles</Typography>
            {loadingDoctors ? (
              <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>
            ) : (
              <Stack spacing={1.5}>
                {doctors?.map((doc) => (
                  <Card
                    key={doc.id}
                    onClick={() => handleSelectDoctor(doc)}
                    sx={{
                      borderRadius: 3, cursor: "pointer",
                      border: "2px solid",
                      borderColor: selectedDoctor?.id === doc.id ? "primary.main" : "transparent",
                      bgcolor: selectedDoctor?.id === doc.id ? "primary.50" : "white",
                      boxShadow: selectedDoctor?.id === doc.id ? "0 0 0 3px rgba(25,118,210,0.1)" : "0 1px 8px rgba(0,0,0,0.06)",
                      transition: "all 0.2s",
                      "&:hover": { borderColor: "primary.main", transform: "translateX(4px)" }
                    }}
                  >
                    <CardContent sx={{ p: 2.5 }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ width: 52, height: 52, bgcolor: "primary.main", fontWeight: "bold" }}>
                          {doc.user.firstname[0]}{doc.user.lastname[0]}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <Typography variant="subtitle1" fontWeight="bold">Dr. {doc.user.firstname} {doc.user.lastname}</Typography>
                            <VerifiedIcon color="primary" sx={{ fontSize: 15 }} />
                          </Stack>
                          <Typography variant="caption" color="primary" fontWeight={600}>{doc.speciality.name.toUpperCase()}</Typography>
                        </Box>
                        {selectedDoctor?.id === doc.id && <Chip size="small" label="Sélectionné" color="primary" sx={{ fontSize: "0.65rem", height: 20 }} />}
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </Grid>

          {/* ── RIGHT: Calendar + Slots ── */}
          <Grid size={{ xs: 12, lg: 8 }}>
            {!selectedDoctor ? (
              <Paper sx={{ p: 6, textAlign: "center", borderRadius: 4, bgcolor: "rgba(0,0,0,0.01)", border: "2px dashed #e0e0e0" }}>
                <EventAvailableIcon sx={{ fontSize: 56, color: "text.disabled", mb: 2 }} />
                <Typography color="text.secondary" fontWeight={500}>Sélectionnez un médecin pour voir son calendrier</Typography>
              </Paper>
            ) : (
              <Fade in>
                <Card sx={{ borderRadius: 4, border: "1px solid #e0e0e0", boxShadow: "0 8px 40px rgba(0,0,0,0.06)" }}>
                  <CardContent sx={{ p: 4 }}>

                    {/* ── Calendar Header ── */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                      <Typography variant="h6" fontWeight="bold">
                        {format(calendarMonth, "MMMM yyyy")}
                      </Typography>
                      <Stack direction="row" spacing={0.5}>
                        <Button size="small" onClick={() => setCalendarMonth(m => subMonths(m, 1))} sx={{ minWidth: 36, p: 0.5, borderRadius: 2 }}><ChevronLeftIcon /></Button>
                        <Button size="small" onClick={() => setCalendarMonth(m => addMonths(m, 1))} sx={{ minWidth: 36, p: 0.5, borderRadius: 2 }}><ChevronRightIcon /></Button>
                      </Stack>
                    </Stack>

                    {loadingSlots ? (
                      <Box display="flex" justifyContent="center" py={8}><CircularProgress /></Box>
                    ) : (
                      <>
                        {/* ── Day Labels ── */}
                        <Grid container columns={7} sx={{ mb: 0.5 }}>
                          {DAY_LABELS.map(d => (
                            <Grid key={d} size={1}>
                              <Typography variant="caption" fontWeight="bold" color="text.secondary" display="block" textAlign="center">{d}</Typography>
                            </Grid>
                          ))}
                        </Grid>

                        {/* ── Calendar Grid ── */}
                        <Grid container columns={7}>
                          {/* Empty offset for first day */}
                          {Array.from({ length: firstDayOffset }).map((_, i) => <Grid key={`e-${i}`} size={1} />)}

                          {calendarDays.map((day) => {
                            const key = format(day, "yyyy-MM-dd");
                            const hasSlots = (slotsByDate[key]?.length || 0) > 0;
                            const isSelected = selectedDay ? isSameDay(day, selectedDay) : false;
                            const isPast = isBefore(day, startOfDay(new Date()));
                            const todayDay = isToday(day);

                            return (
                              <Grid key={key} size={1} sx={{ p: 0.3 }}>
                                <Box
                                  onClick={() => !isPast && hasSlots && setSelectedDay(day)}
                                  sx={{
                                    height: 44,
                                    borderRadius: 2,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: hasSlots && !isPast ? "pointer" : "default",
                                    position: "relative",
                                    border: "2px solid",
                                    borderColor: isSelected ? "primary.main" : todayDay ? "primary.light" : "transparent",
                                    bgcolor: isSelected ? "primary.main" : hasSlots && !isPast ? "rgba(25,118,210,0.06)" : "transparent",
                                    transition: "all 0.15s",
                                    "&:hover": hasSlots && !isPast ? { bgcolor: isSelected ? "primary.main" : "rgba(25,118,210,0.12)", transform: "scale(1.05)" } : {},
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    fontWeight={todayDay || isSelected ? "bold" : "normal"}
                                    color={isSelected ? "white" : isPast ? "text.disabled" : hasSlots ? "primary.main" : "text.primary"}
                                  >
                                    {format(day, "d")}
                                  </Typography>
                                  {hasSlots && !isPast && (
                                    <Box sx={{ width: 5, height: 5, borderRadius: "50%", bgcolor: isSelected ? "white" : "primary.main", mt: 0.2 }} />
                                  )}
                                </Box>
                              </Grid>
                            );
                          })}
                        </Grid>

                        {/* ── Legend ── */}
                        <Stack direction="row" spacing={2} mt={2} sx={{ borderTop: "1px solid #f0f0f0", pt: 2 }}>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "primary.main" }} />
                            <Typography variant="caption" color="text.secondary">Créneaux disponibles</Typography>
                          </Stack>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <Box sx={{ width: 16, height: 16, borderRadius: 1, bgcolor: "primary.main" }} />
                            <Typography variant="caption" color="text.secondary">Jour sélectionné</Typography>
                          </Stack>
                        </Stack>

                        {/* ── Slots for Selected Day ── */}
                        {selectedDay && (
                          <Fade in>
                            <Box sx={{ mt: 3, pt: 3, borderTop: "1px solid #f0f0f0" }}>
                              <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                                Créneaux du {format(selectedDay, "EEEE d MMMM yyyy")}
                              </Typography>
                              {slotsForSelectedDay.length === 0 ? (
                                <Alert severity="info">Aucun créneau disponible pour ce jour.</Alert>
                              ) : (
                                <Grid container spacing={1.5}>
                                  {slotsForSelectedDay
                                    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                                    .map((slot) => {
                                      const isSelected = selectedSlot?.id === slot.id;
                                      return (
                                        <Grid key={slot.id} size={{ xs: 6, sm: 4, md: 3 }}>
                                          <Button
                                            fullWidth
                                            variant={isSelected ? "contained" : "outlined"}
                                            onClick={() => setSelectedSlot(isSelected ? null : slot)}
                                            startIcon={<AccessTimeIcon />}
                                            sx={{
                                              borderRadius: 3, py: 1.5, textTransform: "none",
                                              fontWeight: "bold", borderWidth: 2,
                                              "&:hover": { borderWidth: 2 }
                                            }}
                                          >
                                            {format(new Date(slot.startTime), "HH:mm")}
                                            <Typography variant="caption" display="block" sx={{ opacity: 0.7, ml: 0.3 }}>
                                              → {format(new Date(slot.endTime), "HH:mm")}
                                            </Typography>
                                          </Button>
                                        </Grid>
                                      );
                                    })}
                                </Grid>
                              )}

                              {/* ── Confirmation ── */}
                              {selectedSlot && (
                                <Box sx={{ mt: 3 }}>
                                  <Divider sx={{ mb: 2.5 }} />
                                  <Alert severity="success" sx={{ mb: 2, borderRadius: 3 }}>
                                    Vous êtes sur le point de réserver le créneau{" "}
                                    <strong>{format(new Date(selectedSlot.startTime), "HH:mm")}</strong> –{" "}
                                    <strong>{format(new Date(selectedSlot.endTime), "HH:mm")}</strong>{" "}
                                    avec <strong>Dr. {selectedDoctor.user.lastname}</strong>.
                                  </Alert>
                                  <Button
                                    variant="contained"
                                    fullWidth
                                    size="large"
                                    onClick={handleBook}
                                    disabled={bookMutation.isPending}
                                    sx={{ py: 1.8, borderRadius: 3, fontWeight: "bold", fontSize: "1rem" }}
                                  >
                                    {bookMutation.isPending ? "Réservation en cours..." : "✅ Confirmer mon rendez-vous"}
                                  </Button>
                                </Box>
                              )}
                            </Box>
                          </Fade>
                        )}

                        {/* Message if no slots at all */}
                        {slots.length === 0 && !loadingSlots && (
                          <Alert severity="warning" sx={{ mt: 3, borderRadius: 3 }}>
                            Ce médecin n'a pas encore publié de créneaux disponibles.
                          </Alert>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </Fade>
            )}
          </Grid>
        </Grid>
      </Box>
    </UserLayout>
  );
}
