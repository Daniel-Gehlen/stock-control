import React, { useState, useEffect } from 'react';
import './Usuarios.css';

interface Usuario {
  id: number;
  nome: string;
  email: string;
  role: 'admin' | 'usuario' | 'visualizador';
  status: 'ativo' | 'inativo';
  ultimoAcesso: string;
  criadoEm: string;
}

interface Filtros {
  busca: string;
  role: string;
  status: string;
}

const Usuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);
  const [filtros, setFiltros] = useState<Filtros>({
    busca: '',
    role: '',
    status: ''
  });

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    role: 'usuario' as 'admin' | 'usuario' | 'visualizador',
    status: 'ativo' as 'ativo' | 'inativo'
  });

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    setLoading(true);
    // Simular dados
    setTimeout(() => {
      const mockUsuarios: Usuario[] = [
        { id: 1, nome: 'Admin Sistema', email: 'admin@stockcontrol.com', role: 'admin', status: 'ativo', ultimoAcesso: '2024-01-15 14:30', criadoEm: '2024-01-01' },
        { id: 2, nome: 'João Silva', email: 'joao@empresa.com', role: 'usuario', status: 'ativo', ultimoAcesso: '2024-01-15 13:45', criadoEm: '2024-01-05' },
        { id: 3, nome: 'Maria Santos', email: 'maria@empresa.com', role: 'usuario', status: 'ativo', ultimoAcesso: '2024-01-15 12:20', criadoEm: '2024-01-10' },
        { id: 4, nome: 'Carlos Oliveira', email: 'carlos@empresa.com', role: 'visualizador', status: 'inativo', ultimoAcesso: '2024-01-10 16:45', criadoEm: '2024-01-12' },
        { id: 5, nome: 'Ana Costa', email: 'ana@empresa.com', role: 'usuario', status: 'ativo', ultimoAcesso: '2024-01-15 11:30', criadoEm: '2024-01-15' },
      ];

      setUsuarios(mockUsuarios);
      setLoading(false);
    }, 800);
  };

  const handleFiltroChange = (campo: keyof Filtros, valor: string) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const usuariosFiltrados = usuarios.filter(usuario => {
    const matchBusca = usuario.nome.toLowerCase().includes(filtros.busca.toLowerCase()) ||
                      usuario.email.toLowerCase().includes(filtros.busca.toLowerCase());
    const matchRole = !filtros.role || usuario.role === filtros.role;
    const matchStatus = !filtros.status || usuario.status === filtros.status;

    return matchBusca && matchRole && matchStatus;
  });

  const handleOpenModal = (usuario?: Usuario) => {
    if (usuario) {
      setEditingUsuario(usuario);
      setFormData({
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
        status: usuario.status
      });
    } else {
      setEditingUsuario(null);
      setFormData({
        nome: '',
        email: '',
        role: 'usuario',
        status: 'ativo'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUsuario(null);
    setFormData({
      nome: '',
      email: '',
      role: 'usuario',
      status: 'ativo'
    });
  };

  const handleSalvar = () => {
    if (!formData.nome || !formData.email) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    if (editingUsuario) {
      // Atualizar usuário existente
      setUsuarios(prev => prev.map(u =>
        u.id === editingUsuario.id
          ? { ...u, ...formData }
          : u
      ));
      alert('Usuário atualizado com sucesso!');
    } else {
      // Criar novo usuário
      const novoUsuario: Usuario = {
        id: Date.now(),
        ...formData,
        ultimoAcesso: '-',
        criadoEm: new Date().toLocaleDateString('pt-BR')
      };
      setUsuarios(prev => [...prev, novoUsuario]);
      alert('Usuário criado com sucesso!');
    }

    handleCloseModal();
  };

  const handleDeletar = (id: number) => {
    if (window.confirm('Tem certeza que deseja deletar este usuário?')) {
      setUsuarios(prev => prev.filter(u => u.id !== id));
      alert('Usuário deletado com sucesso!');
    }
  };

  const handleToggleStatus = (id: number) => {
    setUsuarios(prev => prev.map(u =>
      u.id === id
        ? { ...u, status: u.status === 'ativo' ? 'inativo' : 'ativo' }
        : u
    ));
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin': return 'badge danger';
      case 'usuario': return 'badge info';
      case 'visualizador': return 'badge warning';
      default: return 'badge';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    return status === 'ativo' ? 'badge success' : 'badge warning';
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner"></div>
        <p>Carregando usuários...</p>
      </div>
    );
  }

  return (
    <div className="usuarios-page">
      <div className="page-header">
        <div className="header-content">
          <h1>👤 Usuários</h1>
          <p>Gerencie os usuários do sistema</p>
        </div>
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          ➕ Novo Usuário
        </button>
      </div>

      {/* Filtros */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Buscar por nome ou email..."
            value={filtros.busca}
            onChange={(e) => handleFiltroChange('busca', e.target.value)}
          />
        </div>
        <div className="filter-select">
          <select
            value={filtros.role}
            onChange={(e) => handleFiltroChange('role', e.target.value)}
          >
            <option value="">Todos os roles</option>
            <option value="admin">Admin</option>
            <option value="usuario">Usuário</option>
            <option value="visualizador">Visualizador</option>
          </select>
        </div>
        <div className="filter-select">
          <select
            value={filtros.status}
            onChange={(e) => handleFiltroChange('status', e.target.value)}
          >
            <option value="">Todos os status</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>
      </div>

      {/* Tabela de Usuários */}
      <div className="table-section">
        <div className="table-header">
          <span>Total: {usuariosFiltrados.length} usuário(s)</span>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Último Acesso</th>
                <th>Criado em</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map(usuario => (
                <tr key={usuario.id}>
                  <td>{usuario.id}</td>
                  <td>{usuario.nome}</td>
                  <td>{usuario.email}</td>
                  <td>
                    <span className={getRoleBadgeClass(usuario.role)}>
                      {usuario.role}
                    </span>
                  </td>
                  <td>
                    <span className={getStatusBadgeClass(usuario.status)}>
                      {usuario.status}
                    </span>
                  </td>
                  <td>{usuario.ultimoAcesso}</td>
                  <td>{usuario.criadoEm}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon edit"
                        onClick={() => handleOpenModal(usuario)}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        className={`btn-icon ${usuario.status === 'ativo' ? 'warning' : 'success'}`}
                        onClick={() => handleToggleStatus(usuario.id)}
                        title={usuario.status === 'ativo' ? 'Desativar' : 'Ativar'}
                      >
                        {usuario.status === 'ativo' ? '🔒' : '🔓'}
                      </button>
                      <button
                        className="btn-icon delete"
                        onClick={() => handleDeletar(usuario.id)}
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
      </div>

      {/* Estado vazio */}
      {usuariosFiltrados.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">👤</div>
          <h3>Nenhum usuário encontrado</h3>
          <p>
            {filtros.busca || filtros.role || filtros.status
              ? 'Tente ajustar seus filtros.'
              : 'Comece criando seu primeiro usuário.'
            }
          </p>
          <button className="btn-primary" onClick={() => handleOpenModal()}>
            ➕ Novo Usuário
          </button>
        </div>
      )}

      {/* Modal de Cadastro/Edição */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingUsuario ? '✏️ Editar Usuário' : '➕ Novo Usuário'}</h2>
              <button className="modal-close" onClick={handleCloseModal}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Nome *</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Nome completo do usuário"
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div className="form-group">
                <label>Role *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'admin' | 'usuario' | 'visualizador' }))}
                >
                  <option value="usuario">Usuário</option>
                  <option value="visualizador">Visualizador</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'ativo' | 'inativo' }))}
                >
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={handleCloseModal}>
                Cancelar
              </button>
              <button className="btn-primary" onClick={handleSalvar}>
                {editingUsuario ? 'Salvar Alterações' : 'Criar Usuário'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuarios;
