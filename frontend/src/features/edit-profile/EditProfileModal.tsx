import { useState, useEffect, useRef } from "react";
import { UpdateUserRequest, User } from "@/entities/user/types";
import { useUpdateProfile, useUploadAvatar } from "@/entities/user/hooks";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Label } from "@/shared/ui/label";
import { useToast } from "@/hooks/use-toast";
import { config } from "@/shared/config";

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
}

export const EditProfileModal = ({
  open,
  onClose,
  user,
}: EditProfileModalProps) => {
  const [formData, setFormData] = useState<UpdateUserRequest>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthDate: "",
    about: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateProfileMutation = useUpdateProfile();
  const uploadAvatarMutation = useUploadAvatar();
  const { toast } = useToast();

  useEffect(() => {
    if (user && open) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || "",
        birthDate: user.birthDate || "",
        about: user.about || "",
      });
      setAvatarFile(null);
      setAvatarPreview(null);
    }
  }, [user, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfileMutation.mutateAsync(formData);
      toast({ title: "Success", description: "Profile updated successfully!" });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    // Show instant preview
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));

    try {
      await uploadAvatarMutation.mutateAsync(file);
      setAvatarFile(null);
      setAvatarPreview(null);
      toast({ title: "Success", description: "Avatar updated successfully!" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload avatar",
        variant: "destructive",
      });
    } finally {
      // reset the input so selecting the same file again still triggers change
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const currentAvatarSrc = user?.avatarUrl
    ? `${config.API_BASE_URL}${user.avatarUrl}`
    : undefined;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 mt-2">
          <Label>Avatar</Label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleAvatarClick}
              className="rounded-full"
            >
              <img
                src={
                  avatarPreview ||
                  currentAvatarSrc ||
                  "https://via.placeholder.com/96x96?text=Avatar"
                }
                alt="Avatar preview"
                className="w-24 h-24 rounded-full object-cover border"
              />
            </button>
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              {/* Optional manual upload button fallback */}
              <Button
                type="button"
                onClick={handleAvatarClick}
                disabled={uploadAvatarMutation.isPending}
              >
                {uploadAvatarMutation.isPending
                  ? "Uploading..."
                  : "Change Avatar"}
              </Button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    firstName: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, lastName: e.target.value }))
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthDate">Birth Date</Label>
            <Input
              id="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, birthDate: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="about">About Me</Label>
            <Textarea
              id="about"
              value={formData.about}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, about: e.target.value }))
              }
              rows={4}
              maxLength={500}
            />
            <p className="text-sm text-muted-foreground">
              {formData.about.length}/500
            </p>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateProfileMutation.isPending}>
              {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
