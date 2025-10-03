import { useInfiniteQuery, useMutation, useQueryClient, InfiniteData } from '@tanstack/react-query';
import { postApi } from './api';
import {
  CreatePostRequest,
  UpdatePostRequest,
  PostsResponse,
  Post,
} from './types';

export const POST_QUERY_KEYS = {
  posts: ['posts'] as const,
  post: (id: string) => ['posts', id] as const,
};

export const usePostsInfinite = (sort: 'asc' | 'desc' = 'desc') => {
  return useInfiniteQuery<
    PostsResponse,
    Error,
    InfiniteData<PostsResponse>,
    readonly [...typeof POST_QUERY_KEYS.posts, 'sort', typeof sort],
    number
  >({
    queryKey: [...POST_QUERY_KEYS.posts, 'sort', sort],
    queryFn: ({ pageParam = 0 }) =>
      postApi.getPosts({ limit: 5, offset: pageParam, sort }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.flatMap(p => p.items).length;
      return loaded < lastPage.total ? loaded : undefined;
    },
  });
};

export const useCreatePost = (sort: 'asc' | 'desc' = 'desc') => {
  const queryClient = useQueryClient();
  const key = [...POST_QUERY_KEYS.posts, 'sort', sort] as const;

  return useMutation({
    mutationFn: (data: CreatePostRequest) => postApi.createPost(data),
    onSuccess: (newPost: Post) => {
      queryClient.setQueryData<InfiniteData<PostsResponse, number>>(key, (oldData) => {
        if (!oldData) return oldData;

        const pages = [...oldData.pages];
        if (sort === 'desc') {
          pages[0] = { ...pages[0], items: [newPost, ...pages[0].items] };
        } else {
          const lastIdx = pages.length - 1;
          pages[lastIdx] = { ...pages[lastIdx], items: [...pages[lastIdx].items, newPost] };
        }

        return { ...oldData, pages };
      });
    },
  });
};

export const useUpdatePost = (sort: 'asc' | 'desc' = 'desc') => {
  const queryClient = useQueryClient();
  const key = [...POST_QUERY_KEYS.posts, 'sort', sort] as const;

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePostRequest }) =>
      postApi.updatePost(id, data),
    onSuccess: (updatedPost: Post) => {
      queryClient.setQueryData<InfiniteData<PostsResponse, number>>(key, (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            items: page.items.map((post) => (post.id === updatedPost.id ? updatedPost : post)),
          })),
        };
      });
    },
  });
};

export const useDeletePost = (sort: 'asc' | 'desc' = 'desc') => {
  const queryClient = useQueryClient();
  const key = [...POST_QUERY_KEYS.posts, 'sort', sort] as const;

  return useMutation({
    mutationFn: (id: string) => postApi.deletePost(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<InfiniteData<PostsResponse, number>>(key, (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            items: page.items.filter((post) => post.id !== id),
          })),
        };
      });
    },
  });
};