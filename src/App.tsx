import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProviders } from '@/app/providers/AppProviders';
import { Navbar } from '@/widgets/navbar';
import { HomePage } from '@/pages/home';
import { EmployeePage } from '@/pages/employees';
import { SearchEmployeesPage } from '@/pages/search-employees';
import { ClientsView } from '@/features/clients/components/ClientsView';
import { ProjectsView } from '@/features/projects/components/ProjectsView';
import { CalendarsView } from '@/features/calendars/components/CalendarsView';
import { VacationsView } from '@/features/vacations/components/VacationsView';
import { MyVacationsView } from '@/features/myVacations/components/MyVacationsView';
import { ManageVacationsView } from '@/features/manage-vacations/components/ManageVacationsView';
import Box from '@mui/material/Box';

export default function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <Navbar />
        <Box sx={{ pt: 0 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/employees/*" element={<EmployeePage />} />
            <Route path="/search-employees" element={<SearchEmployeesPage />} />
            <Route path="/clients" element={<ClientsView />} />
            <Route path="/projects" element={<ProjectsView />} />
            <Route path="/calendars" element={<CalendarsView />} />
            <Route path="/area/vacaciones" element={<VacationsView />} />
            <Route path="/area/gestionar-vacaciones" element={<ManageVacationsView />} />
            <Route path="/my-vacations" element={<MyVacationsView />} />
          </Routes>
        </Box>
      </BrowserRouter>
    </AppProviders>
  );
}
