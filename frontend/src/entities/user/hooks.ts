import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "./api";
import { UpdateUserRequest, User } from "./types";

export const USER_QUERY_KEYS = {
  profile: ["user", "profile"] as const,
};

export const useUserProfile = () => {
  return useQuery({
    queryKey: USER_QUERY_KEYS.profile,
    queryFn: () => userApi.getProfile(),
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserRequest) =>
      userApi.updateProfile(data),
    onSuccess: (updatedUser: User) => {
      queryClient.setQueryData(USER_QUERY_KEYS.profile, updatedUser);
    },
  });
};

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) =>
      userApi.uploadAvatar(file),
    onSuccess: (updatedUser: User) => {
      queryClient.setQueryData(USER_QUERY_KEYS.profile, updatedUser);
    },
  });
};
