
// Backward compatibility module for UserContext
// Redirects to the consolidated auth context
import { useAuth } from './auth';

// Provide the same interface for files still importing from UserContext
export const useUser = useAuth;
export default useAuth;
