import UserLayout from "@/layouts/UserLayout";
import { useAuthStore } from "@/stores/authStore";
import { useAvailability } from "@/hooks/useAvailability";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
  TextField,
  IconButton,
  Grid,
  Chip,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import { format, isBefore } from "date-fns";

// ── Generate time slots every 30 min between 06:00 and 22:00 ──────────────────
function generateTimeOptions(): string[] {
  const slots: string[] = [];
  for (let h = 6; h <= 22; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
    if (h < 22) slots.push(`${String(h).padStart(2, "0")}:30`);
  }
  return slots;
}
const TIME_OPTIONS = generateTimeOptions();

export default function ManageAvailability() {
  const { user } = useAuthStore();
  const { availability, addAvailabilityAsync, deleteAvailability, isAdding } = useAvailability(user?.id);

  const [date, setDate] = useState("");
  const [startHour, setStartHour] = useState("");
  const [endHour, setEndHour] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !startHour || !endHour) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    const [startH, startM] = startHour.split(":").map(Number);
    const [endH, endM] = endHour.split(":").map(Number);
    const start = new Date(date);
    start.setHours(startH, startM, 0, 0);
    const end = new Date(date);
    end.setHours(endH, endM, 0, 0);

    if (start >= end) {
      alert("L'heure de fin doit être après l'heure de début.");
      return;
    }

    const intervals = [];
    let current = new Date(start);
    while (current < end) {
      const next = new Date(current.getTime() + 30 * 60000);
      if (next > end) break;
      intervals.push({ startTime: current.toISOString(), endTime: next.toISOString() });
      current = next;
    }

    if (intervals.length === 0) {
      alert("Plage trop courte pour créer un créneau de 30 minutes.");
      return;
    }

    setSubmitting(true);
    try {
      await Promise.all(intervals.map(slot => addAvailabilityAsync(slot)));
      setDate(""); setStartHour(""); setEndHour("");
      alert(`✅ ${intervals.length} créneau${intervals.length > 1 ? "x" : ""} de 30 min créé${intervals.length > 1 ? "s" : ""} !`);
    } catch {
      alert("Erreur lors de la création des créneaux. Réessayez.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <UserLayout>
      <Box sx={{ p: { xs: 2, md: 5 }, maxWidth: 1200, mx: "auto" }}>
        {/* Header Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h3" fontWeight="800" sx={{ mb: 1, background: "linear-gradient(45deg, #1976d2 30%, #4facfe 90%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Schedule Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Définissez votre planning — les créneaux sont automatiquement découpés en tranches de 30 minutes.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Add Slot Panel */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Card sx={{ borderRadius: 4, border: "1px solid #e0e0e0", boxShadow: "0 8px 32px rgba(0,0,0,0.05)", position: "sticky", top: 100 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight="bold" mb={3}>Ajouter des créneaux</Typography>
                <form onSubmit={onSubmit}>
                  <Stack spacing={3}>
                    {/* Date */}
                    <TextField
                      label="Date"
                      type="date"
                      fullWidth
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      slotProps={{ inputLabel: { shrink: true } }}
                      inputProps={{ min: new Date().toISOString().split("T")[0] }}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />

                    {/* Start time */}
                    <FormControl fullWidth>
                      <InputLabel>Heure de début</InputLabel>
                      <Select
                        label="Heure de début"
                        value={startHour}
                        onChange={e => { setStartHour(e.target.value); setEndHour(""); }}
                        sx={{ borderRadius: 2 }}
                      >
                        {TIME_OPTIONS.map(t => (
                          <MenuItem key={t} value={t}>{t}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* End time — only show slots after start */}
                    <FormControl fullWidth disabled={!startHour}>
                      <InputLabel>Heure de fin</InputLabel>
                      <Select
                        label="Heure de fin"
                        value={endHour}
                        onChange={e => setEndHour(e.target.value)}
                        sx={{ borderRadius: 2 }}
                      >
                        {TIME_OPTIONS.filter(t => t > startHour).map(t => (
                          <MenuItem key={t} value={t}>{t}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Preview */}
                    {startHour && endHour && startHour < endHour && (
                      <Box sx={{ p: 2, bgcolor: "primary.50", borderRadius: 2, border: "1px solid", borderColor: "primary.light" }}>
                        <Typography variant="caption" color="primary" fontWeight="bold">
                          {(() => {
                            const [sh, sm] = startHour.split(":").map(Number);
                            const [eh, em] = endHour.split(":").map(Number);
                            const mins = (eh * 60 + em) - (sh * 60 + sm);
                            return `${Math.floor(mins / 30)} créneau${Math.floor(mins/30)>1?"x":""} de 30 min : ${startHour} → ${endHour}`;
                          })()}
                        </Typography>
                      </Box>
                    )}

                    <Button
                      variant="contained"
                      type="submit"
                      disabled={submitting || isAdding}
                      startIcon={<AddIcon />}
                      sx={{ py: 1.5, borderRadius: 2, fontWeight: "bold", textTransform: "none", boxShadow: "0 4px 14px 0 rgba(25,118,210,0.39)" }}
                    >
                      {submitting ? "Publication..." : "Publier les créneaux"}
                    </Button>
                  </Stack>
                </form>
              </CardContent>
            </Card>
          </Grid>

          {/* List Slots Panel */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Typography variant="h6" fontWeight="bold" mb={3}>Current Availabilities</Typography>
            
            {availability.length === 0 ? (
              <Paper sx={{ p: 5, textAlign: "center", borderRadius: 4, bgcolor: "rgba(0,0,0,0.02)", border: "2px dashed #e0e0e0" }}>
                <Typography color="text.secondary">You haven't added any slots yet.</Typography>
              </Paper>
            ) : (
              <Stack spacing={2}>
                {availability.sort((a: any, b: any) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()).map((slot: any) => {
                  const startTime = new Date(slot.startTime);
                  const isPast = isBefore(startTime, new Date());

                  return (
                    <Card key={slot.id} sx={{ 
                      borderRadius: 3, 
                      border: "1px solid #f0f0f0",
                      transition: "0.2s",
                      "&:hover": { borderColor: "primary.main", transform: "translateY(-2px)", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }
                    }}>
                      <CardContent sx={{ py: "16px !important" }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Stack direction="row" spacing={3} alignItems="center">
                            <Box sx={{ 
                              p: 1.5, 
                              bgcolor: isPast ? "action.disabledBackground" : "primary.light", 
                              color: isPast ? "text.disabled" : "primary.main",
                              borderRadius: 2,
                              textAlign: "center",
                              minWidth: 80
                            }}>
                              <Typography variant="caption" fontWeight="bold" display="block">
                                {format(startTime, "MMM").toUpperCase()}
                              </Typography>
                              <Typography variant="h6" lineHeight="1">
                                {format(startTime, "dd")}
                              </Typography>
                            </Box>
                            
                            <Box>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {format(startTime, "EEEE, p")} - {format(new Date(slot.endTime), "p")}
                              </Typography>
                              <Stack direction="row" spacing={1} mt={0.5}>
                                <Chip 
                                  size="small" 
                                  label={(slot.booked ?? slot.isBooked) ? "BOOKED" : "AVAILABLE"} 
                                  color={(slot.booked ?? slot.isBooked) ? "error" : "success"}
                                  sx={{ fontWeight: "bold", fontSize: "0.7rem", height: 20 }}
                                />
                                {isPast && (
                                  <Chip size="small" label="PAST" variant="outlined" sx={{ fontSize: "0.7rem", height: 20 }} />
                                )}
                              </Stack>
                            </Box>
                          </Stack>

                          <IconButton 
                            color="error" 
                            onClick={() => {
                                if(window.confirm("Delete this slot?")) deleteAvailability(slot.id);
                            }}
                            sx={{ bgcolor: "rgba(211, 47, 47, 0.05)", "&:hover": { bgcolor: "rgba(211, 47, 47, 0.1)" } }}
                          >
                            <DeleteOutlineIcon />
                          </IconButton>
                        </Stack>
                      </CardContent>
                    </Card>
                  );
                })}
              </Stack>
            )}
          </Grid>
        </Grid>
      </Box>
    </UserLayout>
  );
}
