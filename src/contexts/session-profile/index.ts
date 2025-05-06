
// Backward compatibility module for session-profile
// Redirects to the consolidated auth context
import { useAuth } from '../auth';

// Provide the same interface for files still importing from session-profile
export const useSessionProfile = useAuth;
