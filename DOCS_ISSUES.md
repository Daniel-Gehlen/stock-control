# Issues do Projeto

## #1: Implementar Modo Escuro Global em toda a aplicação

### Descrição
A aplicação atualmente possui suporte parcial ao modo escuro, afetando apenas cards, modais e barras. O objetivo é garantir que toda a interface (fundo de todas as páginas, sidebar, header e componentes internos) assuma tons escuros de forma consistente quando o modo escuro for selecionado.

### Objetivos
- [x] Refatorar `globals.css` para usar variáveis de tema em vez de cores fixas (white, gray-50, etc.).
- [x] Atualizar `theme.css` para garantir uma cobertura global em seletores como `body`, `html` e `#root`.
- [x] Ajustar `Layout.css` para tematizar a Sidebar e o Header de forma dinâmica.
- [x] Revisar e atualizar todos os arquivos CSS de páginas específicas (Dashboard, Produtos, Categorias, etc.).
- [x] Harmonizar o sistema de cores de texto para garantir legibilidade (text-primary claro no modo escuro).
- [x] Atualizar o componente de busca global (`GlobalSearch.css`).

### Status
- **Finalizado**: 2026-03-20
- **Responsável**: Antigravity
