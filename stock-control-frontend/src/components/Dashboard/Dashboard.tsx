import React, { useState } from 'react';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'Total de Produtos',
      value: '1,234',
      change: '+12%',
      changeType: 'positive',
      icon: '📦'
    },
    {
      title: 'Categorias',
      value: '24',
      change: '+2',
      changeType: 'positive',
      icon: '🏷️'
    },
    {
      title: 'Estoques Ativos',
      value: '8',
      change: '0%',
      changeType: 'neutral',
      icon: '🏭'
    },
    {
      title: 'Movimentações Hoje',
      value: '156',
      change: '+8%',
      changeType: 'positive',
      icon: '🔄'
    }
  ];

  const recentProducts = [
    { id: 1, name: 'Notebook Dell', category: 'Eletrônicos', stock: 15, status: 'Em estoque' },
    { id: 2, name: 'Mouse Logitech', category: 'Acessórios', stock: 3, status: 'Estoque baixo' },
    { id: 3, name: 'Teclado Mecânico', category: 'Acessórios', stock: 0, status: 'Sem estoque' },
    { id: 4, name: 'Monitor LG', category: 'Eletrônicos', stock: 8, status: 'Em estoque' },
    { id: 5, name: 'Webcam HD', category: 'Acessórios', stock: 12, status: 'Em estoque' },
  ];

  const recentMovements = [
    { id: 1, product: 'Notebook Dell', type: 'Entrada', quantity: 10, time: '2 min atrás' },
    { id: 2, product: 'Mouse Logitech', type: 'Saída', quantity: 5, time: '15 min atrás' },
    { id: 3, product: 'Teclado Mecânico', type: 'Entrada', quantity: 20, time: '1 hora atrás' },
    { id: 4, product: 'Monitor LG', type: 'Saída', quantity: 2, time: '2 horas atrás' },
  ];

  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleViewAllProducts = () => {
    setActiveSection('products');
    alert('Navegando para lista completa de produtos...');
    // Aqui você implementaria a navegação real
  };

  const handleViewAllMovements = () => {
    setActiveSection('movements');
    alert('Navegando para lista completa de movimentações...');
    // Aqui você implementaria a navegação real
  };

  const handleRefreshData = () => {
    alert('Dados atualizados com sucesso!');
    // Aqui você implementaria a atualização real dos dados
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">Visão geral do seu estoque</p>
        </div>
        <button className="btn btn-primary" onClick={handleRefreshData}>
          🔄 Atualizar Dados
        </button>
      </div>

      {/* Cards de estatísticas */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-card-header">
              <span className="stat-icon">{stat.icon}</span>
              <span className={`stat-change ${stat.changeType}`}>
                {stat.change}
              </span>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-title">{stat.title}</div>
          </div>
        ))}
      </div>

      {/* Gráficos e tabelas */}
      <div className="dashboard-content">
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Produtos Recentes</h3>
            <button className="btn btn-secondary btn-sm" onClick={handleViewAllProducts}>
              Ver todos
            </button>
          </div>
          <div className="card-body">
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Categoria</th>
                    <th>Estoque</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentProducts.map((product) => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>
                        <span className="badge badge-gray">{product.category}</span>
                      </td>
                      <td>{product.stock}</td>
                      <td>
                        <span className={`badge ${
                          product.status === 'Em estoque' ? 'badge-success' :
                          product.status === 'Estoque baixo' ? 'badge-warning' :
                          'badge-error'
                        }`}>
                          {product.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Movimentações Recentes</h3>
            <button className="btn btn-secondary btn-sm" onClick={handleViewAllMovements}>
              Ver todas
            </button>
          </div>
          <div className="card-body">
            <div className="movements-list">
              {recentMovements.map((movement) => (
                <div key={movement.id} className="movement-item">
                  <div className="movement-info">
                    <span className="movement-product">{movement.product}</span>
                    <span className="movement-time">{movement.time}</span>
                  </div>
                  <div className="movement-details">
                    <span className={`movement-type ${
                      movement.type === 'Entrada' ? 'positive' : 'negative'
                    }`}>
                      {movement.type === 'Entrada' ? '+' : '-'}{movement.quantity}
                    </span>
                    <span className={`badge ${
                      movement.type === 'Entrada' ? 'badge-success' : 'badge-warning'
                    }`}>
                      {movement.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de barras simples */}
      <div className="dashboard-card">
        <div className="card-header">
          <h3 className="card-title">Movimentações dos Últimos 7 Dias</h3>
        </div>
        <div className="card-body">
          <div className="chart-container">
            <div className="chart-bars">
              {[65, 45, 80, 55, 90, 70, 85].map((value, index) => (
                <div key={index} className="chart-bar-container">
                  <div
                    className="chart-bar"
                    style={{ height: `${value}%` }}
                  />
                  <span className="chart-label">
                    {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'][index]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
