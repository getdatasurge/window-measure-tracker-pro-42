
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/auth';

// Pages
import Dashboard from '@/pages/Dashboard';
import Projects from '@/pages/Projects';
import Settings from '@/pages/Settings';
import Measurements from '@/pages/Measurements';
import MeasurementEntries from '@/pages/MeasurementEntries';
import Schedule from '@/pages/Schedule';
import Teams from '@/pages/Teams';
import Reports from '@/pages/Reports';
import NotFound from '@/pages/NotFound';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: true,
      refetchOnMount: true
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/measurements" element={<Measurements />} />
              <Route path="/measurement-entries" element={<MeasurementEntries />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
