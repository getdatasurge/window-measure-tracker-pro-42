
import React from 'react';
import { useSessionProfile } from '@/contexts/session-profile';
import { Spinner } from '@/components/ui/spinner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export const ProfileDisplay = () => {
  const { user, profile, isLoading, error } = useSessionProfile();

  // Function to get role badge color
  const getRoleBadgeColor = (role?: string) => {
    if (!role) return "bg-zinc-800 text-zinc-400";
    
    switch (role.toLowerCase()) {
      case 'admin':
        return "bg-red-900/30 text-red-400 border-red-700/30";
      case 'installer':
        return "bg-green-900/30 text-green-400 border-green-700/30";
      case 'manager':
        return "bg-blue-900/30 text-blue-400 border-blue-700/30";
      case 'client':
        return "bg-yellow-900/30 text-yellow-400 border-yellow-700/30";
      default:
        return "bg-zinc-800 text-zinc-300 border-zinc-700/30";
    }
  };

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
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">
              {profile?.full_name || user.email?.split('@')[0] || 'User'}
            </h2>
            {profile?.role && (
              <Badge className={`${getRoleBadgeColor(profile.role)} border text-xs`}>
                {profile.role}
              </Badge>
            )}
          </div>
          <p className="text-sm text-zinc-500">{user.email}</p>
        </div>
      </div>
    </div>
  );
};
