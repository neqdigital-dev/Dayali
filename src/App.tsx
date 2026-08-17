import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import ToastContainer from './components/ui/ToastContainer';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Agenda from './pages/Agenda';
import College from './pages/College';
import Church from './pages/Church';
import History from './pages/History';
import Settings from './pages/Settings';
import Login from './pages/Login';
import { useAuthStore } from './stores/useAuthStore';

function App() {
  const { initialized, initialize } = useAuthStore();

  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialized, initialize]);

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/college" element={<College />} />
            <Route path="/church" element={<Church />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
