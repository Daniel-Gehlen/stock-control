import React, { useState, useEffect } from 'react';
import './Estoques.css';

interface Estoque {
  id: number;
  produtoId: number;
  produtoNome: string;
  quantidadeAtual: number;
  quantidadeMinima: number;
  ultimaAtualizacao: string;
}

interface Filtros {
  busca: string;
  estoqueBaixo: boolean | null;
  pagina: number;
  tamanhoPagina: number;
}

const Estoques: React.FC = () => {
  const [estoques, setEstoques] = useState<Estoque[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState<Filtros>({
    busca: '',
    estoqueBaixo: null,
    pagina: 1,
    tamanhoPagina: 10
  });
  const [totalItens, setTotalItens] = useState(0);

  useEffect(() => {
    carregarEstoques();
  }, [filtros]);

  const carregarEstoques = async () => {
    setLoading(true);
    // Simular dados
    setTimeout(() => {
      const mockEstoques: Estoque[] = [
        { id: 1, produtoId: 1, produtoNome: 'Notebook Dell Inspiron', quantidadeAtual: 15, quantidadeMinima: 5, ultimaAtualizacao: '2024-01-15 14:30' },
        { id: 2, produtoId: 2, produtoNome: 'Mouse Logitech MX', quantidadeAtual: 3, quantidadeMinima: 10, ultimaAtualizacao: '2024-01-15 13:45' },
        { id: 3, produtoId: 3, produtoNome: 'Teclado Mecânico RGB', quantidadeAtual: 25, quantidadeMinima: 8, ultimaAtualizacao: '2024-01-15 12:20' },
        { id: 4, produtoId: 4, produtoNome: 'Monitor Samsung 24"', quantidadeAtual: 2, quantidadeMinima: 6, ultimaAtualizacao: '2024-01-15 11:10' },
        { id: 5, produtoId: 5, produtoNome: 'Cadeira Gamer', quantidadeAtual: 8, quantidadeMinima: 3, ultimaAtualizacao: '2024-01-15 10:30' },
        { id: 6, produtoId: 6, produtoNome: 'Mesa de Escritório', quantidadeAtual: 1, quantidadeMinima: 2, ultimaAtualizacao: '2024-01-15 09:45' },
      ];

      let estoquesFiltrados = mockEstoques;

      if (filtros.busca) {
        estoquesFiltrados = estoquesFiltrados.filter(e =>
          e.produtoNome.toLowerCase().includes(filtros.busca.toLowerCase())
        );
      }

      if (filtros.estoqueBaixo === true) {
        estoquesFiltrados = estoquesFiltrados.filter(e => e.quantidadeAtual <= e.quantidadeMinima);
      }

      setEstoques(estoquesFiltrados);
      setTotalItens(estoquesFiltrados.length);
      setLoading(false);
    }, 800);
  };

  const handleFiltroChange = (campo: keyof Filtros, valor: any) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor,
      pagina: 1
    }));
  };

  const handlePageChange = (novaPagina: number) => {
    setFiltros(prev => ({
      ...prev,
      pagina: novaPagina
    }));
  };

  const getEstoqueStatus = (estoque: Estoque) => {
    if (estoque.quantidadeAtual === 0) {
      return { status: 'Zerado', className: 'danger' };
    } else if (estoque.quantidadeAtual <= estoque.quantidadeMinima) {
      return { status: 'Baixo', className: 'warning' };
    } else {
      return { status: 'Normal', className: 'success' };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  };

  const totalPaginas = Math.ceil(totalItens / filtros.tamanhoPagina);

  if (loading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner"></div>
        <p>Carregando estoques...</p>
      </div>
    );
  }

  return (
    <div className="estoques-page">
      <div className="page-header">
        <div className="header-content">
          <h1>🏭 Estoques</h1>
          <p>Monitore os níveis de estoque dos produtos</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Buscar por produto..."
            value={filtros.busca}
            onChange={(e) => handleFiltroChange('busca', e.target.value)}
          />
        </div>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filtros.estoqueBaixo === null ? 'active' : ''}`}
            onClick={() => handleFiltroChange('estoqueBaixo', null)}
          >
            Todos
          </button>
          <button
            className={`filter-btn ${filtros.estoqueBaixo === true ? 'active' : ''}`}
            onClick={() => handleFiltroChange('estoqueBaixo', true)}
          >
            ⚠️ Estoque Baixo
          </button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-icon">📦</div>
          <div className="summary-content">
            <h3>Total de Produtos</h3>
            <p className="summary-number">{totalItens}</p>
          </div>
        </div>
        <div className="summary-card warning">
          <div className="summary-icon">⚠️</div>
          <div className="summary-content">
            <h3>Estoque Baixo</h3>
            <p className="summary-number">
              {estoques.filter(e => e.quantidadeAtual <= e.quantidadeMinima).length}
            </p>
          </div>
        </div>
        <div className="summary-card danger">
          <div className="summary-icon">🚨</div>
          <div className="summary-content">
            <h3>Estoque Zerado</h3>
            <p className="summary-number">
              {estoques.filter(e => e.quantidadeAtual === 0).length}
            </p>
          </div>
        </div>
        <div className="summary-card success">
          <div className="summary-icon">✅</div>
          <div className="summary-content">
            <h3>Estoque Normal</h3>
            <p className="summary-number">
              {estoques.filter(e => e.quantidadeAtual > e.quantidadeMinima).length}
            </p>
          </div>
        </div>
      </div>

      {/* Tabela de Estoques */}
      <div className="table-section">
        <div className="table-header">
          <span>Total: {totalItens} produto(s)</span>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Produto</th>
                <th>Qtd Atual</th>
                <th>Qtd Mínima</th>
                <th>Status</th>
                <th>Última Atualização</th>
              </tr>
            </thead>
            <tbody>
              {estoques.map(estoque => {
                const statusInfo = getEstoqueStatus(estoque);
                return (
                  <tr key={estoque.id}>
                    <td>{estoque.id}</td>
                    <td>{estoque.produtoNome}</td>
                    <td>
                      <span className={`quantity ${statusInfo.className}`}>
                        {estoque.quantidadeAtual}
                      </span>
                    </td>
                    <td>{estoque.quantidadeMinima}</td>
                    <td>
                      <span className={`badge ${statusInfo.className}`}>
                        {statusInfo.status}
                      </span>
                    </td>
                    <td>{formatDate(estoque.ultimaAtualizacao)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {totalPaginas > 1 && (
          <div className="pagination">
            <button
              disabled={filtros.pagina === 1}
              onClick={() => handlePageChange(filtros.pagina - 1)}
            >
              ← Anterior
            </button>
            <span>Página {filtros.pagina} de {totalPaginas}</span>
            <button
              disabled={filtros.pagina === totalPaginas}
              onClick={() => handlePageChange(filtros.pagina + 1)}
            >
              Próxima →
            </button>
          </div>
        )}
      </div>

      {/* Estado vazio */}
      {estoques.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🏭</div>
          <h3>Nenhum estoque encontrado</h3>
          <p>
            {filtros.busca
              ? 'Tente ajustar sua busca.'
              : 'Não há produtos com estoque baixo.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default Estoques;
