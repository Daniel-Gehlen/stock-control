import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="layout">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <div className="layout-main">
        <Header onMenuToggle={toggleSidebar} />
        <main className="layout-content">
          {children}
        </main>
      </div>
      {sidebarOpen && (
        <div className="layout-overlay" onClick={toggleSidebar} />
      )}
    </div>
  );
};

export default Layout;
