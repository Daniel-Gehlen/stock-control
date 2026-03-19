using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StockControl.API.Data;
using StockControl.API.DTOs;
using StockControl.API.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StockControl.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProdutosController : ControllerBase
    {
        private readonly StockControlContext _context;

        public ProdutosController(StockControlContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<PaginatedResponse<ProdutoDto>>>> GetProdutos(
            [FromQuery] int pagina = 1,
            [FromQuery] int tamanhoPagina = 10,
            [FromQuery] string? busca = null,
            [FromQuery] int? categoriaId = null)
        {
            var query = _context.Produtos
                .Include(p => p.Categoria)
                .AsQueryable();

            // Filtros
            if (!string.IsNullOrEmpty(busca))
            {
                query = query.Where(p => p.Nome.Contains(busca) || p.Codigo.Contains(busca));
            }

            if (categoriaId.HasValue)
            {
                query = query.Where(p => p.CategoriaId == categoriaId.Value);
            }

            var totalItens = await query.CountAsync();

            var produtos = await query
                .Skip((pagina - 1) * tamanhoPagina)
                .Take(tamanhoPagina)
                .Select(p => new ProdutoDto
                {
                    Id = p.Id,
                    Nome = p.Nome,
                    Codigo = p.Codigo,
                    PrecoCompra = p.PrecoCompra,
                    PrecoVenda = p.PrecoVenda,
                    CategoriaId = p.CategoriaId,
                    NomeCategoria = p.Categoria != null ? p.Categoria.Nome : null
                })
                .ToListAsync();

            var paginacao = PaginatedResponse<ProdutoDto>.Create(produtos, pagina, tamanhoPagina, totalItens);

            return Ok(ApiResponse<PaginatedResponse<ProdutoDto>>.SucessoResponse(paginacao));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<ProdutoDto>>> GetProduto(int id)
        {
            var produto = await _context.Produtos
                .Include(p => p.Categoria)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (produto == null)
            {
                return NotFound(ApiResponse<ProdutoDto>.ErroResponse("Produto não encontrado"));
            }

            var produtoDto = new ProdutoDto
            {
                Id = produto.Id,
                Nome = produto.Nome,
                Codigo = produto.Codigo,
                PrecoCompra = produto.PrecoCompra,
                PrecoVenda = produto.PrecoVenda,
                CategoriaId = produto.CategoriaId,
                NomeCategoria = produto.Categoria?.Nome
            };

            return Ok(ApiResponse<ProdutoDto>.SucessoResponse(produtoDto));
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<ProdutoDto>>> CriarProduto(ProdutoCreateDto produtoDto)
        {
            var produto = new Produto
            {
                Nome = produtoDto.Nome,
                Codigo = produtoDto.Codigo,
                PrecoCompra = produtoDto.PrecoCompra,
                PrecoVenda = produtoDto.PrecoVenda,
                CategoriaId = produtoDto.CategoriaId
            };

            _context.Produtos.Add(produto);
            await _context.SaveChangesAsync();

            var resultado = new ProdutoDto
            {
                Id = produto.Id,
                Nome = produto.Nome,
                Codigo = produto.Codigo,
                PrecoCompra = produto.PrecoCompra,
                PrecoVenda = produto.PrecoVenda,
                CategoriaId = produto.CategoriaId
            };

            return CreatedAtAction(nameof(GetProduto), new { id = produto.Id },
                ApiResponse<ProdutoDto>.SucessoResponse(resultado, "Produto criado com sucesso"));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<ProdutoDto>>> AtualizarProduto(int id, ProdutoUpdateDto produtoDto)
        {
            var produto = await _context.Produtos.FindAsync(id);

            if (produto == null)
            {
                return NotFound(ApiResponse<ProdutoDto>.ErroResponse("Produto não encontrado"));
            }

            produto.Nome = produtoDto.Nome;
            produto.Codigo = produtoDto.Codigo;
            produto.PrecoCompra = produtoDto.PrecoCompra;
            produto.PrecoVenda = produtoDto.PrecoVenda;
            produto.CategoriaId = produtoDto.CategoriaId;

            await _context.SaveChangesAsync();

            var resultado = new ProdutoDto
            {
                Id = produto.Id,
                Nome = produto.Nome,
                Codigo = produto.Codigo,
                PrecoCompra = produto.PrecoCompra,
                PrecoVenda = produto.PrecoVenda,
                CategoriaId = produto.CategoriaId
            };

            return Ok(ApiResponse<ProdutoDto>.SucessoResponse(resultado, "Produto atualizado com sucesso"));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<object>>> DeletarProduto(int id)
        {
            var produto = await _context.Produtos.FindAsync(id);

            if (produto == null)
            {
                return NotFound(ApiResponse<object>.ErroResponse("Produto não encontrado"));
            }

            _context.Produtos.Remove(produto);
            await _context.SaveChangesAsync();

            return Ok(ApiResponse<object>.SucessoResponse(null, "Produto deletado com sucesso"));
        }
    }
}
