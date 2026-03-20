import React, { useState } from 'react';

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    if (e.target.value.length > 2) {
      console.log('Buscando por:', e.target.value);
      // Aqui você implementaria a busca real
    }
  };

  const handleNotifications = () => {
    alert('Você tem 3 notificações pendentes!\n\n• Produto com estoque baixo\n• Nova movimentação registrada\n• Relatório mensal disponível');
  };

  const handleSettings = () => {
    alert('Abrindo configurações do sistema...\n\n• Configurações de usuário\n• Preferências de notificação\n• Configurações de estoque');
  };

  const handleUserClick = () => {
    alert('Menu do usuário\n\n• Perfil\n• Configurações\n• Sair');
  };

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
            value={searchValue}
            onChange={handleSearch}
          />
          <span className="header-search-icon">🔍</span>
        </div>

        <div className="header-actions">
          <button className="header-action-btn" onClick={handleNotifications}>
            🔔
            <span className="header-notification-badge">3</span>
          </button>
          <button className="header-action-btn" onClick={handleSettings}>
            ⚙️
          </button>
        </div>

        <div className="header-user" onClick={handleUserClick}>
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
