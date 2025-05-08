
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from "./contexts/ThemeContext";
import { useEffect } from "react";
import { enableFeedbucketInteraction } from "./utils/feedbucket-patch";
import { setupConsoleErrorTracker } from "./utils/console-error-tracker";
import { setupRealtime } from "./utils/setupRealtime";
import { FloatingMeasurementTools } from "./components/measurements/FloatingMeasurementTools";
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

// Create a new QueryClient instance with custom options for better invalidation handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
});

// Only show debug route in development
const isDev = process.env.NODE_ENV === 'development';

const App = () => {
  // Initialize the feedbucket patch when the app mounts
  useEffect(() => {
    const feedbucketCleanup = enableFeedbucketInteraction();

    // Setup console error tracker
    const errorTrackerCleanup = setupConsoleErrorTracker({
      timeWindow: 30000, // 30 seconds
      maxErrors: 15, // Maximum errors before showing toast
      showOnce: true // Only show the toast once per session
    });
    
    // Setup realtime subscriptions
    setupRealtime().then(success => {
      if (success) {
        console.log('Realtime enabled successfully');
      } else {
        console.warn('Realtime setup may not be complete');
      }
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
            
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/landing" element={<Navigate to="/" replace />} />
              
              {/* Main Routes - All available without authentication */}
              <Route path="/dashboard" element={<DashboardV2 />} />
              <Route path="/overview" element={<Overview />} />
              <Route path="/actions" element={<ActionViewer />} />
              <Route path="/projects-new" element={<ProjectsNew />} />
              <Route path="/teams" element={<TeamManagement />} />
              <Route path="/schedule" element={<SchedulePage />} />
              <Route path="/reports" element={<ReportsNew />} />
              <Route path="/measurements" element={<Measurements />} />
              <Route path="/measurement-entries" element={<MeasurementEntries />} />
              <Route path="/user/:id/settings" element={<UserSettingsPage />} />
              {isDev && <Route path="/__debug" element={<DebugPage />} />}
              
              {/* Nested Layout Route - Only for components that need the sidebar */}
              <Route path="/" element={<MainLayout />}>
                <Route path="projects" element={<Projects />} />
                <Route path="reports-old" element={<Reports />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            
            {/* Add FloatingMeasurementTools at the app root level */}
            <FloatingMeasurementTools />
          </BrowserRouter>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
