import React, { useState, useEffect } from 'react';
import './Movimentacoes.css';

interface Movimentacao {
  id: number;
  produtoId: number;
  produtoNome: string;
  tipo: 'Entrada' | 'Saída';
  quantidade: number;
  data: string;
  observacoes?: string;
}

interface Filtros {
  busca: string;
  tipo: string;
  dataInicio: string;
  dataFim: string;
  pagina: number;
  tamanhoPagina: number;
}

const Movimentacoes: React.FC = () => {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filtros, setFiltros] = useState<Filtros>({
    busca: '',
    tipo: '',
    dataInicio: '',
    dataFim: '',
    pagina: 1,
    tamanhoPagina: 10
  });
  const [totalItens, setTotalItens] = useState(0);
  const [resumo, setResumo] = useState({
    totalEntradas: 0,
    totalSaidas: 0,
    saldo: 0
  });

  const [formData, setFormData] = useState({
    produtoId: 0,
    tipo: 'Entrada',
    quantidade: 0,
    observacoes: ''
  });

  useEffect(() => {
    carregarMovimentacoes();
  }, [filtros]);

  const carregarMovimentacoes = async () => {
    setLoading(true);
    // Simular dados
    setTimeout(() => {
      const mockMovimentacoes: Movimentacao[] = [
        { id: 1, produtoId: 1, produtoNome: 'Notebook Dell Inspiron', tipo: 'Entrada', quantidade: 10, data: '2024-01-15 14:30', observacoes: 'Compra de fornecedor' },
        { id: 2, produtoId: 2, produtoNome: 'Mouse Logitech MX', tipo: 'Saída', quantidade: 5, data: '2024-01-15 13:45', observacoes: 'Venda para cliente' },
        { id: 3, produtoId: 3, produtoNome: 'Teclado Mecânico RGB', tipo: 'Entrada', quantidade: 15, data: '2024-01-15 12:20', observacoes: 'Reposição de estoque' },
        { id: 4, produtoId: 4, produtoNome: 'Monitor Samsung 24"', tipo: 'Saída', quantidade: 3, data: '2024-01-15 11:10', observacoes: 'Venda online' },
        { id: 5, produtoId: 5, produtoNome: 'Cadeira Gamer', tipo: 'Entrada', quantidade: 8, data: '2024-01-15 10:30', observacoes: 'Novo lote' },
        { id: 6, produtoId: 6, produtoNome: 'Mesa de Escritório', tipo: 'Saída', quantidade: 2, data: '2024-01-15 09:45', observacoes: 'Venda no balcão' },
      ];

      let movimentacoesFiltradas = mockMovimentacoes;

      if (filtros.busca) {
        movimentacoesFiltradas = movimentacoesFiltradas.filter(m =>
          m.produtoNome.toLowerCase().includes(filtros.busca.toLowerCase())
        );
      }

      if (filtros.tipo) {
        movimentacoesFiltradas = movimentacoesFiltradas.filter(m => m.tipo === filtros.tipo);
      }

      const entradas = movimentacoesFiltradas.filter(m => m.tipo === 'Entrada').reduce((acc, m) => acc + m.quantidade, 0);
      const saidas = movimentacoesFiltradas.filter(m => m.tipo === 'Saída').reduce((acc, m) => acc + m.quantidade, 0);

      setMovimentacoes(movimentacoesFiltradas);
      setTotalItens(movimentacoesFiltradas.length);
      setResumo({
        totalEntradas: entradas,
        totalSaidas: saidas,
        saldo: entradas - saidas
      });
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

  const handleOpenModal = () => {
    setFormData({
      produtoId: 0,
      tipo: 'Entrada',
      quantidade: 0,
      observacoes: ''
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      produtoId: 0,
      tipo: 'Entrada',
      quantidade: 0,
      observacoes: ''
    });
  };

  const handleSalvar = () => {
    if (!formData.produtoId || !formData.quantidade) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    // Simular criação de movimentação
    const novaMovimentacao: Movimentacao = {
      id: Date.now(),
      produtoId: formData.produtoId,
      produtoNome: `Produto ${formData.produtoId}`,
      tipo: formData.tipo as 'Entrada' | 'Saída',
      quantidade: formData.quantidade,
      data: new Date().toLocaleString('pt-BR'),
      observacoes: formData.observacoes
    };

    setMovimentacoes(prev => [novaMovimentacao, ...prev]);
    setTotalItens(prev => prev + 1);

    // Atualizar resumo
    if (formData.tipo === 'Entrada') {
      setResumo(prev => ({
        ...prev,
        totalEntradas: prev.totalEntradas + formData.quantidade,
        saldo: prev.saldo + formData.quantidade
      }));
    } else {
      setResumo(prev => ({
        ...prev,
        totalSaidas: prev.totalSaidas + formData.quantidade,
        saldo: prev.saldo - formData.quantidade
      }));
    }

    alert('Movimentação registrada com sucesso!');
    handleCloseModal();
  };

  const formatDate = (dateString: string) => {
    return dateString;
  };

  const totalPaginas = Math.ceil(totalItens / filtros.tamanhoPagina);

  if (loading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner"></div>
        <p>Carregando movimentações...</p>
      </div>
    );
  }

  return (
    <div className="movimentacoes-page">
      <div className="page-header">
        <div className="header-content">
          <h1>🔄 Movimentações</h1>
          <p>Controle de entradas e saídas do estoque</p>
        </div>
        <button className="btn-primary" onClick={handleOpenModal}>
          ➕ Nova Movimentação
        </button>
      </div>

      {/* Cards de Resumo */}
      <div className="summary-cards">
        <div className="summary-card success">
          <div className="summary-icon">📈</div>
          <div className="summary-content">
            <h3>Total Entradas</h3>
            <p className="summary-number">{resumo.totalEntradas}</p>
          </div>
        </div>
        <div className="summary-card warning">
          <div className="summary-icon">📉</div>
          <div className="summary-content">
            <h3>Total Saídas</h3>
            <p className="summary-number">{resumo.totalSaidas}</p>
          </div>
        </div>
        <div className={`summary-card ${resumo.saldo >= 0 ? 'success' : 'danger'}`}>
          <div className="summary-icon">⚖️</div>
          <div className="summary-content">
            <h3>Saldo</h3>
            <p className="summary-number">{resumo.saldo}</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">📊</div>
          <div className="summary-content">
            <h3>Total Movimentações</h3>
            <p className="summary-number">{totalItens}</p>
          </div>
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
        <div className="filter-select">
          <select
            value={filtros.tipo}
            onChange={(e) => handleFiltroChange('tipo', e.target.value)}
          >
            <option value="">Todos os tipos</option>
            <option value="Entrada">Entrada</option>
            <option value="Saída">Saída</option>
          </select>
        </div>
        <div className="filter-date">
          <input
            type="date"
            value={filtros.dataInicio}
            onChange={(e) => handleFiltroChange('dataInicio', e.target.value)}
            placeholder="Data início"
          />
        </div>
        <div className="filter-date">
          <input
            type="date"
            value={filtros.dataFim}
            onChange={(e) => handleFiltroChange('dataFim', e.target.value)}
            placeholder="Data fim"
          />
        </div>
      </div>

      {/* Tabela de Movimentações */}
      <div className="table-section">
        <div className="table-header">
          <span>Total: {totalItens} movimentação(ões)</span>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Produto</th>
                <th>Tipo</th>
                <th>Quantidade</th>
                <th>Data</th>
                <th>Observações</th>
              </tr>
            </thead>
            <tbody>
              {movimentacoes.map(movimentacao => (
                <tr key={movimentacao.id}>
                  <td>{movimentacao.id}</td>
                  <td>{movimentacao.produtoNome}</td>
                  <td>
                    <span className={`badge ${movimentacao.tipo === 'Entrada' ? 'success' : 'warning'}`}>
                      {movimentacao.tipo}
                    </span>
                  </td>
                  <td>
                    <span className={`quantity ${movimentacao.tipo === 'Entrada' ? 'success' : 'warning'}`}>
                      {movimentacao.tipo === 'Entrada' ? '+' : '-'}{movimentacao.quantidade}
                    </span>
                  </td>
                  <td>{formatDate(movimentacao.data)}</td>
                  <td>{movimentacao.observacoes || '-'}</td>
                </tr>
              ))}
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
      {movimentacoes.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🔄</div>
          <h3>Nenhuma movimentação encontrada</h3>
          <p>
            {filtros.busca || filtros.tipo
              ? 'Tente ajustar seus filtros.'
              : 'Comece registrando sua primeira movimentação.'
            }
          </p>
          <button className="btn-primary" onClick={handleOpenModal}>
            ➕ Nova Movimentação
          </button>
        </div>
      )}

      {/* Modal de Nova Movimentação */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>➕ Nova Movimentação</h2>
              <button className="modal-close" onClick={handleCloseModal}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Produto *</label>
                <select
                  value={formData.produtoId}
                  onChange={(e) => setFormData(prev => ({ ...prev, produtoId: Number(e.target.value) }))}
                >
                  <option value={0}>Selecione um produto</option>
                  <option value={1}>Notebook Dell Inspiron</option>
                  <option value={2}>Mouse Logitech MX</option>
                  <option value={3}>Teclado Mecânico RGB</option>
                  <option value={4}>Monitor Samsung 24"</option>
                  <option value={5}>Cadeira Gamer</option>
                  <option value={6}>Mesa de Escritório</option>
                </select>
              </div>
              <div className="form-group">
                <label>Tipo *</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="tipo"
                      value="Entrada"
                      checked={formData.tipo === 'Entrada'}
                      onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value }))}
                    />
                    <span className="radio-custom"></span>
                    Entrada
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="tipo"
                      value="Saída"
                      checked={formData.tipo === 'Saída'}
                      onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value }))}
                    />
                    <span className="radio-custom"></span>
                    Saída
                  </label>
                </div>
              </div>
              <div className="form-group">
                <label>Quantidade *</label>
                <input
                  type="number"
                  min="1"
                  value={formData.quantidade}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantidade: Number(e.target.value) }))}
                  placeholder="Quantidade"
                />
              </div>
              <div className="form-group">
                <label>Observações</label>
                <textarea
                  value={formData.observacoes}
                  onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                  placeholder="Observações sobre a movimentação..."
                  rows={3}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={handleCloseModal}>
                Cancelar
              </button>
              <button className="btn-primary" onClick={handleSalvar}>
                Registrar Movimentação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Movimentacoes;
