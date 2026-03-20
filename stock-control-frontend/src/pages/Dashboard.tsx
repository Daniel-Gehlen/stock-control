import React, { useState, useEffect } from 'react';
import './Dashboard.css';

interface DashboardStats {
  totalProdutos: number;
  totalCategorias: number;
  estoqueBaixo: number;
  movimentacoesHoje: number;
  valorTotalEstoque: number;
  entradasMes: number;
  saidasMes: number;
}

interface ProdutoEstoqueBaixo {
  id: number;
  nome: string;
  quantidadeAtual: number;
  quantidadeMinima: number;
}

interface MovimentacaoRecente {
  id: number;
  produtoNome: string;
  tipo: string;
  quantidade: number;
  data: string;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProdutos: 0,
    totalCategorias: 0,
    estoqueBaixo: 0,
    movimentacoesHoje: 0,
    valorTotalEstoque: 0,
    entradasMes: 0,
    saidasMes: 0
  });
  const [produtosEstoqueBaixo, setProdutosEstoqueBaixo] = useState<ProdutoEstoqueBaixo[]>([]);
  const [movimentacoesRecentes, setMovimentacoesRecentes] = useState<MovimentacaoRecente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular dados do dashboard
    setTimeout(() => {
      setStats({
        totalProdutos: 156,
        totalCategorias: 12,
        estoqueBaixo: 8,
        movimentacoesHoje: 23,
        valorTotalEstoque: 45678.90,
        entradasMes: 342,
        saidasMes: 289
      });

      setProdutosEstoqueBaixo([
        { id: 1, nome: 'Notebook Dell', quantidadeAtual: 2, quantidadeMinima: 5 },
        { id: 2, nome: 'Mouse Logitech', quantidadeAtual: 3, quantidadeMinima: 10 },
        { id: 3, nome: 'Teclado Mecânico', quantidadeAtual: 1, quantidadeMinima: 8 },
        { id: 4, nome: 'Monitor Samsung', quantidadeAtual: 4, quantidadeMinima: 6 }
      ]);

      setMovimentacoesRecentes([
        { id: 1, produtoNome: 'Notebook Dell', tipo: 'Entrada', quantidade: 10, data: '2024-01-15 14:30' },
        { id: 2, produtoNome: 'Mouse Logitech', tipo: 'Saída', quantidade: 5, data: '2024-01-15 13:45' },
        { id: 3, produtoNome: 'Teclado Mecânico', tipo: 'Entrada', quantidade: 15, data: '2024-01-15 12:20' },
        { id: 4, produtoNome: 'Monitor Samsung', tipo: 'Saída', quantidade: 3, data: '2024-01-15 11:10' }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Carregando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Visão geral do seu controle de estoque</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>Total de Produtos</h3>
            <p className="stat-number">{stats.totalProdutos}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏷️</div>
          <div className="stat-content">
            <h3>Categorias</h3>
            <p className="stat-number">{stats.totalCategorias}</p>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>Estoque Baixo</h3>
            <p className="stat-number">{stats.estoqueBaixo}</p>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">🔄</div>
          <div className="stat-content">
            <h3>Movimentações Hoje</h3>
            <p className="stat-number">{stats.movimentacoesHoje}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Valor Total Estoque</h3>
            <p className="stat-number">{formatCurrency(stats.valorTotalEstoque)}</p>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>Entradas do Mês</h3>
            <p className="stat-number">{stats.entradasMes}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📉</div>
          <div className="stat-content">
            <h3>Saídas do Mês</h3>
            <p className="stat-number">{stats.saidasMes}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Saldo do Mês</h3>
            <p className="stat-number">{stats.entradasMes - stats.saidasMes}</p>
          </div>
        </div>
      </div>

      {/* Seções de Informações */}
      <div className="dashboard-sections">
        {/* Produtos com Estoque Baixo */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>⚠️ Produtos com Estoque Baixo</h2>
            <span className="badge warning">{produtosEstoqueBaixo.length}</span>
          </div>
          <div className="section-content">
            {produtosEstoqueBaixo.length > 0 ? (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Produto</th>
                      <th>Qtd Atual</th>
                      <th>Qtd Mínima</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {produtosEstoqueBaixo.map(produto => (
                      <tr key={produto.id}>
                        <td>{produto.nome}</td>
                        <td>{produto.quantidadeAtual}</td>
                        <td>{produto.quantidadeMinima}</td>
                        <td>
                          <span className="badge danger">Crítico</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="empty-message">Nenhum produto com estoque baixo</p>
            )}
          </div>
        </div>

        {/* Movimentações Recentes */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>🔄 Movimentações Recentes</h2>
            <span className="badge info">{movimentacoesRecentes.length}</span>
          </div>
          <div className="section-content">
            {movimentacoesRecentes.length > 0 ? (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Produto</th>
                      <th>Tipo</th>
                      <th>Quantidade</th>
                      <th>Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movimentacoesRecentes.map(mov => (
                      <tr key={mov.id}>
                        <td>{mov.produtoNome}</td>
                        <td>
                          <span className={`badge ${mov.tipo === 'Entrada' ? 'success' : 'warning'}`}>
                            {mov.tipo}
                          </span>
                        </td>
                        <td>{mov.quantidade}</td>
                        <td>{mov.data}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="empty-message">Nenhuma movimentação recente</p>
            )}
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="quick-actions">
        <h2>⚡ Ações Rápidas</h2>
        <div className="actions-grid">
          <button className="action-btn primary">
            <span>➕</span>
            Novo Produto
          </button>
          <button className="action-btn success">
            <span>📥</span>
            Entrada de Estoque
          </button>
          <button className="action-btn warning">
            <span>📤</span>
            Saída de Estoque
          </button>
          <button className="action-btn info">
            <span>📊</span>
            Relatórios
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
