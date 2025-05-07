
/**
 * Utility function that thoroughly cleans up all Supabase auth-related
 * storage items to prevent authentication limbo states
 */
export const cleanupAuthState = () => {
  console.debug('[Auth] Cleaning up auth state');

  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  // Remove from sessionStorage if in use
  try {
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  } catch (e) {
    // Ignore errors with sessionStorage (may not be available in some contexts)
  }
};
