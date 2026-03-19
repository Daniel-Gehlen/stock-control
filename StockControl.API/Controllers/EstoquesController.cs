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
    public class EstoquesController : ControllerBase
    {
        private readonly StockControlContext _context;

        public EstoquesController(StockControlContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<PaginatedResponse<Estoque>>>> GetEstoques(
            [FromQuery] int pagina = 1,
            [FromQuery] int tamanhoPagina = 10,
            [FromQuery] bool? estoqueBaixo = null)
        {
            var query = _context.Estoques
                .Include(e => e.Produto)
                .AsQueryable();

            // Filtro para estoque baixo
            if (estoqueBaixo.HasValue && estoqueBaixo.Value)
            {
                query = query.Where(e => e.QuantidadeAtual <= e.QuantidadeMinima);
            }

            var totalItens = await query.CountAsync();

            var estoques = await query
                .Skip((pagina - 1) * tamanhoPagina)
                .Take(tamanhoPagina)
                .ToListAsync();

            var paginacao = PaginatedResponse<Estoque>.Create(estoques, pagina, tamanhoPagina, totalItens);

            return Ok(ApiResponse<PaginatedResponse<Estoque>>.SucessoResponse(paginacao));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<Estoque>>> GetEstoque(int id)
        {
            var estoque = await _context.Estoques
                .Include(e => e.Produto)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (estoque == null)
            {
                return NotFound(ApiResponse<Estoque>.ErroResponse("Estoque não encontrado"));
            }

            return Ok(ApiResponse<Estoque>.SucessoResponse(estoque));
        }

        [HttpGet("produto/{produtoId}")]
        public async Task<ActionResult<ApiResponse<Estoque>>> GetEstoquePorProduto(int produtoId)
        {
            var estoque = await _context.Estoques
                .Include(e => e.Produto)
                .FirstOrDefaultAsync(e => e.ProdutoId == produtoId);

            if (estoque == null)
            {
                return NotFound(ApiResponse<Estoque>.ErroResponse("Estoque não encontrado para este produto"));
            }

            return Ok(ApiResponse<Estoque>.SucessoResponse(estoque));
        }

        [HttpGet("alertas")]
        public async Task<ActionResult<ApiResponse<List<Estoque>>>> GetAlertasEstoque()
        {
            var estoquesBaixos = await _context.Estoques
                .Include(e => e.Produto)
                .Where(e => e.QuantidadeAtual <= e.QuantidadeMinima)
                .ToListAsync();

            return Ok(ApiResponse<List<Estoque>>.SucessoResponse(estoquesBaixos,
                $"Encontrados {estoquesBaixos.Count} produtos com estoque baixo"));
        }
    }
}
