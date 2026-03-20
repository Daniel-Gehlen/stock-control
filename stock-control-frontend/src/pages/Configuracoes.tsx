import React, { useState, useEffect } from 'react';
import './Configuracoes.css';

interface Configuracao {
  id: number;
  chave: string;
  valor: string;
  descricao: string;
  tipo: 'texto' | 'numero' | 'booleano' | 'select';
  opcoes?: string[];
}

const Configuracoes: React.FC = () => {
  const [configuracoes, setConfiguracoes] = useState<Configuracao[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);

  useEffect(() => {
    carregarConfiguracoes();
  }, []);

  const carregarConfiguracoes = async () => {
    setLoading(true);
    // Simular dados
    setTimeout(() => {
      const mockConfiguracoes: Configuracao[] = [
        { id: 1, chave: 'estoque_minimo_padrao', valor: '5', descricao: 'Quantidade mínima padrão para alertas de estoque', tipo: 'numero' },
        { id: 2, chave: 'moeda', valor: 'BRL', descricao: 'Moeda utilizada no sistema', tipo: 'select', opcoes: ['BRL', 'USD', 'EUR'] },
        { id: 3, chave: 'notificacoes_email', valor: 'true', descricao: 'Enviar notificações por email', tipo: 'booleano' },
        { id: 4, chave: 'backup_automatico', valor: 'true', descricao: 'Realizar backup automático diário', tipo: 'booleano' },
        { id: 5, chave: 'formato_data', valor: 'DD/MM/YYYY', descricao: 'Formato de data exibido no sistema', tipo: 'select', opcoes: ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'] },
        { id: 6, chave: 'itens_por_pagina', valor: '10', descricao: 'Número de itens exibidos por página', tipo: 'numero' },
        { id: 7, chave: 'timeout_sessao', valor: '30', descricao: 'Tempo limite da sessão em minutos', tipo: 'numero' },
        { id: 8, chave: 'tema', valor: 'claro', descricao: 'Tema visual do sistema', tipo: 'select', opcoes: ['claro', 'escuro', 'auto'] },
      ];

      setConfiguracoes(mockConfiguracoes);
      setLoading(false);
    }, 800);
  };

  const handleSalvar = async (configuracao: Configuracao) => {
    setSaving(configuracao.id);

    // Simular salvamento
    setTimeout(() => {
      setConfiguracoes(prev => prev.map(c =>
        c.id === configuracao.id ? configuracao : c
      ));
      setSaving(null);
      alert('Configuração salva com sucesso!');
    }, 1000);
  };

  const handleChange = (id: number, valor: string) => {
    setConfiguracoes(prev => prev.map(c =>
      c.id === id ? { ...c, valor } : c
    ));
  };

  const renderInput = (configuracao: Configuracao) => {
    switch (configuracao.tipo) {
      case 'booleano':
        return (
          <div className="toggle-switch">
            <input
              type="checkbox"
              id={`config-${configuracao.id}`}
              checked={configuracao.valor === 'true'}
              onChange={(e) => handleChange(configuracao.id, e.target.checked.toString())}
            />
            <label htmlFor={`config-${configuracao.id}`} className="toggle-label">
              <span className="toggle-slider"></span>
            </label>
          </div>
        );
      case 'select':
        return (
          <select
            value={configuracao.valor}
            onChange={(e) => handleChange(configuracao.id, e.target.value)}
          >
            {configuracao.opcoes?.map(opcao => (
              <option key={opcao} value={opcao}>{opcao}</option>
            ))}
          </select>
        );
      case 'numero':
        return (
          <input
            type="number"
            value={configuracao.valor}
            onChange={(e) => handleChange(configuracao.id, e.target.value)}
          />
        );
      default:
        return (
          <input
            type="text"
            value={configuracao.valor}
            onChange={(e) => handleChange(configuracao.id, e.target.value)}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner"></div>
        <p>Carregando configurações...</p>
      </div>
    );
  }

  return (
    <div className="configuracoes-page">
      <div className="page-header">
        <div className="header-content">
          <h1>⚙️ Configurações</h1>
          <p>Gerencie as configurações do sistema</p>
        </div>
      </div>

      <div className="configuracoes-grid">
        {configuracoes.map(configuracao => (
          <div key={configuracao.id} className="configuracao-card">
            <div className="configuracao-header">
              <h3>{configuracao.chave.replace(/_/g, ' ').toUpperCase()}</h3>
              <span className="configuracao-tipo">{configuracao.tipo}</span>
            </div>
            <p className="configuracao-descricao">{configuracao.descricao}</p>
            <div className="configuracao-input">
              {renderInput(configuracao)}
            </div>
            <div className="configuracao-actions">
              <button
                className="btn-primary"
                onClick={() => handleSalvar(configuracao)}
                disabled={saving === configuracao.id}
              >
                {saving === configuracao.id ? 'Salvando...' : '💾 Salvar'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="configuracoes-info">
        <h2>ℹ️ Informações do Sistema</h2>
        <div className="info-grid">
          <div className="info-card">
            <h4>Versão</h4>
            <p>1.0.0</p>
          </div>
          <div className="info-card">
            <h4>Último Backup</h4>
            <p>15/01/2024 03:00</p>
          </div>
          <div className="info-card">
            <h4>Usuários Ativos</h4>
            <p>5</p>
          </div>
          <div className="info-card">
            <h4>Espaço Utilizado</h4>
            <p>2.4 GB</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;
