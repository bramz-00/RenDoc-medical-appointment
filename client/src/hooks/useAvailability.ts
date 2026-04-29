import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { availabilityService, type Availability } from "@/services/availabilityService";

export function useAvailability(doctorId?: number) {
  const queryClient = useQueryClient();

  const availabilityQuery = useQuery({
    queryKey: ["availability", doctorId],
    queryFn: () => availabilityService.getDoctorAvailability(doctorId!),
    enabled: !!doctorId,
  });

  const availableSlotsQuery = useQuery({
    queryKey: ["availability", "available", doctorId],
    queryFn: () => availabilityService.getAvailableSlots(doctorId!),
    enabled: !!doctorId,
  });

  const addMutation = useMutation({
    mutationFn: (data: Availability) => availabilityService.addAvailability(doctorId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability", doctorId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => availabilityService.deleteAvailability(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability", doctorId] });
    },
  });

  return {
    availability: availabilityQuery.data || [],
    availableSlots: availableSlotsQuery.data || [],
    isLoading: availabilityQuery.isLoading || availableSlotsQuery.isLoading,
    addAvailability: addMutation.mutate,
    addAvailabilityAsync: addMutation.mutateAsync,
    isAdding: addMutation.isPending,
    deleteAvailability: deleteMutation.mutate,
  };
}
