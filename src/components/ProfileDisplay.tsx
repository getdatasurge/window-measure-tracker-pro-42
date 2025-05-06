
import React from 'react';
import { useSessionProfile } from '@/contexts/session-profile';
import { Spinner } from '@/components/ui/spinner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const ProfileDisplay = () => {
  const { user, profile, isLoading, error } = useSessionProfile();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Spinner className="w-6 h-6" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading profile: {error.message}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4 text-zinc-500">
        Please sign in to view your profile
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          {profile?.avatar_url ? (
            <AvatarImage 
              src={`${profile.avatar_url}?t=${new Date().getTime()}`} 
              alt="User avatar" 
            />
          ) : (
            <AvatarFallback className="bg-green-700 text-white">
              {profile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
            </AvatarFallback>
          )}
        </Avatar>
        
        <div>
          <h2 className="text-xl font-semibold">
            {profile?.full_name || user.email?.split('@')[0] || 'User'}
          </h2>
          <p className="text-sm text-zinc-500">{user.email}</p>
          {profile?.role && (
            <p className="text-xs text-zinc-400 mt-1">{profile.role}</p>
          )}
        </div>
      </div>
    </div>
  );
};
