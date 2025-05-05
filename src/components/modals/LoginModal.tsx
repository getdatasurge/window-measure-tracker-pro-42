
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import useAuthModalStore from '@/stores/useAuthModalStore';
import { Google, Github } from 'lucide-react';
import { toast } from 'react-toastify';

const LoginModal = () => {
  const { isLoginOpen, closeAll, openSignup } = useAuthModalStore();
  const { login, loginWithOAuth } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.email || !formData.password) {
      toast.error('Email and password are required');
      return;
    }

    try {
      setIsLoading(true);
      await login(formData.email, formData.password);
      closeAll();
    } catch (error) {
      console.error('Login failed:', error);
      // Error is shown via toast in the auth context
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = (provider: string) => {
    try {
      loginWithOAuth(provider);
    } catch (error) {
      console.error(`${provider} login failed:`, error);
    }
  };

  const handleSignupClick = () => {
    openSignup();
  };

  return (
    <Dialog open={isLoginOpen} onOpenChange={closeAll}>
      <DialogContent className="sm:max-w-md bg-zinc-900 text-white border border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold">
            Login Form
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 flex items-center justify-center gap-2"
              onClick={() => handleOAuthLogin('google')}
            >
              <Google size={18} /> Google
            </Button>
            <Button 
              variant="outline" 
              className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 flex items-center justify-center gap-2"
              onClick={() => handleOAuthLogin('github')}
            >
              <Github size={18} /> GitHub
            </Button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-700"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-zinc-900 px-2 text-zinc-400">or continue with</span>
            </div>
          </div>

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
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          {/* Signup Link */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-zinc-500">OR</div>
            <div>
              <span className="text-sm text-zinc-400">
                Don't have an account?
              </span>
              <button 
                onClick={handleSignupClick}
                className="ml-2 text-sm text-green-500 hover:text-green-400 cursor-pointer"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
