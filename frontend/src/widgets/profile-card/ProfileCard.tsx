import { useState, useRef, useEffect } from 'react';
import { Edit, User, Mail, Phone, Calendar, Loader2, LogOut } from 'lucide-react';
import { useUserProfile } from '@/entities/user/hooks';
import { EditProfileModal } from '@/features/edit-profile/EditProfileModal';
import { UploadImage } from '@/features/upload-image/UploadImage';
import { formatDate } from '@/shared/lib/utils';
import { Card, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/shared/ui/avatar';
import { Separator } from '@/shared/ui/separator';
import { config } from '@/shared/config';
import { authApi } from '@/features/auth/api';
import { getAuthStore } from '@/features/auth/store';

export const ProfileCard = () => {
  const { data: user, isLoading } = useUserProfile();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const avatarRef = useRef<HTMLDivElement>(null);

  //Listen for clicks outside the avatar block
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(event.target as Node)) {
        setShowUpload(false); // hide uploader, show avatar
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!user) return null;

  const fullName = `${user.firstName} ${user.lastName}`;

  const handleLogout = async () => {
    try {
      const res = await authApi.logout();
      if (res.ok) getAuthStore().logout();
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <>
      <Card className="w-full shadow-elegant">
        <div className="bg-gradient-primary h-32 relative rounded-t-lg">
          <div className="absolute -bottom-12 left-6">
            <div
              ref={avatarRef}
              className="relative cursor-pointer"
              onClick={() => setShowUpload(true)} // on click show uploader
            >
              {showUpload ? (
                <UploadImage
                  currentImage={user.avatarUrl}
                  onSuccess={() => setShowUpload(false)} // after upload — back to avatar
                />
              ) : (
                <Avatar className="h-24 w-24 border-4 border-background shadow-glow">
                  <AvatarImage
                    src={`${config.API_BASE_URL}${user.avatarUrl}`}
                    alt={fullName}
                  />
                  <AvatarFallback>
                    <User className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>
        </div>

        <CardContent className="pt-14 pb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-1">{fullName}</h3>
            </div>
            <div className="flex gap-1">
              <Button onClick={() => setIsEditModalOpen(true)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {user.about && (
            <>
              <Separator className="my-4" />
              <div className="mb-4">
                <h5 className="text-lg font-medium mb-2">About Me</h5>
                <p className="text-muted-foreground leading-relaxed">{user.about}</p>
              </div>
            </>
          )}

          <Separator className="my-4" />
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{user.phone}</span>
              </div>
            )}
            {user.birthDate && (
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">
                  {formatDate(user.birthDate, 'birth')}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <EditProfileModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
      />
    </>
  );
};
