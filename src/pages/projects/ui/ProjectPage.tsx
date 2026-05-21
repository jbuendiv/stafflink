import { Routes, Route } from 'react-router-dom';
import { ProjectsView } from '@/features/projects/components/ProjectsView';
import { ProjectDetailPage } from './ProjectDetailPage';

export function ProjectPage() {
  return (
    <Routes>
      <Route index element={<ProjectsView />} />
      <Route path=":id/*" element={<ProjectDetailPage />} />
    </Routes>
  );
}
