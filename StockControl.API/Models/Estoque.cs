using System;
using System.ComponentModel.DataAnnotations;

namespace StockControl.API.Models
{
    public class Estoque
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Produto é obrigatório")]
        public int ProdutoId { get; set; }

        public Produto? Produto { get; set; }

        [Required(ErrorMessage = "Quantidade atual é obrigatória")]
        [Range(0, int.MaxValue, ErrorMessage = "Quantidade atual deve ser maior ou igual a zero")]
        public int QuantidadeAtual { get; set; }

        [Required(ErrorMessage = "Quantidade mínima é obrigatória")]
        [Range(0, int.MaxValue, ErrorMessage = "Quantidade mínima deve ser maior ou igual a zero")]
        public int QuantidadeMinima { get; set; }

        public DateTime UltimaAtualizacao { get; set; }
    }
}
