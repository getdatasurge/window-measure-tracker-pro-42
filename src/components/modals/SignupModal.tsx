
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import useAuthModalStore from '@/stores/useAuthModalStore';
import { Github } from 'lucide-react';
import { toast } from 'react-toastify';

const SignupModal = () => {
  const { isSignupOpen, closeAll, openLogin } = useAuthModalStore();
  const { signup, loginWithOAuth } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthday: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.birthday) {
      toast.error('All fields are required');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      await signup(formData.email, formData.password, formData.name);
      closeAll();
    } catch (error) {
      console.error('Signup failed:', error);
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

  const handleLoginClick = () => {
    openLogin();
  };

  return (
    <Dialog open={isSignupOpen} onOpenChange={closeAll}>
      <DialogContent className="sm:max-w-md bg-zinc-900 text-white border border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold">
            Signup Form
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
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 12 h8"></path>
                <path d="M12 8 v8"></path>
              </svg> Google
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
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

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
              <Label htmlFor="birthday">Birthday</Label>
              <Input
                id="birthday"
                name="birthday"
                type="date"
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
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

            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
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
              {isLoading ? 'Creating...' : 'Create Account'}
            </Button>
          </form>

          {/* Login Link */}
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-zinc-400">
              Already have an account?
            </span>
            <button 
              onClick={handleLoginClick}
              className="text-sm text-green-500 hover:text-green-400 cursor-pointer"
            >
              Log in
            </button>
          </div>
          
          {/* Terms */}
          <p className="text-xs text-zinc-400 text-center">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-green-500 hover:underline">Terms of Service</a>{' '}
            and{' '}
            <a href="#" className="text-green-500 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignupModal;
