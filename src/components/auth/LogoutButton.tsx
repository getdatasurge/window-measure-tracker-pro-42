
import React, { useState } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useLogout } from '@/hooks/useLogout';
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

interface LogoutButtonProps extends Omit<ButtonProps, 'onClick'> {
  redirectUrl?: string;
  showIcon?: boolean;
  confirmationText?: string;
  labelText?: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
  redirectUrl = '/',
  showIcon = true,
  confirmationText = 'Are you sure you want to log out?',
  labelText = 'Log Out',
  className,
  variant = 'ghost',
  size,
  ...props
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { logout, isLoggingOut } = useLogout({ redirectUrl });

  const handleLogoutClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    await logout();
    setShowConfirmation(false);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleLogoutClick}
        disabled={isLoggingOut}
        className={className}
        {...props}
      >
        {showIcon && <LogOut className="mr-2 h-4 w-4" />}
        {labelText}
      </Button>

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmationText}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirm}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? 'Logging out...' : 'Log Out'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default LogoutButton;
