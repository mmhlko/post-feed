import { User } from "../user";

export interface Post {
  id: string;
  text: string;
  images: PostImage[];
  user: Pick<User, 'id' | 'firstName' | 'lastName' | 'avatarUrl'>;
  createdAt: string;
  updatedAt?: string;
}
export interface PostImage {
  id: string;
  url: string;
  postId: string;
}
export interface CreatePostRequest {
  text: string;
  images?: File[];
}

export type UpdatePostRequest = Partial<Pick<CreatePostRequest, 'text' | 'images'>> & {
  removeImageIds?: string[];
};

export interface PostsQuery {
  limit?: number;
  offset?: number;
  sort?: 'asc' | 'desc';
}

export interface PostsResponse {
  items: Post[];
  total: number;
}
