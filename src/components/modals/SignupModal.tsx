
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useAuthModalStore from '@/stores/useAuthModalStore';
import { Github, Mail } from 'lucide-react';
import { toast } from 'react-toastify';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Separator } from '@/components/ui/separator';

// Form validation schema
const signupSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string(),
  birthday: z.string().min(1, { message: 'Birthday is required' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

const SignupModal = () => {
  const { isSignupOpen, closeAll, openLogin } = useAuthModalStore();
  const { refreshProfile } = useUser();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [oauthError, setOauthError] = useState<string | null>(null);

  // Initialize form with react-hook-form and zod validation
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      birthday: '',
    },
  });

  const handleSignup = async (values: SignupFormValues) => {
    try {
      setIsLoading(true);
      
      // Register the new user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.name,
            birthday: values.birthday,
          },
          emailRedirectTo: `${window.location.origin}/auth-callback?redirect=/dashboard`
        }
      });
      
      if (error) {
        throw error;
      }

      // Check if session exists (auto sign-in)
      if (data?.session) {
        toast.success('Account created and logged in successfully!');
        await refreshProfile(); // Refresh user profile data
        closeAll();
        navigate('/dashboard'); // Redirect to dashboard
      } else if (data?.user) {
        // User created but email confirmation required
        toast.info('Account created! Please check your email to confirm your signup before logging in.');
        closeAll();
      }
    } catch (error: any) {
      console.error('Signup failed:', error);
      if (error.message.includes('already registered')) {
        toast.error('This email is already registered. Please log in instead.');
      } else {
        toast.error(error.message || 'Failed to create account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignup = async (provider: 'google' | 'github') => {
    try {
      setIsLoading(true);
      setOauthError(null);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/auth-callback?redirect=/dashboard`,
        }
      });
      
      if (error) {
        throw error;
      }
      
      // No need to navigate manually, the redirect URL will be handled by Supabase OAuth flow
    } catch (error: any) {
      console.error(`${provider} signup failed:`, error);
      setOauthError(error.message || `Failed to signup with ${provider}`);
      setIsLoading(false);
    }
  };

  const handleLoginClick = () => {
    openLogin();
  };

  return (
    <Dialog open={isSignupOpen} onOpenChange={(open) => !open && closeAll()}>
      <DialogContent className="sm:max-w-md bg-zinc-900 text-white border border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold">
            Create an account
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 flex items-center justify-center gap-2"
              onClick={() => handleOAuthSignup('google')}
              disabled={isLoading}
            >
              <Mail size={18} /> Google
            </Button>
            <Button 
              variant="outline" 
              className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 flex items-center justify-center gap-2"
              onClick={() => handleOAuthSignup('github')}
              disabled={isLoading}
            >
              <Github size={18} /> GitHub
            </Button>
          </div>

          {/* Display OAuth Error if any */}
          {oauthError && (
            <div className="bg-red-900/30 border border-red-800 text-red-200 px-4 py-2 rounded text-sm">
              {oauthError}
            </div>
          )}

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full border-zinc-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-zinc-900 px-2 text-zinc-400">or continue with email</span>
            </div>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSignup)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="John Doe"
                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="name@example.com"
                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birthday"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Birthday</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="date"
                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="••••••••"
                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="••••••••"
                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-green-500 hover:bg-green-600 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </div>
                ) : 'Create Account'}
              </Button>
            </form>
          </Form>

          {/* Login Link */}
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-zinc-400">
              Already have an account?
            </span>
            <button 
              onClick={handleLoginClick}
              className="text-sm text-green-500 hover:text-green-400 cursor-pointer"
              disabled={isLoading}
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
