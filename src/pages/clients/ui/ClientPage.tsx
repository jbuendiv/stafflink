import { Routes, Route } from 'react-router-dom';
import { ClientsView } from '@/features/clients/components/ClientsView';
import { ClientDetailPage } from './ClientDetailPage';

export function ClientPage() {
  return (
    <Routes>
      <Route index element={<ClientsView />} />
      <Route path=":id/*" element={<ClientDetailPage />} />
    </Routes>
  );
}
