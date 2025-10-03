import { useState, useRef } from "react";
import { Plus, Send, X, Loader2 } from "lucide-react";
import { useCreatePost } from "@/entities/post/hooks";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface UploadedFile {
  id: string;
  url: string;
  file: File;
}

interface CreatePostFormProps {
  onSuccess?: () => void;
}

export const CreatePostForm = ({ onSuccess }: CreatePostFormProps) => {
  const [text, setText] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createPostMutation = useCreatePost();
  const { toast } = useToast();
  const isFormEmpty = !text.trim() && uploadedFiles.length === 0;

  const handleSubmit = async () => {
    if (!text.trim()) {
      toast({
        title: "Warning",
        description: "Please enter some content for your post",
        variant: "destructive",
      });
      return;
    }

    try {
      const files = uploadedFiles.map((file) => file.file);

      await createPostMutation.mutateAsync({
        text: text.trim(),
        images: files,
      });

      setText("");
      setUploadedFiles([]);
      toast({ title: "Success", description: "Post created successfully!" });
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    uploadedFiles.forEach((file) => URL.revokeObjectURL(file.url));
    setText("");
    setUploadedFiles([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + uploadedFiles.length > 5) {
      toast({
        title: "Warning",
        description: "Maximum 5 images allowed",
        variant: "destructive",
      });
      return;
    }

    const newFiles = files.map((file) => ({
      id: Math.random().toString(36),
      url: URL.createObjectURL(file),
      file,
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="space-y-4">
          <Textarea
            placeholder="What's on your mind?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            maxLength={1000}
            className="resize-none"
            disabled={createPostMutation.isPending}
          />
          <p className="text-sm text-muted-foreground text-right">
            {text.length}/1000
          </p>

          <div className="space-y-3">
            {uploadedFiles.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="relative">
                    <img
                      src={file.url}
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
                disabled={createPostMutation.isPending}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Images ({uploadedFiles.length}/5)
              </Button>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={handleCancel}
              disabled={isFormEmpty || createPostMutation.isPending}
              className="disabled:cursor-not-allowed"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!text.trim() || createPostMutation.isPending}
            >
              {createPostMutation.isPending ? <Loader2 className="h-4 w-4 mr-2" /> : <Send className="h-4 w-4 mr-2" /> }
              {createPostMutation.isPending ? "Posting..." : "Post"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
