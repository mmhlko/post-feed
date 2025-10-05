import { useState, useEffect, useRef } from 'react';
import { Plus, X } from 'lucide-react';
import { Post } from '@/entities/post/types';
import { useUpdatePost } from '@/entities/post/hooks';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { config, CONSTANTS } from '@/shared/config';

interface UploadedFile {
  id: string;
  url: string;
  file?: File;
}

interface EditPostModalProps {
  open: boolean;
  onClose: () => void;
  post: Post | null;
}

export const EditPostModal = ({ open, onClose, post }: EditPostModalProps) => {
  const [text, setText] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updatePostMutation = useUpdatePost();
  const { toast } = useToast();

  useEffect(() => {
    if (post && open) {
      setText(post.text);
      const images = post.images.map((image) => ({
        id: image.id,
        url: image.url,
      }));
      setUploadedFiles(images);
      setRemovedImageIds([]);
    }
  }, [post, open]);

  const handleSubmit = async () => {
    if (!text.trim() || !post) {
      toast({ title: "Warning", description: "Please enter some content for your post", variant: "destructive" });
      return;
    }

    try {
      const newFiles = uploadedFiles.filter(file => file.file).map(file => file.file!);

      await updatePostMutation.mutateAsync({
        id: post.id,
        data: {
          text: text.trim(),
          images: newFiles,
          removeImageIds: removedImageIds,
        },
      });

      toast({ title: "Success", description: "Post updated successfully!" });
      onClose();
    } catch (error) {
      toast({ title: "Error", description: "Failed to update post", variant: "destructive" });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + uploadedFiles.length > CONSTANTS.MAX_IMAGES_PER_POST) {
      toast({ title: "Warning", description: `Maximum ${CONSTANTS.MAX_IMAGES_PER_POST} images allowed`, variant: "destructive" });
      return;
    }

    const newFiles = files.map(file => ({
      id: Math.random().toString(36),
      url: URL.createObjectURL(file),
      file,
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    const file = uploadedFiles.find(f => f.id === id);
    if (file && !file.file) {
      // This is an existing image, add to removed list
      setRemovedImageIds(prev => [...prev, id]);
    }
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  };

  const getImageSrc = (file: UploadedFile) => {
    return file.file ? file.url : `${config.API_BASE_URL}${file.url}`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <Textarea
            placeholder="What's on your mind?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            maxLength={CONSTANTS.MAX_POST_LENGTH}
            className="resize-none"
          />
          <p className="text-sm text-muted-foreground text-right">{text.length}/{CONSTANTS.MAX_POST_LENGTH}</p>

          <div className="space-y-3">
            {uploadedFiles.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="relative">
                    <img
                      src={getImageSrc(file)}
                      alt="Upload preview"
                      className="w-full h-24 object-cover rounded-lg border"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={() => removeFile(file.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            
            {uploadedFiles.length < 5 && (
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Images ({uploadedFiles.length}/{CONSTANTS.MAX_IMAGES_PER_POST})
              </Button>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!text.trim() || updatePostMutation.isPending}
            >
              {updatePostMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};