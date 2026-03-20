import React from 'react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const menuItems = [
    {
      section: 'Principal',
      items: [
        { icon: '📊', label: 'Dashboard', href: '/', active: true },
        { icon: '📦', label: 'Produtos', href: '/produtos' },
        { icon: '🏷️', label: 'Categorias', href: '/categorias' },
        { icon: '🏭', label: 'Estoques', href: '/estoques' },
        { icon: '🔄', label: 'Movimentações', href: '/movimentacoes' },
      ]
    },
    {
      section: 'Sistema',
      items: [
        { icon: '⚙️', label: 'Configurações', href: '/configuracoes' },
        { icon: '👤', label: 'Usuários', href: '/usuarios' },
      ]
    }
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="sidebar-logo-icon">📦</span>
          <span className="sidebar-logo-text">StockControl</span>
        </div>
        <button className="sidebar-close" onClick={onToggle}>
          ✕
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((section, sectionIndex) => (
          <div key={sectionIndex} className="sidebar-section">
            <h3 className="sidebar-section-title">{section.section}</h3>
            <ul className="sidebar-menu">
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <a
                    href={item.href}
                    className={`sidebar-menu-item ${item.active ? 'active' : ''}`}
                  >
                    <span className="sidebar-menu-icon">{item.icon}</span>
                    <span className="sidebar-menu-label">{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">👤</div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">Admin</span>
            <span className="sidebar-user-role">Administrador</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
