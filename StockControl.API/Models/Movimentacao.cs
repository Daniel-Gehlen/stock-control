using System;
using System.ComponentModel.DataAnnotations;

namespace StockControl.API.Models
{
    public class Movimentacao
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Produto é obrigatório")]
        public int ProdutoId { get; set; }

        public Produto? Produto { get; set; }

        [Required(ErrorMessage = "Tipo é obrigatório")]
        [StringLength(20, ErrorMessage = "Tipo deve ter no máximo 20 caracteres")]
        public string Tipo { get; set; } = string.Empty;

        [Required(ErrorMessage = "Quantidade é obrigatória")]
        [Range(1, int.MaxValue, ErrorMessage = "Quantidade deve ser maior que zero")]
        public int Quantidade { get; set; }

        public DateTime Data { get; set; }

        [StringLength(500, ErrorMessage = "Observação deve ter no máximo 500 caracteres")]
        public string Observacao { get; set; } = string.Empty;
    }
}
