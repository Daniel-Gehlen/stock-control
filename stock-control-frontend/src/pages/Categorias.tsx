import React, { useState, useEffect } from 'react';
import './Categorias.css';

interface Categoria {
  id: number;
  nome: string;
  descricao: string;
}

const Categorias: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    nome: '',
    descricao: ''
  });

  useEffect(() => {
    carregarCategorias();
  }, []);

  const carregarCategorias = async () => {
    setLoading(true);
    // Simular dados
    setTimeout(() => {
      const mockCategorias: Categoria[] = [
        { id: 1, nome: 'Eletrônicos', descricao: 'Produtos eletrônicos em geral' },
        { id: 2, nome: 'Móveis', descricao: 'Móveis para escritório' },
        { id: 3, nome: 'Acessórios', descricao: 'Acessórios diversos' },
        { id: 4, nome: 'Informática', descricao: 'Produtos de informática' },
        { id: 5, nome: 'Periféricos', descricao: 'Periféricos para computadores' },
      ];

      setCategorias(mockCategorias);
      setLoading(false);
    }, 800);
  };

  const handleOpenModal = (categoria?: Categoria) => {
    if (categoria) {
      setEditingCategoria(categoria);
      setFormData({
        nome: categoria.nome,
        descricao: categoria.descricao
      });
    } else {
      setEditingCategoria(null);
      setFormData({
        nome: '',
        descricao: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategoria(null);
    setFormData({
      nome: '',
      descricao: ''
    });
  };

  const handleSalvar = () => {
    if (!formData.nome || !formData.descricao) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    if (editingCategoria) {
      // Atualizar categoria existente
      setCategorias(prev => prev.map(c =>
        c.id === editingCategoria.id
          ? { ...c, ...formData }
          : c
      ));
      alert('Categoria atualizada com sucesso!');
    } else {
      // Criar nova categoria
      const novaCategoria: Categoria = {
        id: Date.now(),
        ...formData
      };
      setCategorias(prev => [...prev, novaCategoria]);
      alert('Categoria criada com sucesso!');
    }

    handleCloseModal();
  };

  const handleDeletar = (id: number) => {
    if (window.confirm('Tem certeza que deseja deletar esta categoria?')) {
      setCategorias(prev => prev.filter(c => c.id !== id));
      alert('Categoria deletada com sucesso!');
    }
  };

  const categoriasFiltradas = categorias.filter(categoria =>
    categoria.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    categoria.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner"></div>
        <p>Carregando categorias...</p>
      </div>
    );
  }

  return (
    <div className="categorias-page">
      <div className="page-header">
        <div className="header-content">
          <h1>🏷️ Categorias</h1>
          <p>Organize seus produtos por categorias</p>
        </div>
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          ➕ Nova Categoria
        </button>
      </div>

      {/* Filtros */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Buscar categorias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grid de Categorias */}
      <div className="categorias-grid">
        {categoriasFiltradas.map(categoria => (
          <div key={categoria.id} className="categoria-card">
            <div className="categoria-header">
              <h3>{categoria.nome}</h3>
              <div className="categoria-actions">
                <button
                  className="btn-icon edit"
                  onClick={() => handleOpenModal(categoria)}
                  title="Editar"
                >
                  ✏️
                </button>
                <button
                  className="btn-icon delete"
                  onClick={() => handleDeletar(categoria.id)}
                  title="Deletar"
                >
                  🗑️
                </button>
              </div>
            </div>
            <p className="categoria-descricao">{categoria.descricao}</p>
            <div className="categoria-footer">
              <span className="categoria-id">ID: {categoria.id}</span>
              <span className="badge info">Ativa</span>
            </div>
          </div>
        ))}
      </div>

      {/* Estado vazio */}
      {categoriasFiltradas.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🏷️</div>
          <h3>Nenhuma categoria encontrada</h3>
          <p>
            {searchTerm
              ? 'Tente ajustar sua busca ou criar uma nova categoria.'
              : 'Comece criando sua primeira categoria.'
            }
          </p>
          <button className="btn-primary" onClick={() => handleOpenModal()}>
            ➕ Criar Categoria
          </button>
        </div>
      )}

      {/* Modal de Cadastro/Edição */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingCategoria ? '✏️ Editar Categoria' : '➕ Nova Categoria'}</h2>
              <button className="modal-close" onClick={handleCloseModal}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Nome *</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Nome da categoria"
                />
              </div>
              <div className="form-group">
                <label>Descrição *</label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                  placeholder="Descreva a categoria..."
                  rows={4}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={handleCloseModal}>
                Cancelar
              </button>
              <button className="btn-primary" onClick={handleSalvar}>
                {editingCategoria ? 'Salvar Alterações' : 'Criar Categoria'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categorias;
