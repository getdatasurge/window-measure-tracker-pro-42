
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { LogOut } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { useLogout } from '@/hooks/useLogout';

interface SidebarUserProfileProps {
  collapsed: boolean;
}

const SidebarUserProfile: React.FC<SidebarUserProfileProps> = ({ collapsed }) => {
  const { user, profile, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { logout, isLoggingOut } = useLogout({ redirectUrl: '/' });
  
  // Handle navigation to profile settings
  const handleProfileClick = () => {
    navigate('/user/current/settings');
  };
  
  const handleLogout = async () => {
    await logout();
    setShowLogoutConfirm(false);
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

  // Function to get role badge color
  const getRoleBadgeColor = (role?: string) => {
    if (!role) return "bg-zinc-800 text-zinc-400";
    
    switch (role.toLowerCase()) {
      case 'admin':
        return "bg-red-900/50 text-red-400 border-red-700/50";
      case 'installer':
        return "bg-green-900/50 text-green-400 border-green-700/50";
      case 'manager':
        return "bg-blue-900/50 text-blue-400 border-blue-700/50";
      case 'client':
        return "bg-yellow-900/50 text-yellow-400 border-yellow-700/50";
      default:
        return "bg-zinc-800/50 text-zinc-400 border-zinc-700/50";
    }
  };
  
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
    <>
      <div 
        className={cn(
          "flex items-center p-4 pb-2 mt-auto border-t border-zinc-700/50 cursor-pointer hover:bg-zinc-800/50",
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
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-zinc-200 truncate">
                {firstName || user.email?.split('@')[0] || 'User'}
              </p>
              {profile?.role && (
                <Badge className={`${getRoleBadgeColor(profile.role)} border text-xs px-1.5 py-0.5`}>
                  {profile.role}
                </Badge>
              )}
            </div>
            <span className="text-xs text-zinc-400 truncate">
              {user.email}
            </span>
          </div>
        )}
      </div>
      
      {/* Logout button */}
      <div 
        className={cn(
          "flex items-center px-4 py-2 cursor-pointer hover:bg-zinc-800/50 text-zinc-400 hover:text-red-400 transition-colors",
          collapsed ? "justify-center" : ""
        )}
        onClick={() => setShowLogoutConfirm(true)}
      >
        <LogOut className="w-4 h-4 mr-2" />
        {!collapsed && <span className="text-sm">Logout</span>}
      </div>
      
      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to log out of your account?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} disabled={isLoggingOut}>
              {isLoggingOut ? 'Logging out...' : 'Log Out'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SidebarUserProfile;
