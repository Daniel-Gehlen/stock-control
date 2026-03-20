import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './GlobalSearch.css';

interface SearchResult {
  id: number;
  type: 'produto' | 'categoria' | 'estoque' | 'movimentacao' | 'usuario';
  title: string;
  subtitle: string;
  url: string;
}

const GlobalSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Dados mockados para pesquisa
  const mockData: SearchResult[] = [
    { id: 1, type: 'produto', title: 'Notebook Dell Inspiron', subtitle: 'Código: NB001 - Eletrônicos', url: '/produtos' },
    { id: 2, type: 'produto', title: 'Mouse Logitech MX', subtitle: 'Código: MS001 - Eletrônicos', url: '/produtos' },
    { id: 3, type: 'produto', title: 'Teclado Mecânico RGB', subtitle: 'Código: TC001 - Eletrônicos', url: '/produtos' },
    { id: 4, type: 'categoria', title: 'Eletrônicos', subtitle: 'Produtos eletrônicos em geral', url: '/categorias' },
    { id: 5, type: 'categoria', title: 'Móveis', subtitle: 'Móveis para escritório', url: '/categorias' },
    { id: 6, type: 'estoque', title: 'Notebook Dell Inspiron', subtitle: 'Estoque: 15 unidades - Mín: 5', url: '/estoques' },
    { id: 7, type: 'estoque', title: 'Mouse Logitech MX', subtitle: 'Estoque: 3 unidades - Mín: 10', url: '/estoques' },
    { id: 8, type: 'movimentacao', title: 'Entrada - Notebook Dell', subtitle: '10 unidades - 15/01/2024', url: '/movimentacoes' },
    { id: 9, type: 'movimentacao', title: 'Saída - Mouse Logitech', subtitle: '5 unidades - 15/01/2024', url: '/movimentacoes' },
    { id: 10, type: 'usuario', title: 'Admin Sistema', subtitle: 'admin@stockcontrol.com - Admin', url: '/usuarios' },
    { id: 11, type: 'usuario', title: 'João Silva', subtitle: 'joao@empresa.com - Usuário', url: '/usuarios' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);

    // Simular delay de busca
    const timeoutId = setTimeout(() => {
      const filteredResults = mockData.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8); // Limitar a 8 resultados

      setResults(filteredResults);
      setIsOpen(filteredResults.length > 0);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleResultClick = (result: SearchResult) => {
    navigate(result.url);
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'produto': return '📦';
      case 'categoria': return '🏷️';
      case 'estoque': return '🏭';
      case 'movimentacao': return '🔄';
      case 'usuario': return '👤';
      default: return '🔍';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'produto': return 'Produto';
      case 'categoria': return 'Categoria';
      case 'estoque': return 'Estoque';
      case 'movimentacao': return 'Movimentação';
      case 'usuario': return 'Usuário';
      default: return 'Item';
    }
  };

  return (
    <div className="global-search" ref={searchRef}>
      <div className="search-input-container">
        <span className="search-icon">🔍</span>
        <input
          ref={inputRef}
          type="text"
          placeholder="Pesquisar produtos, categorias, usuários..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          className="search-input"
        />
        {loading && <span className="search-loading">⏳</span>}
        {query && !loading && (
          <button
            className="search-clear"
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
            }}
          >
            ✕
          </button>
        )}
      </div>

      {isOpen && (
        <div className="search-results">
          <div className="search-results-header">
            <span>Resultados para "{query}"</span>
            <span className="results-count">{results.length} encontrado(s)</span>
          </div>
          <div className="search-results-list">
            {results.map((result) => (
              <div
                key={`${result.type}-${result.id}`}
                className="search-result-item"
                onClick={() => handleResultClick(result)}
              >
                <div className="result-icon">{getTypeIcon(result.type)}</div>
                <div className="result-content">
                  <div className="result-title">{result.title}</div>
                  <div className="result-subtitle">{result.subtitle}</div>
                </div>
                <div className="result-type">
                  <span className="type-badge">{getTypeLabel(result.type)}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="search-results-footer">
            <span>Pressione ESC para fechar</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
