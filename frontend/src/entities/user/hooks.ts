import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "./api";
import { UpdateUserRequest, User } from "./types";

export const USER_QUERY_KEYS = {
  profile: ["user", "profile"] as const,
};

export const useUserProfile = () => {
  return useQuery({
    queryKey: USER_QUERY_KEYS.profile,
    queryFn: () => userApi.getProfile("9992eeb8-0ee5-45b4-a4f1-0846749201e4"),
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserRequest) =>
      userApi.updateProfile("9992eeb8-0ee5-45b4-a4f1-0846749201e4", data),
    onSuccess: (updatedUser: User) => {
      queryClient.setQueryData(USER_QUERY_KEYS.profile, updatedUser);
    },
  });
};

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) =>
      userApi.uploadAvatar("9992eeb8-0ee5-45b4-a4f1-0846749201e4", file),
    onSuccess: (updatedUser: User) => {
      queryClient.setQueryData(USER_QUERY_KEYS.profile, updatedUser);
    },
  });
};
