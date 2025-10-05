import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { usePostsInfinite, useDeletePost } from "@/entities/post/hooks";
import { CreatePostForm } from "@/features/manage-post/CreatePostForm";
import { EditPostModal } from "@/features/manage-post/EditPostModal";
import { formatDate } from "@/shared/lib/utils";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/ui/avatar";
import { config } from "@/shared/config";
import { useUserProfile } from "@/entities/user";

export const PostsFeed = () => {
  const { data: profile } = useUserProfile();
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [editingPost, setEditingPost] = useState(null);
  const { toast } = useToast();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePostsInfinite(sortBy === "newest" ? "desc" : "asc");

  const deletePostMutation = useDeletePost();
  // Build a flat array of posts
  const posts = data?.pages.flatMap((page) => page.items) ?? [];

  const handleLoadMore = () => {
    if (hasNextPage) fetchNextPage();
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await deletePostMutation.mutateAsync(postId);
      toast({ title: "Success", description: "Post deleted successfully" });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <CreatePostForm />

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h4 className="text-xl font-semibold">Your Posts</h4>
            <SortSelect value={sortBy} onChange={(v) => setSortBy(v as "newest" | "oldest")} />
          </div>
        </CardHeader>

        <CardContent>
          {posts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No posts yet. Create your first post above!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    currentUserId={profile.id}
                    onEdit={setEditingPost}
                    onDelete={handleDeletePost}
                  />
                ))
              ))}
            </div>
          )}

          {hasNextPage && (
            <div className="text-center pt-6">
              <Button
                variant="outline"
                size="lg"
                onClick={handleLoadMore}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? "Loading..." : "Load More Posts"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <EditPostModal
        open={!!editingPost}
        onClose={() => setEditingPost(null)}
        post={editingPost}
      />
    </div>
  );
};

const PostCard = ({ post, currentUserId, onEdit, onDelete }) => {
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      await onDelete(post.id);
      toast({ title: "Success", description: "Post deleted successfully" });
    } catch {
      toast({ title: "Error", description: "Failed to delete post", variant: "destructive" });
    }
  };

  return (
    <div className="border border-border rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <Avatar className="h-12 w-12 border-2 shadow-lg">
            <AvatarImage src={`${config.API_BASE_URL}${post.user?.avatarUrl}`} />
          </Avatar>
          <div>
            <p>{post.user.firstName} {post.user.lastName}</p>
            <p className="text-sm text-muted-foreground">
              {formatDate(post.createdAt)}
              {post.updatedAt && " (edited)"}
            </p>
          </div>
        </div>

        {post.user.id === currentUserId && (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => onEdit(post)}>
              <Edit className="h-4 w-4" />
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Post</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this post? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      <p className="whitespace-pre-wrap text-foreground">{post.text}</p>

      {post.images?.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {post.images.map((image, index) => (
            <img
              key={image.id || index}
              src={`${config.API_BASE_URL}${image.url}`}
              alt={`Post image ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg border"
            />
          ))}
        </div>
      )}
    </div>
  );
};

const SortSelect = ({ value, onChange }) => (
  <div className="flex items-center gap-3">
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">Newest First</SelectItem>
        <SelectItem value="oldest">Oldest First</SelectItem>
      </SelectContent>
    </Select>
  </div>
);