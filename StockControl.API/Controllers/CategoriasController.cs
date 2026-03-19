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
    public class CategoriasController : ControllerBase
    {
        private readonly StockControlContext _context;

        public CategoriasController(StockControlContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<Categoria>>>> GetCategorias()
        {
            var categorias = await _context.Categorias.ToListAsync();
            return Ok(ApiResponse<List<Categoria>>.SucessoResponse(categorias));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<Categoria>>> GetCategoria(int id)
        {
            var categoria = await _context.Categorias.FindAsync(id);

            if (categoria == null)
            {
                return NotFound(ApiResponse<Categoria>.ErroResponse("Categoria não encontrada"));
            }

            return Ok(ApiResponse<Categoria>.SucessoResponse(categoria));
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<Categoria>>> CriarCategoria(Categoria categoria)
        {
            _context.Categorias.Add(categoria);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCategoria), new { id = categoria.Id },
                ApiResponse<Categoria>.SucessoResponse(categoria, "Categoria criada com sucesso"));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<Categoria>>> AtualizarCategoria(int id, Categoria categoria)
        {
            if (id != categoria.Id)
            {
                return BadRequest(ApiResponse<Categoria>.ErroResponse("ID da categoria não confere"));
            }

            var categoriaExistente = await _context.Categorias.FindAsync(id);
            if (categoriaExistente == null)
            {
                return NotFound(ApiResponse<Categoria>.ErroResponse("Categoria não encontrada"));
            }

            categoriaExistente.Nome = categoria.Nome;
            categoriaExistente.Descricao = categoria.Descricao;

            await _context.SaveChangesAsync();

            return Ok(ApiResponse<Categoria>.SucessoResponse(categoriaExistente, "Categoria atualizada com sucesso"));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<object>>> DeletarCategoria(int id)
        {
            var categoria = await _context.Categorias.FindAsync(id);

            if (categoria == null)
            {
                return NotFound(ApiResponse<object>.ErroResponse("Categoria não encontrada"));
            }

            // Verificar se há produtos vinculados
            var produtosVinculados = await _context.Produtos.AnyAsync(p => p.CategoriaId == id);
            if (produtosVinculados)
            {
                return BadRequest(ApiResponse<object>.ErroResponse("Não é possível deletar categoria com produtos vinculados"));
            }

            _context.Categorias.Remove(categoria);
            await _context.SaveChangesAsync();

            return Ok(ApiResponse<object>.SucessoResponse(null, "Categoria deletada com sucesso"));
        }
    }
}
