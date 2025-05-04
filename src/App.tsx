
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import DashboardV2 from "./pages/dashboard/v0.2";
import Projects from "./pages/Projects";
import ProjectsNew from "./pages/ProjectsNew";
import Teams from "./pages/Teams";
import Schedule from "./pages/Schedule";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import ActionViewer from "./pages/ActionViewer";
import NotFound from "./pages/NotFound";
import PromptHistoryViewer from "./components/prompt-history";
import DebugPage from "./pages/__debug"; // Import the debug page
import Overview from "./pages/Overview"; // Import the new Overview page
import TeamManagement from "./pages/TeamManagement"; // Import our TeamManagement page
import { AuthProvider, useAuth } from "./contexts/AuthContext";

const queryClient = new QueryClient();

// Only show debug route in development
const isDev = process.env.NODE_ENV === 'development';

// Home route component that redirects to Overview page
const HomeRoute = () => {
  return <Navigate to="/overview" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider initialState={false}> {/* Set to false to test unauthenticated flow */}
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="fixed bottom-4 right-4 z-50">
            <PromptHistoryViewer variant="dialog" />
          </div>
          <Routes>
            <Route path="/" element={<HomeRoute />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/dashboard" element={<DashboardV2 />} />
            <Route path="/actions" element={<ActionViewer />} />
            <Route path="/projects-new" element={<ProjectsNew />} />
            <Route path="/teams" element={<TeamManagement />} /> {/* Set /teams to use TeamManagement */}
            {isDev && <Route path="/__debug" element={<DebugPage />} />} {/* Debug route - dev only */}
            <Route path="/" element={<MainLayout />}>
              <Route path="projects" element={<Projects />} />
              <Route path="schedule" element={<Schedule />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
