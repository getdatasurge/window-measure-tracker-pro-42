import React from 'react';
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
  if (collapsed) {
    return <div className="p-4 border-t border-zinc-800/70 flex justify-center">
        <div className="w-9 h-9 rounded-full bg-zinc-700 flex-shrink-0 overflow-hidden">
          <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
        </div>
      </div>;
  }
  return <div className="p-4 mb-3 border-t border-zinc-800/70 flex items-center">
      <div className="w-9 h-9 rounded-full bg-zinc-700 flex-shrink-0 overflow-hidden">
        <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="ml-3">
        <div className="text-sm font-medium text-white">{name}</div>
        <div className="text-xs text-zinc-400">{role}</div>
      </div>
    </div>;
};
export default SidebarUserProfile;