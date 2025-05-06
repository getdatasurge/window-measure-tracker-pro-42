
import React, { useEffect } from 'react';
import { LogOut, User, AlertCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from '@/contexts/auth/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface SidebarUserProfileProps {
  collapsed: boolean;
}

const SidebarUserProfile: React.FC<SidebarUserProfileProps> = ({
  collapsed
}) => {
  const navigate = useNavigate();
  const { signOut, profile, loading, refreshProfile, profileNotFound } = useAuth();
  
  // Fetch profile data when component mounts
  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  // Generate initials from full name
  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Default avatar placeholder if no custom avatar is provided
  const avatarUrl = "/lovable-uploads/75ba837b-8924-4c3d-a163-ab9116a7c9fb.png";
  
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
    }
  };

  const handleRetryProfileFetch = () => {
    toast.info('Refreshing profile data...');
    refreshProfile();
  };

  if (collapsed) {
    return (
      <div className="p-4 border-t border-zinc-800/70 flex flex-col items-center gap-2">
        <div className="w-9 h-9 rounded-full bg-zinc-700 flex-shrink-0 overflow-hidden">
          <Avatar>
            <AvatarImage src={avatarUrl} alt={profile?.full_name || 'User'} />
            <AvatarFallback>{profile?.full_name ? getInitials(profile.full_name) : 'U'}</AvatarFallback>
          </Avatar>
        </div>
        
        {profileNotFound && !loading && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={handleRetryProfileFetch}
                  className="text-amber-400 hover:text-amber-300 p-1.5 rounded-md hover:bg-zinc-800 transition-colors"
                >
                  <RefreshCw size={16} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh profile</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300 p-1.5 rounded-md hover:bg-zinc-800 transition-colors"
                aria-label="Log out"
              >
                <LogOut size={16} />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Sign out</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  return (
    <div className="p-4 mb-3 border-t border-zinc-800/70">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-9 h-9 rounded-full bg-zinc-700 flex-shrink-0 overflow-hidden">
            <Avatar>
              <AvatarImage src={avatarUrl} alt={profile?.full_name || 'User'} />
              <AvatarFallback>{profile?.full_name ? getInitials(profile.full_name) : 'U'}</AvatarFallback>
            </Avatar>
          </div>
          <div className="ml-3">
            {loading ? (
              <>
                <Skeleton className="h-4 w-20 mb-1" />
                <Skeleton className="h-3 w-16" />
              </>
            ) : profileNotFound ? (
              <div className="flex flex-col">
                <div className="text-sm font-medium text-amber-400 flex items-center gap-1">
                  <AlertCircle size={12} />
                  <span>Profile loading...</span>
                </div>
                <button 
                  onClick={handleRetryProfileFetch}
                  className="text-xs text-zinc-400 hover:text-zinc-300 flex items-center gap-1 mt-1"
                >
                  <RefreshCw size={10} />
                  <span>Retry</span>
                </button>
              </div>
            ) : (
              <>
                <div className="text-sm font-medium text-white">{profile?.full_name || 'User'}</div>
                {profile?.role && (
                  <div className="text-xs text-zinc-400">{profile.role}</div>
                )}
              </>
            )}
          </div>
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300 p-1.5 rounded-md hover:bg-zinc-800 transition-colors"
                aria-label="Log out"
              >
                <LogOut size={16} />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Sign out</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default SidebarUserProfile;
