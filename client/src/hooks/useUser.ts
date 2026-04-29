import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/userService";
import type { UpdateProfileData } from "@/services/userService";

export const useUser = (userId?: number) => {
  const queryClient = useQueryClient();

  const userQuery = useQuery({
    queryKey: ["user", userId],
    queryFn: () => userService.getUserById(userId!),
    enabled: !!userId,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileData) => userService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      // Also invalidate whoami if you have one
      queryClient.invalidateQueries({ queryKey: ["whoami"] });
    },
  });

  return {
    user: userQuery.data,
    isLoading: userQuery.isLoading,
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
  };
};
