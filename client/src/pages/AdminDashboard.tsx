import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box, Typography, Grid, Card, CardContent, Stack, Chip, Avatar,
  Button, IconButton, TextField, Dialog, DialogTitle, DialogContent,
  DialogActions, Tabs, Tab, CircularProgress, Select,
  MenuItem, FormControl, InputLabel, Paper, Alert, Tooltip,
} from "@mui/material";
import {
  People as PeopleIcon,
  LocalHospital as DoctorIcon,
  MedicalServices as CabinetIcon,
  Category as SpecialityIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import {
  adminService,
  type CreateDoctorPayload,
  type UpdateDoctorPayload,
} from "@/services/adminService";
import UserLayout from "@/layouts/UserLayout";

// ── Small Components ──────────────────────────────────────────────────────────

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <Card sx={{ borderRadius: 4, border: "1px solid", borderColor: `${color}.light`, background: `linear-gradient(135deg, ${color === "primary" ? "#e3f2fd" : color === "success" ? "#e8f5e9" : color === "warning" ? "#fff8e1" : "#f3e5f5"} 0%, #fff 100%)` }}>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h3" fontWeight="900" color={`${color}.main`}>{value}</Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>{label}</Typography>
          </Box>
          <Box sx={{ p: 2, bgcolor: `${color}.light`, borderRadius: 3, color: `${color}.main` }}>{icon}</Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const qc = useQueryClient();
  const [tab, setTab] = useState(0);

  // ── Data Queries ──
  const { data: doctors = [], isLoading: loadingDoctors } = useQuery({ queryKey: ["admin-doctors"], queryFn: adminService.getAllDoctors });
  const { data: patients = [], isLoading: loadingPatients } = useQuery({ queryKey: ["admin-patients"], queryFn: adminService.getAllPatients });
  const { data: cabinets = [], isLoading: loadingCabinets } = useQuery({ queryKey: ["admin-cabinets"], queryFn: adminService.getAllCabinets });
  const { data: specialities = [], isLoading: loadingSpec } = useQuery({ queryKey: ["admin-specialities"], queryFn: adminService.getAllSpecialities });

  // ── Mutations ──
  const deleteDoctor = useMutation({ mutationFn: adminService.deleteDoctor, onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-doctors"] }); } });
  const deleteCabinet = useMutation({ mutationFn: adminService.deleteCabinet, onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-cabinets"] }); } });
  const deleteSpeciality = useMutation({ mutationFn: adminService.deleteSpeciality, onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-specialities"] }); } });
  const createDoctor = useMutation({ mutationFn: adminService.createDoctor, onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-doctors"] }); setDoctorDialog(false); } });
  const updateDoctor = useMutation({ mutationFn: ({ id, payload }: { id: number; payload: UpdateDoctorPayload }) => adminService.updateDoctor(id, payload), onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-doctors"] }); setEditDoctorDialog(null); } });
  const createCabinet = useMutation({ mutationFn: adminService.createCabinet, onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-cabinets"] }); setCabinetDialog(false); } });
  const createSpeciality = useMutation({ mutationFn: adminService.createSpeciality, onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-specialities"] }); setSpecDialog(false); } });

  // ── Dialog state ──
  const [doctorDialog, setDoctorDialog] = useState(false);
  const [editDoctorDialog, setEditDoctorDialog] = useState<any>(null);
  const [cabinetDialog, setCabinetDialog] = useState(false);
  const [specDialog, setSpecDialog] = useState(false);

  // ── Form state ──
  const [newDoctor, setNewDoctor] = useState<CreateDoctorPayload>({ firstname: "", lastname: "", email: "", password: "", specialityId: 0, cabinetId: 0 });
  const [editDoc, setEditDoc] = useState<UpdateDoctorPayload & { id: number }>({ id: 0, firstname: "", lastname: "", status: "ACTIVE", specialityId: 0, cabinetId: 0 });
  const [newCabinet, setNewCabinet] = useState({ name: "", location: "" });
  const [newSpec, setNewSpec] = useState("");

  const handleOpenEditDoctor = (doc: any) => {
    setEditDoc({ id: doc.id, firstname: doc.user.firstname, lastname: doc.user.lastname, status: doc.status, specialityId: doc.speciality?.id, cabinetId: doc.cabinet?.id });
    setEditDoctorDialog(doc);
  };

  return (
    <UserLayout>
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, mx: "auto" }}>
        {/* Header */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h3" fontWeight="900" sx={{ background: "linear-gradient(45deg,#1976d2,#9c27b0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Administration
          </Typography>
          <Typography color="text.secondary">Gestion globale de la plateforme RenDoc</Typography>
        </Box>

        {/* Stats */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}><StatCard icon={<DoctorIcon />} label="Médecins actifs" value={doctors.length} color="primary" /></Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}><StatCard icon={<PeopleIcon />} label="Patients enregistrés" value={patients.length} color="success" /></Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}><StatCard icon={<CabinetIcon />} label="Cabinets médicaux" value={cabinets.length} color="warning" /></Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}><StatCard icon={<SpecialityIcon />} label="Spécialités" value={specialities.length} color="secondary" /></Grid>
        </Grid>

        {/* Tabs */}
        <Paper sx={{ borderRadius: 4, border: "1px solid #e0e0e0", overflow: "hidden" }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: "1px solid #e0e0e0", px: 2 }} variant="scrollable">
            <Tab label="Médecins" icon={<DoctorIcon />} iconPosition="start" />
            <Tab label="Patients" icon={<PeopleIcon />} iconPosition="start" />
            <Tab label="Cabinets" icon={<CabinetIcon />} iconPosition="start" />
            <Tab label="Spécialités" icon={<SpecialityIcon />} iconPosition="start" />
          </Tabs>

          <Box sx={{ p: 3 }}>

            {/* ── TAB 0: Doctors ── */}
            {tab === 0 && (
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="h6" fontWeight="bold">Liste des Médecins</Typography>
                  <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDoctorDialog(true)} sx={{ borderRadius: 3, textTransform: "none", fontWeight: "bold" }}>
                    Ajouter un médecin
                  </Button>
                </Stack>
                {loadingDoctors ? <CircularProgress /> : (
                  <Stack spacing={2}>
                    {doctors.map((doc) => (
                      <Card key={doc.id} sx={{ borderRadius: 3, border: "1px solid #f0f0f0", "&:hover": { borderColor: "primary.main", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }, transition: "0.2s" }}>
                        <CardContent sx={{ py: "12px !important" }}>
                          <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Avatar sx={{ bgcolor: "primary.main", width: 48, height: 48, fontWeight: "bold" }}>
                                {doc.user.firstname[0]}{doc.user.lastname[0]}
                              </Avatar>
                              <Box>
                                <Typography fontWeight="bold">Dr. {doc.user.firstname} {doc.user.lastname}</Typography>
                                <Typography variant="body2" color="text.secondary">{doc.user.email}</Typography>
                                <Stack direction="row" spacing={1} mt={0.5}>
                                  <Chip size="small" label={doc.speciality?.name || "—"} color="primary" variant="outlined" sx={{ fontSize: "0.7rem", height: 20 }} />
                                  <Chip size="small" label={doc.cabinet?.name || "—"} sx={{ fontSize: "0.7rem", height: 20, bgcolor: "#f5f5f5" }} />
                                  <Chip size="small" label={doc.status} color={doc.status === "ACTIVE" ? "success" : "default"} sx={{ fontSize: "0.7rem", height: 20 }} />
                                </Stack>
                              </Box>
                            </Stack>
                            <Stack direction="row" spacing={1}>
                              <Tooltip title="Modifier"><IconButton size="small" color="primary" onClick={() => handleOpenEditDoctor(doc)}><EditIcon fontSize="small" /></IconButton></Tooltip>
                              <Tooltip title="Supprimer"><IconButton size="small" color="error" onClick={() => { if (window.confirm("Supprimer ce médecin ?")) deleteDoctor.mutate(doc.id); }}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                            </Stack>
                          </Stack>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                )}
              </Box>
            )}

            {/* ── TAB 1: Patients ── */}
            {tab === 1 && (
              <Box>
                <Typography variant="h6" fontWeight="bold" mb={3}>Liste des Patients</Typography>
                {loadingPatients ? <CircularProgress /> : (
                  <Stack spacing={2}>
                    {patients.map((pat) => (
                      <Card key={pat.id} sx={{ borderRadius: 3, border: "1px solid #f0f0f0" }}>
                        <CardContent sx={{ py: "12px !important" }}>
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar sx={{ bgcolor: "success.light", color: "success.dark", fontWeight: "bold" }}>
                              <PersonIcon />
                            </Avatar>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography fontWeight="bold">{pat.user.firstname} {pat.user.lastname}</Typography>
                              <Typography variant="body2" color="text.secondary">{pat.user.email}</Typography>
                            </Box>
                            <Chip size="small" label={pat.status} color={pat.status === "ACTIVE" ? "success" : "default"} />
                          </Stack>
                        </CardContent>
                      </Card>
                    ))}
                    {patients.length === 0 && <Alert severity="info">Aucun patient enregistré pour l'instant.</Alert>}
                  </Stack>
                )}
              </Box>
            )}

            {/* ── TAB 2: Cabinets ── */}
            {tab === 2 && (
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="h6" fontWeight="bold">Cabinets Médicaux</Typography>
                  <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCabinetDialog(true)} sx={{ borderRadius: 3, textTransform: "none", fontWeight: "bold" }}>
                    Ajouter un cabinet
                  </Button>
                </Stack>
                {loadingCabinets ? <CircularProgress /> : (
                  <Grid container spacing={2}>
                    {cabinets.map((cab) => (
                      <Grid size={{ xs: 12, md: 6, lg: 4 }} key={cab.id}>
                        <Card sx={{ borderRadius: 3, border: "1px solid #f0f0f0", height: "100%", "&:hover": { borderColor: "warning.main", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }, transition: "0.2s" }}>
                          <CardContent>
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                              <Box>
                                <Typography fontWeight="bold" variant="subtitle1">{cab.name}</Typography>
                                <Typography variant="body2" color="text.secondary">{cab.location}</Typography>
                              </Box>
                              <IconButton size="small" color="error" onClick={() => { if (window.confirm("Supprimer ce cabinet ?")) deleteCabinet.mutate(cab.id); }}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                    {cabinets.length === 0 && <Grid size={12}><Alert severity="info">Aucun cabinet créé.</Alert></Grid>}
                  </Grid>
                )}
              </Box>
            )}

            {/* ── TAB 3: Specialities ── */}
            {tab === 3 && (
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="h6" fontWeight="bold">Spécialités Médicales</Typography>
                  <Button variant="contained" startIcon={<AddIcon />} onClick={() => setSpecDialog(true)} sx={{ borderRadius: 3, textTransform: "none", fontWeight: "bold" }}>
                    Ajouter une spécialité
                  </Button>
                </Stack>
                {loadingSpec ? <CircularProgress /> : (
                  <Stack direction="row" flexWrap="wrap" gap={2}>
                    {specialities.map((sp) => (
                      <Chip
                        key={sp.id}
                        label={sp.name}
                        color="secondary"
                        variant="outlined"
                        onDelete={() => { if (window.confirm(`Supprimer ${sp.name} ?`)) deleteSpeciality.mutate(sp.id); }}
                        sx={{ fontWeight: "bold", borderRadius: 2, px: 1 }}
                      />
                    ))}
                    {specialities.length === 0 && <Alert severity="info">Aucune spécialité créée.</Alert>}
                  </Stack>
                )}
              </Box>
            )}

          </Box>
        </Paper>

        {/* ── DIALOG: Create Doctor ── */}
        <Dialog open={doctorDialog} onClose={() => setDoctorDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
          <DialogTitle sx={{ fontWeight: "bold" }}>Ajouter un médecin</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Stack direction="row" spacing={2}>
                <TextField fullWidth label="Prénom" value={newDoctor.firstname} onChange={e => setNewDoctor(p => ({ ...p, firstname: e.target.value }))} />
                <TextField fullWidth label="Nom" value={newDoctor.lastname} onChange={e => setNewDoctor(p => ({ ...p, lastname: e.target.value }))} />
              </Stack>
              <TextField fullWidth label="Email" type="email" value={newDoctor.email} onChange={e => setNewDoctor(p => ({ ...p, email: e.target.value }))} />
              <TextField fullWidth label="Mot de passe" type="password" value={newDoctor.password} onChange={e => setNewDoctor(p => ({ ...p, password: e.target.value }))} />
              <FormControl fullWidth>
                <InputLabel>Spécialité</InputLabel>
                <Select label="Spécialité" value={newDoctor.specialityId || ""} onChange={e => setNewDoctor(p => ({ ...p, specialityId: Number(e.target.value) }))}>
                  {specialities.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Cabinet</InputLabel>
                <Select label="Cabinet" value={newDoctor.cabinetId || ""} onChange={e => setNewDoctor(p => ({ ...p, cabinetId: Number(e.target.value) }))}>
                  {cabinets.map(c => <MenuItem key={c.id} value={c.id}>{c.name} — {c.location}</MenuItem>)}
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setDoctorDialog(false)} sx={{ borderRadius: 2 }}>Annuler</Button>
            <Button variant="contained" onClick={() => createDoctor.mutate(newDoctor)} disabled={createDoctor.isPending} sx={{ borderRadius: 2, fontWeight: "bold" }}>
              {createDoctor.isPending ? "Création..." : "Créer le médecin"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* ── DIALOG: Edit Doctor ── */}
        <Dialog open={!!editDoctorDialog} onClose={() => setEditDoctorDialog(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
          <DialogTitle sx={{ fontWeight: "bold" }}>Modifier le médecin</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Stack direction="row" spacing={2}>
                <TextField fullWidth label="Prénom" value={editDoc.firstname} onChange={e => setEditDoc(p => ({ ...p, firstname: e.target.value }))} />
                <TextField fullWidth label="Nom" value={editDoc.lastname} onChange={e => setEditDoc(p => ({ ...p, lastname: e.target.value }))} />
              </Stack>
              <FormControl fullWidth>
                <InputLabel>Statut</InputLabel>
                <Select label="Statut" value={editDoc.status || "ACTIVE"} onChange={e => setEditDoc(p => ({ ...p, status: e.target.value }))}>
                  <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                  <MenuItem value="INACTIVE">INACTIVE</MenuItem>
                  <MenuItem value="SUSPENDED">SUSPENDED</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Spécialité</InputLabel>
                <Select label="Spécialité" value={editDoc.specialityId || ""} onChange={e => setEditDoc(p => ({ ...p, specialityId: Number(e.target.value) }))}>
                  {specialities.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Cabinet</InputLabel>
                <Select label="Cabinet" value={editDoc.cabinetId || ""} onChange={e => setEditDoc(p => ({ ...p, cabinetId: Number(e.target.value) }))}>
                  {cabinets.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setEditDoctorDialog(null)} sx={{ borderRadius: 2 }}>Annuler</Button>
            <Button variant="contained" onClick={() => updateDoctor.mutate({ id: editDoc.id, payload: { firstname: editDoc.firstname, lastname: editDoc.lastname, status: editDoc.status, specialityId: editDoc.specialityId, cabinetId: editDoc.cabinetId } })} disabled={updateDoctor.isPending} sx={{ borderRadius: 2, fontWeight: "bold" }}>
              {updateDoctor.isPending ? "Mise à jour..." : "Enregistrer"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* ── DIALOG: Create Cabinet ── */}
        <Dialog open={cabinetDialog} onClose={() => setCabinetDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
          <DialogTitle sx={{ fontWeight: "bold" }}>Nouveau cabinet</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField fullWidth label="Nom du cabinet" value={newCabinet.name} onChange={e => setNewCabinet(p => ({ ...p, name: e.target.value }))} />
              <TextField fullWidth label="Adresse / Localisation" value={newCabinet.location} onChange={e => setNewCabinet(p => ({ ...p, location: e.target.value }))} />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setCabinetDialog(false)} sx={{ borderRadius: 2 }}>Annuler</Button>
            <Button variant="contained" onClick={() => createCabinet.mutate(newCabinet)} disabled={createCabinet.isPending} sx={{ borderRadius: 2, fontWeight: "bold" }}>
              {createCabinet.isPending ? "Création..." : "Créer"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* ── DIALOG: Create Speciality ── */}
        <Dialog open={specDialog} onClose={() => setSpecDialog(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
          <DialogTitle sx={{ fontWeight: "bold" }}>Nouvelle spécialité</DialogTitle>
          <DialogContent>
            <TextField fullWidth label="Nom de la spécialité" value={newSpec} onChange={e => setNewSpec(e.target.value)} sx={{ mt: 1 }} />
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setSpecDialog(false)} sx={{ borderRadius: 2 }}>Annuler</Button>
            <Button variant="contained" onClick={() => createSpeciality.mutate(newSpec)} disabled={createSpeciality.isPending} sx={{ borderRadius: 2, fontWeight: "bold" }}>
              {createSpeciality.isPending ? "Création..." : "Créer"}
            </Button>
          </DialogActions>
        </Dialog>

      </Box>
    </UserLayout>
  );
}