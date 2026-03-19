# Stock Control API

API para controle de estoque de produtos desenvolvida com ASP.NET Core 6.0.

## 🚀 Funcionalidades Implementadas

### ✅ Configuração e Documentação
- Configuração externalizada (`appsettings.json`)
- Swagger/OpenAPI para documentação da API
- CORS configurado para permitir requisições de qualquer origem

### ✅ Validação e Padrões
- DataAnnotations em todos os models
- DTOs para padronização de dados
- Response Wrapper padronizado (`ApiResponse<T>`)
- Paginação implementada (`PaginatedResponse<T>`)

### ✅ API REST Completa
- **Produtos**: CRUD completo com paginação, filtros e busca
- **Categorias**: CRUD completo
- **Estoques**: Listagem, consulta por ID/produto, alertas de estoque baixo
- **Movimentações**: Registro, listagem, filtros por data/tipo, resumo

### ✅ Tratamento de Erros
- Middleware global de exception handling
- Respostas de erro padronizadas
- Validação robusta de entrada

### ✅ Funcionalidades de Negócio
- Alertas de estoque baixo (baseado em `QuantidadeMinima`)
- Resumo de movimentações (entradas/saídas/saldo)
- Filtros avançados por data, tipo, produto
- Paginação em todos os endpoints de listagem

## 📋 Endpoints da API

### Produtos (`/api/produtos`)
- `GET` - Listar produtos (paginação, busca, filtro por categoria)
- `GET /{id}` - Obter produto por ID
- `POST` - Criar produto
- `PUT /{id}` - Atualizar produto
- `DELETE /{id}` - Deletar produto

### Categorias (`/api/categorias`)
- `GET` - Listar categorias
- `GET /{id}` - Obter categoria por ID
- `POST` - Criar categoria
- `PUT /{id}` - Atualizar categoria
- `DELETE /{id}` - Deletar categoria

### Estoques (`/api/estoques`)
- `GET` - Listar estoques (paginação, filtro estoque baixo)
- `GET /{id}` - Obter estoque por ID
- `GET /produto/{produtoId}` - Obter estoque por produto
- `GET /alertas` - Produtos com estoque baixo

### Movimentações (`/api/movimentacoes`)
- `GET` - Listar movimentações (paginação, filtros)
- `GET /{id}` - Obter movimentação por ID
- `POST` - Registrar movimentação (entrada/saída)
- `GET /produto/{produtoId}` - Movimentações por produto
- `GET /resumo` - Resumo de entradas/saídas

## 🛠️ Tecnologias

- ASP.NET Core 6.0
- Entity Framework Core
- SQL Server
- Swagger/OpenAPI
- C#

## 📦 Como Executar

1. Clone o repositório
2. Configure a connection string em `appsettings.json`
3. Execute as migrations:
   ```bash
   dotnet ef database update
   ```
4. Execute a API:
   ```bash
   dotnet run
   ```
5. Acesse a documentação Swagger em: `https://localhost:5001`

## 📊 Estrutura do Banco de Dados

- **Produtos**: Nome, código, preços de compra/venda
- **Categorias**: Nome, descrição
- **Estoques**: Quantidade atual/mínima, última atualização
- **Movimentações**: Tipo (entrada/saída), quantidade, data, observações

## 🔒 Validações

- Todos os campos obrigatórios validados
- Preços devem ser maiores que zero
- Quantidades não podem ser negativas
- Tipos de movimentação: "Entrada" ou "Saída"
- Validação de estoque insuficiente para saídas

## 📝 Próximos Passos

- [ ] Autenticação e autorização (JWT)
- [ ] Testes unitários e de integração
- [ ] Logging estruturado
- [ ] Cache para melhor performance
- [ ] Frontend em React/Vue
