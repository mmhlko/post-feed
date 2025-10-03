import { apiClient } from "@/shared/api/axios";
import {
  Post,
  CreatePostRequest,
  UpdatePostRequest,
  PostsQuery,
  PostsResponse,
} from "./types";

export const postApi = {
  getPosts: async (
    query: PostsQuery = {}
  ): Promise<PostsResponse> => {
    const params = new URLSearchParams();
    if (query.limit) params.append("limit", query.limit.toString());
    if (query.offset) params.append("offset", query.offset.toString());
    if (query.sort) params.append("sort", query.sort);

    const response = await apiClient.get(`/posts?${params.toString()}`);
    return response.data;
  },

  createPost: async (data: CreatePostRequest): Promise<Post> => {
    const formData = new FormData();
    formData.append("text", data.text);

    if (data.images) {
      data.images.forEach((image) => {
        formData.append("images", image);
      });
    }

    const response = await apiClient.post("/posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  updatePost: async (id: string, data: UpdatePostRequest): Promise<Post> => {
    const formData = new FormData();

    if (data.text) formData.append("text", data.text);
    if (data.removeImageIds && data.removeImageIds.length > 0) {
      data.removeImageIds.forEach((imageId) => {
        formData.append("removeImageIds[]", imageId);
      });
    }
    if (data.images) {
      data.images.forEach((image) => {
        formData.append("images", image);
      });
    }

    const response = await apiClient.patch(`/posts/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  deletePost: async (id: string): Promise<{ ok: boolean }> => {
    const response = await apiClient.delete(`/posts/${id}`);
    return response.data;
  },
};
