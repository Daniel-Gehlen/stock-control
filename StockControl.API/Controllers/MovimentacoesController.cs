using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StockControl.API.Data;
using StockControl.API.DTOs;
using StockControl.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StockControl.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MovimentacoesController : ControllerBase
    {
        private readonly StockControlContext _context;

        public MovimentacoesController(StockControlContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<PaginatedResponse<Movimentacao>>>> GetMovimentacoes(
            [FromQuery] int pagina = 1,
            [FromQuery] int tamanhoPagina = 10,
            [FromQuery] string? tipo = null,
            [FromQuery] int? produtoId = null,
            [FromQuery] DateTime? dataInicio = null,
            [FromQuery] DateTime? dataFim = null)
        {
            var query = _context.Movimentacoes
                .Include(m => m.Produto)
                .AsQueryable();

            // Filtros
            if (!string.IsNullOrEmpty(tipo))
            {
                query = query.Where(m => m.Tipo == tipo);
            }

            if (produtoId.HasValue)
            {
                query = query.Where(m => m.ProdutoId == produtoId.Value);
            }

            if (dataInicio.HasValue)
            {
                query = query.Where(m => m.Data >= dataInicio.Value);
            }

            if (dataFim.HasValue)
            {
                query = query.Where(m => m.Data <= dataFim.Value);
            }

            var totalItens = await query.CountAsync();

            var movimentacoes = await query
                .OrderByDescending(m => m.Data)
                .Skip((pagina - 1) * tamanhoPagina)
                .Take(tamanhoPagina)
                .ToListAsync();

            var paginacao = PaginatedResponse<Movimentacao>.Create(movimentacoes, pagina, tamanhoPagina, totalItens);

            return Ok(ApiResponse<PaginatedResponse<Movimentacao>>.SucessoResponse(paginacao));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<Movimentacao>>> GetMovimentacao(int id)
        {
            var movimentacao = await _context.Movimentacoes
                .Include(m => m.Produto)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (movimentacao == null)
            {
                return NotFound(ApiResponse<Movimentacao>.ErroResponse("Movimentação não encontrada"));
            }

            return Ok(ApiResponse<Movimentacao>.SucessoResponse(movimentacao));
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<Movimentacao>>> RegistrarMovimentacao(Movimentacao movimentacao)
        {
            // Validar se o produto existe
            var produto = await _context.Produtos.FindAsync(movimentacao.ProdutoId);
            if (produto == null)
            {
                return BadRequest(ApiResponse<Movimentacao>.ErroResponse("Produto não encontrado"));
            }

            // Validar tipo de movimentação
            if (movimentacao.Tipo != "Entrada" && movimentacao.Tipo != "Saída")
            {
                return BadRequest(ApiResponse<Movimentacao>.ErroResponse("Tipo de movimentação inválido. Use 'Entrada' ou 'Saída'"));
            }

            movimentacao.Data = DateTime.Now;
            _context.Movimentacoes.Add(movimentacao);

            // Atualizar estoque
            var estoque = await _context.Estoques.FirstOrDefaultAsync(e => e.ProdutoId == movimentacao.ProdutoId);
            if (estoque != null)
            {
                if (movimentacao.Tipo == "Entrada")
                {
                    estoque.QuantidadeAtual += movimentacao.Quantidade;
                }
                else
                {
                    if (estoque.QuantidadeAtual < movimentacao.Quantidade)
                    {
                        return BadRequest(ApiResponse<Movimentacao>.ErroResponse("Quantidade insuficiente em estoque"));
                    }
                    estoque.QuantidadeAtual -= movimentacao.Quantidade;
                }
                estoque.UltimaAtualizacao = DateTime.Now;
            }

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMovimentacao), new { id = movimentacao.Id },
                ApiResponse<Movimentacao>.SucessoResponse(movimentacao, "Movimentação registrada com sucesso"));
        }

        [HttpGet("produto/{produtoId}")]
        public async Task<ActionResult<ApiResponse<List<Movimentacao>>>> GetMovimentacoesPorProduto(int produtoId)
        {
            var movimentacoes = await _context.Movimentacoes
                .Include(m => m.Produto)
                .Where(m => m.ProdutoId == produtoId)
                .OrderByDescending(m => m.Data)
                .ToListAsync();

            return Ok(ApiResponse<List<Movimentacao>>.SucessoResponse(movimentacoes));
        }

        [HttpGet("resumo")]
        public async Task<ActionResult<ApiResponse<object>>> GetResumoMovimentacoes(
            [FromQuery] DateTime? dataInicio = null,
            [FromQuery] DateTime? dataFim = null)
        {
            var query = _context.Movimentacoes.AsQueryable();

            if (dataInicio.HasValue)
            {
                query = query.Where(m => m.Data >= dataInicio.Value);
            }

            if (dataFim.HasValue)
            {
                query = query.Where(m => m.Data <= dataFim.Value);
            }

            var entradas = await query.Where(m => m.Tipo == "Entrada").SumAsync(m => m.Quantidade);
            var saidas = await query.Where(m => m.Tipo == "Saída").SumAsync(m => m.Quantidade);

            var resumo = new
            {
                TotalEntradas = entradas,
                TotalSaidas = saidas,
                Saldo = entradas - saidas
            };

            return Ok(ApiResponse<object>.SucessoResponse(resumo));
        }
    }
}
