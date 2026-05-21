import { Routes, Route } from 'react-router-dom';
import { VacationsView } from '@/features/vacations/components/VacationsView';
import { VacationDetailPage } from './VacationDetailPage';

export function VacationPage() {
  return (
    <Routes>
      <Route index element={<VacationsView />} />
      <Route path="crear" element={<VacationDetailPage />} />
      <Route path=":id/*" element={<VacationDetailPage />} />
    </Routes>
  );
}
