import { useState } from 'react';
import { Edit, Trash2, RefreshCw } from 'lucide-react';
import { usePostsInfinite, useDeletePost } from '@/entities/post/hooks';
import { CreatePostForm } from '@/features/manage-post/CreatePostForm';
import { EditPostModal } from '@/features/manage-post/EditPostModal';
import { formatDate } from '@/shared/lib/utils';
import { Card, CardContent, CardHeader } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/shared/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

export const PostsFeed = () => {
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [editingPost, setEditingPost] = useState(null);
  const { toast } = useToast();

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePostsInfinite(sortBy === 'newest' ? 'desc' : 'asc');

  const deletePostMutation = useDeletePost();
  // Собираем плоский массив постов
  const posts = data?.pages.flatMap(page => page.items) ?? [];

  const handleLoadMore = () => {
    if (hasNextPage) fetchNextPage();
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await deletePostMutation.mutateAsync(postId);
      toast({ title: "Success", description: "Post deleted successfully" });
    } catch {
      toast({ title: "Error", description: "Failed to delete post", variant: "destructive" });
    }
  };


  return (
    <div className="space-y-6">
      <CreatePostForm onSuccess={() => {}} />

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h4 className="text-xl font-semibold">Your Posts</h4>
            <div className="flex items-center gap-3">
              <Select value={sortBy} onValueChange={(value: string) => setSortBy(value as 'newest' | 'oldest')}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
                <div key={post.id} className="border border-border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <h5 className="font-medium">Post</h5>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {formatDate(post.createdAt)}
                        {post.updatedAt && ' (edited)'}
                      </span>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => setEditingPost(post)}>
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
                              <AlertDialogAction onClick={() => handleDeletePost(post.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>

                  <p className="whitespace-pre-wrap text-foreground">{post.text}</p>
                  {post.images?.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {post.images.map((image, index) => (
                        <img
                          key={image.id || index}
                          src={`http://localhost:3000${image.url}`}
                          alt={`Post image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {hasNextPage && (
            <div className="text-center pt-6">
              <Button variant="outline" size="lg" onClick={handleLoadMore} disabled={isFetchingNextPage}>
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
