import { QueryProvider } from './providers/QueryProvider';
import { Toaster } from '../shared/ui/toaster';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NotFound from '@/pages/NotFound';
import { FeedPage } from '@/pages/FeedPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ProtectedRoute from '@/shared/components/ProtectedRoute';

const App = () => {
  return (
    <QueryProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<FeedPage />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<RegisterPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </QueryProvider>
  );
};

export default App;