using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace StockControl.API.Models
{
    public class Categoria
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Nome é obrigatório")]
        [StringLength(100, ErrorMessage = "Nome deve ter no máximo 100 caracteres")]
        public string Nome { get; set; } = string.Empty;

        [StringLength(500, ErrorMessage = "Descrição deve ter no máximo 500 caracteres")]
        public string Descricao { get; set; } = string.Empty;

        public List<Produto> Produtos { get; set; } = new();
    }
}
