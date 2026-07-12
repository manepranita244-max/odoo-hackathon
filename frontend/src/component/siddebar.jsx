import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: 'bi-grid-1x2-fill' },
  { to: '/vehicles', label: 'Vehicles', icon: 'bi-truck' },
  { to: '/drivers', label: 'Drivers', icon: 'bi-people-fill' },
  { to: '/trips', label: 'Trips', icon: 'bi-sign-turn-right-fill' },
  { to: '/maintenance', label: 'Maintenance', icon: 'bi-tools' },
  { to: '/fuel-expenses', label: 'Fuel & Expenses', icon: 'bi-fuel-pump-fill' },
  { to: '/reports', label: 'Reports', icon: 'bi-bar-chart-line-fill' },
  { to: '/settings', label: 'Settings', icon: 'bi-gear-fill' }
];

const SidebarContent = () => (
  <div className="sidebar-card d-flex flex-column p-3 p-lg-4">
    <div className="d-flex align-items-center gap-3 mb-4">
      <div className="logo-badge">
        <i className="bi bi-bus-front-fill"></i>
      </div>
      <div>
        <h4 className="mb-0 text-white fw-bold">TransitOps</h4>
        <small className="text-white-50">Smart Operations Platform</small>
      </div>
    </div>

    <div className="sidebar-section-title">Main</div>

    <nav className="flex-grow-1">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <i className={`bi ${item.icon}`}></i>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>

    <div className="glass-card p-3 mt-3 text-white" style={{ background: 'rgba(255,255,255,0.08)' }}>
      <div className="small text-white-50 mb-1">Fleet Status</div>
      <h5 className="mb-2">84% Utilization</h5>
      <div className="progress" style={{ height: '8px', borderRadius: '999px' }}>
        <div className="progress-bar bg-info" style={{ width: '84%' }}></div>
      </div>
      <small className="d-block mt-2 text-white-50">Performance above monthly target.</small>
    </div>
  </div>
);

const Sidebar = () => {
  return (
    <>
      <aside className="sidebar-desktop">
        <SidebarContent />
      </aside>

      <div
        className="offcanvas offcanvas-start"
        tabIndex="-1"
        id="mobileSidebar"
        aria-labelledby="mobileSidebarLabel"
      >
        <div className="offcanvas-header mobile-sidebar-header">
          <h5 className="offcanvas-title" id="mobileSidebarLabel">TransitOps</h5>
          <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body p-0">
          <SidebarContent />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
