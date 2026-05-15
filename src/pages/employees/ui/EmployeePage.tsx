import { Routes, Route } from 'react-router-dom';
import { EmployeeList } from '@/features/manage-employee';
import { EmployeeCreatePage } from './EmployeeCreatePage';
import { EmployeeEditPage } from './EmployeeEditPage';
import { EmployeeDetailPage } from './EmployeeDetailPage';

export const EmployeePage = () => {
  return (
    <Routes>
      <Route index element={<EmployeeList />} />
      <Route path="create" element={<EmployeeCreatePage />} />
      <Route path="edit/:id" element={<EmployeeEditPage />} />
      <Route path=":id" element={<EmployeeDetailPage />} />
    </Routes>
  );
};
