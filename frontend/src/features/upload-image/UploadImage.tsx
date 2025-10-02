import { useState, useRef } from "react";
import { Plus, Loader2 } from "lucide-react";
import { useUploadAvatar } from "@/entities/user/hooks";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { config } from "@/shared/config";

interface UploadImageProps {
  onSuccess?: (url: string) => void;
  currentImage?: string;
}

export const UploadImage = ({ onSuccess, currentImage }: UploadImageProps) => {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadAvatarMutation = useUploadAvatar();
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      toast({
        title: "Error",
        description: "You can only upload image files!",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (< 2MB)
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      toast({
        title: "Error",
        description: "Image must be smaller than 2MB!",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const updatedUser = await uploadAvatarMutation.mutateAsync(file);
      const absoluteUrl = updatedUser?.avatarUrl
        ? `${config.API_BASE_URL}${updatedUser.avatarUrl}`
        : "";
      onSuccess?.(absoluteUrl);
      toast({ title: "Success", description: "Image uploaded successfully!" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Upload failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div
        className="cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        {currentImage ? (
          <Avatar className="h-24 w-24 border-4 border-background shadow-glow">
            <AvatarImage src={currentImage} alt="Avatar" />
            <AvatarFallback>
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Plus className="h-6 w-6" />
              )}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="h-24 w-24 border-4 border-background shadow-glow rounded-full bg-muted flex items-center justify-center">
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <Plus className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
