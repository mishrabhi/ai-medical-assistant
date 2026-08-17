"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { usersApi } from "@/lib/api/user";
import type {
  ChangePasswordPayload,
  UpdateProfilePayload,
} from "@/types/user";

const USER_PROFILE_QUERY_KEY = ["user-profile"];

export function useUserProfile() {
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: USER_PROFILE_QUERY_KEY,
    queryFn: usersApi.getProfile,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      usersApi.updateProfile(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: USER_PROFILE_QUERY_KEY,
      });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (payload: ChangePasswordPayload) =>
      usersApi.changePassword(payload),
  });

  const updateAvatarMutation = useMutation({
    mutationFn: (avatar: string) => usersApi.updateAvatar(avatar),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: USER_PROFILE_QUERY_KEY,
      });
    },
  });

  const deactivateAccountMutation = useMutation({
    mutationFn: usersApi.deactivateAccount,
  });

  return {
    profileQuery,
    updateProfileMutation,
    changePasswordMutation,
    updateAvatarMutation,
    deactivateAccountMutation,
  };
}