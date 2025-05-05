import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserProvider } from "./contexts/UserContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";

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

const queryClient = new QueryClient();

// Only show debug route in development
const isDev = process.env.NODE_ENV === 'development';

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <UserProvider>
          <AuthProvider initialState={false}>
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
            <BrowserRouter>
              <div className="fixed bottom-4 right-4 z-50">
                <PromptHistoryViewer variant="dialog" />
              </div>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/landing" element={<Navigate to="/" replace />} />
                <Route path="/overview" element={<Overview />} />
                <Route path="/dashboard" element={<DashboardV2 />} />
                <Route path="/actions" element={<ActionViewer />} />
                <Route path="/projects-new" element={<ProjectsNew />} />
                <Route path="/teams" element={<TeamManagement />} /> 
                <Route path="/schedule" element={<SchedulePage />} /> 
                <Route path="/reports" element={<ReportsNew />} />
                <Route path="/measurements" element={<Measurements />} />
                <Route path="/user/:id/settings" element={<UserSettingsPage />} />
                {isDev && <Route path="/__debug" element={<DebugPage />} />} 
                <Route path="/" element={<MainLayout />}>
                  <Route path="projects" element={<Projects />} />
                  <Route path="reports-old" element={<Reports />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </UserProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
