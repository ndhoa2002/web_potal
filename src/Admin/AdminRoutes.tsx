
import { Routes, Route, Navigate } from 'react-router-dom';
import { CreateArticle } from './CreateArticle';
import { Feedback } from './Feedback';

export const AdminRoutes = () => (
  <Routes>
    <Route path="create-article" element={<CreateArticle />} />
    <Route path="feedback" element={<Feedback />} />
    <Route path="*" element={<Navigate to="create-article" replace />} />
  </Routes>
);
