import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { appointmentService } from "@/services/appointmentService";
import type { CreateAppointmentData } from "@/services/appointmentService";

export const useAppointments = (patientId?: number) => {
  const queryClient = useQueryClient();

  const appointmentsQuery = useQuery({
    queryKey: ["appointments", "patient", patientId],
    queryFn: () => appointmentService.getAppointmentsByPatient(patientId!),
    enabled: !!patientId,
  });

  const createAppointmentMutation = useMutation({
    mutationFn: (data: CreateAppointmentData) => appointmentService.createAppointment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  const cancelAppointmentMutation = useMutation({
    mutationFn: (id: number) => appointmentService.cancelAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  return {
    appointments: appointmentsQuery.data,
    isLoading: appointmentsQuery.isLoading,
    createAppointment: createAppointmentMutation.mutate,
    isCreating: createAppointmentMutation.isPending,
    cancelAppointment: cancelAppointmentMutation.mutate,
  };
};
