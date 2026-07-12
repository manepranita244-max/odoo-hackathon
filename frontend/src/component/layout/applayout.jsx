import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

const AppLayout = () => {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <TopNavbar />
        <div className="page-fade">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
