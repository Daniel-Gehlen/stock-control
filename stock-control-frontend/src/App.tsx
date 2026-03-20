import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Produtos from './pages/Produtos';
import Categorias from './pages/Categorias';
import Estoques from './pages/Estoques';
import Movimentacoes from './pages/Movimentacoes';
import Configuracoes from './pages/Configuracoes';
import Usuarios from './pages/Usuarios';
import './styles/globals.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/estoques" element={<Estoques />} />
          <Route path="/movimentacoes" element={<Movimentacoes />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="/usuarios" element={<Usuarios />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
