
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserProvider } from "./contexts/UserContext";
import { AuthProvider } from "./contexts/auth/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useEffect } from "react";
import { enableFeedbucketInteraction } from "./utils/feedbucket-patch";
import { setupConsoleErrorTracker } from "./utils/console-error-tracker";

import MainLayout from "./components/layout/MainLayout";
import LandingPage from "./pages/Landing";
import DashboardV2 from "./pages/dashboard/v0.2";
import Projects from "./pages/Projects";
import ProjectsNew from "./pages/ProjectsNew";
import Teams from "./pages/Teams";
import SchedulePage from "./pages/SchedulePage"; 
import ReportsNew from "./pages/ReportsNew";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import UserSettingsPage from "./pages/User/[id]/settings";
import ActionViewer from "./pages/ActionViewer";
import NotFound from "./pages/NotFound";
import PromptHistoryViewer from "./components/prompt-history";
import DebugPage from "./pages/__debug"; 
import Overview from "./pages/Overview"; 
import TeamManagement from "./pages/TeamManagement"; 
import Measurements from "./pages/Measurements"; 
import MeasurementEntries from "./pages/MeasurementEntries";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import SignInPage from "./pages/SignInPage";
import LoginModal from "./components/modals/LoginModal";
import SignupModal from "./components/modals/SignupModal";
import AuthCallback from "./pages/AuthCallback";

const queryClient = new QueryClient();

// Only show debug route in development
const isDev = process.env.NODE_ENV === 'development';

const App = () => {
  // Initialize the feedbucket patch when the app mounts
  useEffect(() => {
    const feedbucketCleanup = enableFeedbucketInteraction();
    
    // Setup console error tracker
    const errorTrackerCleanup = setupConsoleErrorTracker({
      timeWindow: 30000, // 30 seconds
      maxErrors: 15,     // Maximum errors before showing toast
      showOnce: true     // Only show the toast once per session
    });
    
    return () => {
      feedbucketCleanup();
      errorTrackerCleanup();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <BrowserRouter>
            <AuthProvider>
              <UserProvider>
                <Toaster />
                <Sonner />
                <ToastContainer
                  position="top-center"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop
                  closeOnClick
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="dark"
                />
                <div className="fixed bottom-4 right-4 z-50">
                  <PromptHistoryViewer variant="dialog" />
                </div>
                
                {/* Global modals */}
                <LoginModal />
                <SignupModal />
                
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/landing" element={<Navigate to="/" replace />} />
                  <Route path="/sign-in" element={<SignInPage />} />
                  <Route path="/auth-callback" element={<AuthCallback />} />

                  {/* Protected Routes */}
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <DashboardV2 />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/overview" 
                    element={
                      <ProtectedRoute>
                        <Overview />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/actions" 
                    element={
                      <ProtectedRoute>
                        <ActionViewer />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/projects-new" 
                    element={
                      <ProtectedRoute>
                        <ProjectsNew />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/teams" 
                    element={
                      <ProtectedRoute>
                        <TeamManagement />
                      </ProtectedRoute>
                    } 
                  /> 
                  <Route 
                    path="/schedule" 
                    element={
                      <ProtectedRoute>
                        <SchedulePage />
                      </ProtectedRoute>
                    } 
                  /> 
                  <Route 
                    path="/reports" 
                    element={
                      <ProtectedRoute>
                        <ReportsNew />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/measurements" 
                    element={
                      <ProtectedRoute>
                        <Measurements />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/measurement-entries" 
                    element={
                      <ProtectedRoute>
                        <MeasurementEntries />
                      </ProtectedRoute>
                    } 
                  /> 
                  <Route 
                    path="/user/:id/settings" 
                    element={
                      <ProtectedRoute>
                        <UserSettingsPage />
                      </ProtectedRoute>
                    } 
                  />
                  {isDev && (
                    <Route 
                      path="/__debug" 
                      element={
                        <ProtectedRoute>
                          <DebugPage />
                        </ProtectedRoute>
                      } 
                    />
                  )} 

                  {/* Layout Routes with Protection */}
                  <Route 
                    path="/" 
                    element={
                      <ProtectedRoute>
                        <MainLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route path="projects" element={<Projects />} />
                    <Route path="reports-old" element={<Reports />} />
                    <Route path="settings" element={<Settings />} />
                  </Route>
                  
                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </UserProvider>
            </AuthProvider>
          </BrowserRouter>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
