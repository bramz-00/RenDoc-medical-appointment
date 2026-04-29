import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Box, Typography, Card, CardContent, Stack, Button, TextField,
  CircularProgress, Divider, Avatar, Chip, Alert,
} from "@mui/material";
import {
  LocalHospital as CabinetIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Verified as VerifiedIcon,
} from "@mui/icons-material";
import api from "@/api/client";
import UserLayout from "@/layouts/UserLayout";
import { useAuthStore } from "@/stores/authStore";

interface DoctorProfile {
  id: number;
  status: string;
  user: { id: number; firstname: string; lastname: string; email: string };
  speciality: { name: string };
  cabinet: { id: number; name: string; location: string } | null;
}

export default function DoctorProfile() {
  useAuthStore();
  const [editCabinet, setEditCabinet] = useState(false);
  const [cabinetForm, setCabinetForm] = useState({ name: "", location: "" });

  const { data: profile, isLoading, refetch } = useQuery<DoctorProfile>({
    queryKey: ["doctor-profile"],
    queryFn: async () => {
      const res = await api.get("/doctors/my-profile");
      return res.data.data;
    },
  });

  const updateCabinet = useMutation({
    mutationFn: (data: { name: string; location: string }) => api.put("/doctors/my-cabinet", data),
    onSuccess: () => { setEditCabinet(false); refetch(); },
  });

  const handleEditCabinet = () => {
    setCabinetForm({ name: profile?.cabinet?.name || "", location: profile?.cabinet?.location || "" });
    setEditCabinet(true);
  };

  if (isLoading) return <UserLayout><Box display="flex" justifyContent="center" pt={10}><CircularProgress /></Box></UserLayout>;
  if (!profile) return <UserLayout><Alert severity="info" sx={{ m: 4 }}>Profil médecin introuvable.</Alert></UserLayout>;

  return (
    <UserLayout>
      <Box sx={{ p: { xs: 2, md: 5 }, maxWidth: 900, mx: "auto" }}>

        {/* Header Card */}
        <Card sx={{ borderRadius: 5, mb: 4, background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)", color: "white" }}>
          <CardContent sx={{ p: 4 }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems={{ xs: "center", sm: "flex-start" }}>
              <Avatar sx={{ width: 80, height: 80, bgcolor: "rgba(255,255,255,0.2)", fontSize: 32, fontWeight: "bold", border: "3px solid rgba(255,255,255,0.4)" }}>
                {profile.user.firstname[0]}{profile.user.lastname[0]}
              </Avatar>
              <Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="h4" fontWeight="900">Dr. {profile.user.firstname} {profile.user.lastname}</Typography>
                  <VerifiedIcon sx={{ fontSize: 24 }} />
                </Stack>
                <Typography sx={{ opacity: 0.85 }}>{profile.user.email}</Typography>
                <Stack direction="row" spacing={1} mt={1.5}>
                  <Chip label={profile.speciality?.name} sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white", fontWeight: "bold" }} size="small" />
                  <Chip label={profile.status} color={profile.status === "ACTIVE" ? "success" : "default"} size="small" />
                </Stack>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Cabinet Card */}
        <Card sx={{ borderRadius: 4, border: "1px solid #e0e0e0", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
          <CardContent sx={{ p: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <CabinetIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">Mon Cabinet</Typography>
              </Stack>
              {!editCabinet && (
                <Button startIcon={<EditIcon />} onClick={handleEditCabinet} sx={{ borderRadius: 3, textTransform: "none" }}>
                  Modifier
                </Button>
              )}
            </Stack>

            {editCabinet ? (
              <Stack spacing={2}>
                <TextField fullWidth label="Nom du cabinet" value={cabinetForm.name} onChange={e => setCabinetForm(p => ({ ...p, name: e.target.value }))} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                <TextField fullWidth label="Adresse / Localisation" value={cabinetForm.location} onChange={e => setCabinetForm(p => ({ ...p, location: e.target.value }))} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                <Stack direction="row" spacing={2} pt={1}>
                  <Button variant="contained" startIcon={<SaveIcon />} onClick={() => updateCabinet.mutate(cabinetForm)} disabled={updateCabinet.isPending} sx={{ borderRadius: 3, textTransform: "none", fontWeight: "bold" }}>
                    {updateCabinet.isPending ? "Enregistrement..." : "Sauvegarder"}
                  </Button>
                  <Button onClick={() => setEditCabinet(false)} sx={{ borderRadius: 3, textTransform: "none" }}>Annuler</Button>
                </Stack>
              </Stack>
            ) : profile.cabinet ? (
              <Stack spacing={1.5}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Nom</Typography>
                  <Typography variant="subtitle1" fontWeight="bold">{profile.cabinet.name}</Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="body2" color="text.secondary">Adresse</Typography>
                  <Typography variant="subtitle1" fontWeight="bold">{profile.cabinet.location}</Typography>
                </Box>
              </Stack>
            ) : (
              <Alert severity="warning">Aucun cabinet assigné. Contactez l'administrateur ou cliquez sur Modifier pour en créer un.</Alert>
            )}
          </CardContent>
        </Card>

      </Box>
    </UserLayout>
  );
}
