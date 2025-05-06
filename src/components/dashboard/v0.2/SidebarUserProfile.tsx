
import React from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'react-toastify';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarUserProfileProps {
  collapsed: boolean;
  avatarUrl: string;
  name: string;
  role: string;
}

const SidebarUserProfile: React.FC<SidebarUserProfileProps> = ({
  collapsed,
  avatarUrl,
  name,
  role
}) => {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Successfully logged out');
      // Redirect to homepage instead of login
      window.location.href = `${window.location.origin}/`;
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
    }
  };

  if (collapsed) {
    return (
      <div className="p-4 border-t border-zinc-800/70 flex flex-col items-center gap-2">
        <div className="w-9 h-9 rounded-full bg-zinc-700 flex-shrink-0 overflow-hidden">
          <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
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
    );
  }

  return (
    <div className="p-4 mb-3 border-t border-zinc-800/70">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-9 h-9 rounded-full bg-zinc-700 flex-shrink-0 overflow-hidden">
            <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-white">{name}</div>
            <div className="text-xs text-zinc-400">{role}</div>
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
