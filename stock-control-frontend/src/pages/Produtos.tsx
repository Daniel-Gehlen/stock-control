import React, { useState, useEffect } from 'react';
import './Produtos.css';

interface Produto {
  id: number;
  nome: string;
  codigo: string;
  precoCompra: number;
  precoVenda: number;
  categoriaId: number;
  nomeCategoria?: string;
}

interface Categoria {
  id: number;
  nome: string;
  descricao: string;
}

interface Filtros {
  busca: string;
  categoriaId: number | null;
  pagina: number;
  tamanhoPagina: number;
}

const Produtos: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduto, setEditingProduto] = useState<Produto | null>(null);
  const [filtros, setFiltros] = useState<Filtros>({
    busca: '',
    categoriaId: null,
    pagina: 1,
    tamanhoPagina: 10
  });
  const [totalItens, setTotalItens] = useState(0);

  const [formData, setFormData] = useState({
    nome: '',
    codigo: '',
    precoCompra: 0,
    precoVenda: 0,
    categoriaId: 0
  });

  useEffect(() => {
    carregarDados();
  }, [filtros]);

  const carregarDados = async () => {
    setLoading(true);
    // Simular dados
    setTimeout(() => {
      const mockProdutos: Produto[] = [
        { id: 1, nome: 'Notebook Dell Inspiron', codigo: 'NB001', precoCompra: 2500, precoVenda: 3200, categoriaId: 1, nomeCategoria: 'Eletrônicos' },
        { id: 2, nome: 'Mouse Logitech MX', codigo: 'MS001', precoCompra: 150, precoVenda: 220, categoriaId: 1, nomeCategoria: 'Eletrônicos' },
        { id: 3, nome: 'Teclado Mecânico RGB', codigo: 'TC001', precoCompra: 300, precoVenda: 450, categoriaId: 1, nomeCategoria: 'Eletrônicos' },
        { id: 4, nome: 'Monitor Samsung 24"', codigo: 'MN001', precoCompra: 800, precoVenda: 1200, categoriaId: 1, nomeCategoria: 'Eletrônicos' },
        { id: 5, nome: 'Cadeira Gamer', codigo: 'CD001', precoCompra: 600, precoVenda: 900, categoriaId: 2, nomeCategoria: 'Móveis' },
        { id: 6, nome: 'Mesa de Escritório', codigo: 'MS002', precoCompra: 400, precoVenda: 650, categoriaId: 2, nomeCategoria: 'Móveis' },
      ];

      const mockCategorias: Categoria[] = [
        { id: 1, nome: 'Eletrônicos', descricao: 'Produtos eletrônicos em geral' },
        { id: 2, nome: 'Móveis', descricao: 'Móveis para escritório' },
        { id: 3, nome: 'Acessórios', descricao: 'Acessórios diversos' },
      ];

      setProdutos(mockProdutos);
      setCategorias(mockCategorias);
      setTotalItens(mockProdutos.length);
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

  const handleOpenModal = (produto?: Produto) => {
    if (produto) {
      setEditingProduto(produto);
      setFormData({
        nome: produto.nome,
        codigo: produto.codigo,
        precoCompra: produto.precoCompra,
        precoVenda: produto.precoVenda,
        categoriaId: produto.categoriaId
      });
    } else {
      setEditingProduto(null);
      setFormData({
        nome: '',
        codigo: '',
        precoCompra: 0,
        precoVenda: 0,
        categoriaId: 0
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduto(null);
    setFormData({
      nome: '',
      codigo: '',
      precoCompra: 0,
      precoVenda: 0,
      categoriaId: 0
    });
  };

  const handleSalvar = () => {
    if (!formData.nome || !formData.codigo || !formData.categoriaId) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    if (editingProduto) {
      // Atualizar produto existente
      setProdutos(prev => prev.map(p =>
        p.id === editingProduto.id
          ? { ...p, ...formData, nomeCategoria: categorias.find(c => c.id === formData.categoriaId)?.nome }
          : p
      ));
      alert('Produto atualizado com sucesso!');
    } else {
      // Criar novo produto
      const novoProduto: Produto = {
        id: Date.now(),
        ...formData,
        nomeCategoria: categorias.find(c => c.id === formData.categoriaId)?.nome
      };
      setProdutos(prev => [...prev, novoProduto]);
      setTotalItens(prev => prev + 1);
      alert('Produto criado com sucesso!');
    }

    handleCloseModal();
  };

  const handleDeletar = (id: number) => {
    if (window.confirm('Tem certeza que deseja deletar este produto?')) {
      setProdutos(prev => prev.filter(p => p.id !== id));
      setTotalItens(prev => prev - 1);
      alert('Produto deletado com sucesso!');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const totalPaginas = Math.ceil(totalItens / filtros.tamanhoPagina);

  if (loading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner"></div>
        <p>Carregando produtos...</p>
      </div>
    );
  }

  return (
    <div className="produtos-page">
      <div className="page-header">
        <div className="header-content">
          <h1>📦 Produtos</h1>
          <p>Gerencie seu catálogo de produtos</p>
        </div>
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          ➕ Novo Produto
        </button>
      </div>

      {/* Filtros */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Buscar por nome ou código..."
            value={filtros.busca}
            onChange={(e) => handleFiltroChange('busca', e.target.value)}
          />
        </div>
        <div className="filter-select">
          <select
            value={filtros.categoriaId || ''}
            onChange={(e) => handleFiltroChange('categoriaId', e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">Todas as categorias</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nome}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabela de Produtos */}
      <div className="table-section">
        <div className="table-header">
          <span>Total: {totalItens} produto(s)</span>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Código</th>
                <th>Nome</th>
                <th>Categoria</th>
                <th>Preço Compra</th>
                <th>Preço Venda</th>
                <th>Margem</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map(produto => (
                <tr key={produto.id}>
                  <td>{produto.id}</td>
                  <td><code>{produto.codigo}</code></td>
                  <td>{produto.nome}</td>
                  <td>
                    <span className="badge info">{produto.nomeCategoria}</span>
                  </td>
                  <td>{formatCurrency(produto.precoCompra)}</td>
                  <td>{formatCurrency(produto.precoVenda)}</td>
                  <td>
                    <span className="badge success">
                      {((produto.precoVenda - produto.precoCompra) / produto.precoCompra * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon edit"
                        onClick={() => handleOpenModal(produto)}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-icon delete"
                        onClick={() => handleDeletar(produto.id)}
                        title="Deletar"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
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

      {/* Modal de Cadastro/Edição */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingProduto ? '✏️ Editar Produto' : '➕ Novo Produto'}</h2>
              <button className="modal-close" onClick={handleCloseModal}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Nome *</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Nome do produto"
                />
              </div>
              <div className="form-group">
                <label>Código *</label>
                <input
                  type="text"
                  value={formData.codigo}
                  onChange={(e) => setFormData(prev => ({ ...prev, codigo: e.target.value }))}
                  placeholder="Código único do produto"
                />
              </div>
              <div className="form-group">
                <label>Categoria *</label>
                <select
                  value={formData.categoriaId}
                  onChange={(e) => setFormData(prev => ({ ...prev, categoriaId: Number(e.target.value) }))}
                >
                  <option value={0}>Selecione uma categoria</option>
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nome}</option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Preço de Compra</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.precoCompra}
                    onChange={(e) => setFormData(prev => ({ ...prev, precoCompra: Number(e.target.value) }))}
                  />
                </div>
                <div className="form-group">
                  <label>Preço de Venda</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.precoVenda}
                    onChange={(e) => setFormData(prev => ({ ...prev, precoVenda: Number(e.target.value) }))}
                  />
                </div>
              </div>
              {formData.precoCompra > 0 && formData.precoVenda > 0 && (
                <div className="margin-preview">
                  <span>Margem de lucro: </span>
                  <span className="margin-value">
                    {((formData.precoVenda - formData.precoCompra) / formData.precoCompra * 100).toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={handleCloseModal}>
                Cancelar
              </button>
              <button className="btn-primary" onClick={handleSalvar}>
                {editingProduto ? 'Salvar Alterações' : 'Criar Produto'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Produtos;
