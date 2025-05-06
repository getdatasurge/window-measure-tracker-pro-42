
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface SidebarUserProfileProps {
  collapsed: boolean;
}

const SidebarUserProfile: React.FC<SidebarUserProfileProps> = ({ collapsed }) => {
  const { user, profile, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // Handle navigation to profile settings
  const handleProfileClick = () => {
    navigate('/user/current/settings');
  };
  
  // Add a cache busting parameter to prevent stale avatar images
  const avatarUrl = profile?.avatar_url 
    ? `${profile.avatar_url}?t=${new Date().getTime()}`
    : undefined;
  
  // Extract first name and initials for display
  let firstName = '';
  let initials = '';
  
  if (profile?.full_name) {
    const nameParts = profile.full_name.split(' ');
    firstName = nameParts[0];
    
    // Get initials from first and last name
    initials = nameParts[0].charAt(0).toUpperCase();
    if (nameParts.length > 1) {
      initials += nameParts[nameParts.length - 1].charAt(0).toUpperCase();
    }
  }
  
  if (isLoading) {
    return (
      <div className={cn(
        "flex items-center p-4 mt-auto border-t border-zinc-700/50",
        collapsed ? "justify-center" : "justify-between"
      )}>
        <div className="w-8 h-8 rounded-full bg-zinc-800 animate-pulse"></div>
        {!collapsed && <div className="w-20 h-4 bg-zinc-800 rounded animate-pulse"></div>}
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className={cn(
        "flex items-center p-4 mt-auto border-t border-zinc-700/50",
        collapsed ? "justify-center" : "justify-between"
      )}
      onClick={() => navigate('/login')}
      >
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-zinc-800 text-zinc-400">?</AvatarFallback>
        </Avatar>
        {!collapsed && (
          <div className="flex flex-col">
            <p className="text-sm font-medium text-zinc-400">Sign In</p>
            <span className="text-xs text-zinc-500">Log in to account</span>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div 
      className={cn(
        "flex items-center p-4 mt-auto border-t border-zinc-700/50 cursor-pointer hover:bg-zinc-800/50",
        collapsed ? "justify-center" : "justify-between"
      )}
      onClick={handleProfileClick}
    >
      <Avatar className="h-8 w-8">
        {avatarUrl ? (
          <AvatarImage src={avatarUrl} alt="User avatar" />
        ) : (
          <AvatarFallback className="bg-green-700 text-white">
            {initials || "U"}
          </AvatarFallback>
        )}
      </Avatar>
      
      {!collapsed && (
        <div className="flex flex-col flex-grow ml-3">
          <p className="text-sm font-medium text-zinc-200 truncate">
            {firstName || user.email?.split('@')[0] || 'User'}
          </p>
          <span className="text-xs text-zinc-400 truncate">
            {profile?.role || 'User'}
          </span>
        </div>
      )}
    </div>
  );
};

export default SidebarUserProfile;
