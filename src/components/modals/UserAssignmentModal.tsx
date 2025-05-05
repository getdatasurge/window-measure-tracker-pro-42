
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ProjectData, ProjectAssignment, useProjects } from '@/hooks/useProjects';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { Loader2 } from 'lucide-react';

interface UserAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectData;
  onAssigned?: () => void;
}

type UserOption = {
  id: string;
  full_name: string | null;
  email: string | null;
};

export function UserAssignmentModal({ 
  isOpen, 
  onClose, 
  project, 
  onAssigned 
}: UserAssignmentModalProps) {
  const { assignUserToProject, loading: assignLoading } = useProjects();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [role, setRole] = useState<string>('member');
  const [users, setUsers] = useState<UserOption[]>([]);
  const [loading, setLoading] = useState(false);
  const { user: currentUser } = useUser();

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch users from the profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .order('full_name');
      
      if (error) {
        throw error;
      }
      
      // Filter out the current user if needed
      const filteredUsers = data as UserOption[];
      
      setUsers(filteredUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedUser || !project.id) return;
    
    const assignment: ProjectAssignment = {
      project_id: project.id,
      user_id: selectedUser,
      role: role
    };
    
    const success = await assignUserToProject(assignment);
    
    if (success) {
      resetForm();
      onClose();
      if (onAssigned) {
        onAssigned();
      }
    }
  };
  
  const resetForm = () => {
    setSelectedUser(null);
    setRole('member');
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign User to Project</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="mb-4">
            <p className="text-sm font-medium mb-1">Project:</p>
            <p className="font-semibold text-lg">{project.name}</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="user">Select User</Label>
            {loading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Loading users...</span>
              </div>
            ) : (
              <Select 
                onValueChange={(value) => setSelectedUser(value)} 
                value={selectedUser || undefined}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.full_name || user.email || 'Unknown user'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select onValueChange={(value) => setRole(value)} defaultValue="member">
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedUser || assignLoading}
          >
            {assignLoading ? "Assigning..." : "Assign User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
