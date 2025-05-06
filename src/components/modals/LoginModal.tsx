import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useAuthModalStore from '@/stores/useAuthModalStore';
import { Github, Mail } from 'lucide-react';
import { toast } from 'react-toastify';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';

const LoginModal = () => {
  const { isLoginOpen, closeAll, openSignup } = useAuthModalStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Get redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error message when user starts typing
    if (errorMessage) setErrorMessage(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.email || !formData.password) {
      setErrorMessage('Email and password are required');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      
      if (error) {
        throw error;
      }
      
      if (data?.session) {
        toast.success('Logged in successfully!');
        closeAll();
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      setErrorMessage(error.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = (provider: 'google' | 'github') => {
    // First, close the modal to prevent DOM context issues
    closeAll();
    
    // Define the redirect URL - using the production URL in production or origin in development
    const redirectUrl = 'https://app.getdatasurge.com/auth-callback';
    
    // Store the redirect path in localStorage for when the user returns
    localStorage.setItem('authRedirectTo', from);
    
    // Use direct window location for OAuth redirect to avoid iframe/modal restrictions
    window.location.href = `https://bvipslspkgbjovgztubb.supabase.co/auth/v1/authorize?provider=${provider}&redirect_to=${encodeURIComponent(redirectUrl)}`;
  };

  const handleSignupClick = () => {
    openSignup();
  };

  return (
    <Dialog open={isLoginOpen} onOpenChange={(open) => !open && closeAll()}>
      <DialogContent className="sm:max-w-md bg-zinc-900 text-white border border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold">
            Sign In
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 flex items-center justify-center gap-2"
              onClick={() => handleOAuthLogin('google')}
              disabled={isLoading}
            >
              <Mail size={18} /> Google
            </Button>
            <Button 
              variant="outline" 
              className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 flex items-center justify-center gap-2"
              onClick={() => handleOAuthLogin('github')}
              disabled={isLoading}
            >
              <Github size={18} /> GitHub
            </Button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full border-zinc-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-zinc-900 px-2 text-zinc-400">or continue with email</span>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-900/30 border border-red-800 text-red-200 px-4 py-2 rounded text-sm">
              {errorMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-2">
              <div className="flex justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-xs text-green-500 hover:underline">
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-green-500 hover:bg-green-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Spinner className="h-4 w-4 text-white" />
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Mail size={16} />
                  <span>Sign in with Email</span>
                </div>
              )}
            </Button>
          </form>

          {/* Signup Link */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-zinc-500">Don't have an account?</div>
            <button 
              onClick={handleSignupClick}
              className="text-sm text-green-500 hover:text-green-400 cursor-pointer"
              disabled={isLoading}
            >
              Sign up
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
