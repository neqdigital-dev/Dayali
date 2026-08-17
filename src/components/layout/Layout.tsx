import { Outlet } from 'react-router';
import Sidebar from './Sidebar';
import Header from './Header';
import ToastContainer from '../ui/ToastContainer';

export default function Layout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">
        <Header />
        <div className="app-content">
          <Outlet />
        </div>
      </main>
      <ToastContainer />
    </div>
  );
}
