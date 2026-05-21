import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProviders } from './providers/AppProviders';
import { Navbar } from '@/widgets/navbar/ui/Navbar';
import { HomePage } from '@/pages/home';
import { EmployeePage } from '@/pages/employees/ui/EmployeePage';
import { ClientPage } from '@/pages/clients/ui/ClientPage';
import { ProjectPage } from '@/pages/projects/ui/ProjectPage';
import { CalendarsView } from '@/features/calendars/components/CalendarsView';
import { VacationPage } from '@/pages/vacations/ui/VacationPage';
import { MyVacationsView } from '@/features/myVacations/components/MyVacationsView';
import { ManageVacationsView } from '@/features/manage-vacations/components/ManageVacationsView';
import { AuthView } from '@/features/auth/components/AuthView';
import { useAuth } from '@/features/auth/AuthContext';
import Box from '@mui/material/Box';

function AppContent() {
  const { user, loading } = useAuth();
  
  if (loading) return null; // o un spinner
  
  if (!user) {
    return <AuthView />;
  }

  return (
    <BrowserRouter>
      <Navbar />
      <Box sx={{ pt: 0 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/employees/*" element={<EmployeePage />} />
          <Route path="/clients/*" element={<ClientPage />} />
          <Route path="/projects/*" element={<ProjectPage />} />
          <Route path="/calendars" element={<CalendarsView />} />
          <Route path="/area/vacaciones/*" element={<VacationPage />} />
          <Route path="/area/gestionar-vacaciones" element={<ManageVacationsView />} />
          <Route path="/my-vacations" element={<MyVacationsView />} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
}

export function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}
