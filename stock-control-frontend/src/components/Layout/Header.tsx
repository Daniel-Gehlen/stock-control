import React from 'react';

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  return (
    <header className="header">
      <div className="header-left">
        <button className="header-menu-btn" onClick={onMenuToggle}>
          ☰
        </button>
        <div className="header-breadcrumb">
          <span className="breadcrumb-item">Dashboard</span>
        </div>
      </div>

      <div className="header-right">
        <div className="header-search">
          <input
            type="text"
            className="header-search-input"
            placeholder="Buscar..."
          />
          <span className="header-search-icon">🔍</span>
        </div>

        <div className="header-actions">
          <button className="header-action-btn">
            🔔
            <span className="header-notification-badge">3</span>
          </button>
          <button className="header-action-btn">
            ⚙️
          </button>
        </div>

        <div className="header-user">
          <div className="header-user-avatar">👤</div>
          <div className="header-user-info">
            <span className="header-user-name">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
