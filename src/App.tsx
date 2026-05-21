import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProviders } from '@/app/providers/AppProviders';
import { Navbar } from '@/widgets/navbar';
import { HomePage } from '@/pages/home';
import { EmployeePage } from '@/pages/employees';
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
      </BrowserRouter>
    </AppProviders>
  );
}
