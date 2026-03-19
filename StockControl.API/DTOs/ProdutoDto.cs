using System.ComponentModel.DataAnnotations;

namespace StockControl.API.DTOs
{
    public class ProdutoDto
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Nome é obrigatório")]
        [StringLength(200, ErrorMessage = "Nome deve ter no máximo 200 caracteres")]
        public string Nome { get; set; } = string.Empty;

        [Required(ErrorMessage = "Código é obrigatório")]
        [StringLength(50, ErrorMessage = "Código deve ter no máximo 50 caracteres")]
        public string Codigo { get; set; } = string.Empty;

        [Required(ErrorMessage = "Preço de compra é obrigatório")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Preço de compra deve ser maior que zero")]
        public decimal PrecoCompra { get; set; }

        [Required(ErrorMessage = "Preço de venda é obrigatório")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Preço de venda deve ser maior que zero")]
        public decimal PrecoVenda { get; set; }

        [Required(ErrorMessage = "Categoria é obrigatória")]
        public int CategoriaId { get; set; }

        public string? NomeCategoria { get; set; }
    }

    public class ProdutoCreateDto
    {
        [Required(ErrorMessage = "Nome é obrigatório")]
        [StringLength(200, ErrorMessage = "Nome deve ter no máximo 200 caracteres")]
        public string Nome { get; set; } = string.Empty;

        [Required(ErrorMessage = "Código é obrigatório")]
        [StringLength(50, ErrorMessage = "Código deve ter no máximo 50 caracteres")]
        public string Codigo { get; set; } = string.Empty;

        [Required(ErrorMessage = "Preço de compra é obrigatório")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Preço de compra deve ser maior que zero")]
        public decimal PrecoCompra { get; set; }

        [Required(ErrorMessage = "Preço de venda é obrigatório")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Preço de venda deve ser maior que zero")]
        public decimal PrecoVenda { get; set; }

        [Required(ErrorMessage = "Categoria é obrigatória")]
        public int CategoriaId { get; set; }
    }

    public class ProdutoUpdateDto
    {
        [Required(ErrorMessage = "Nome é obrigatório")]
        [StringLength(200, ErrorMessage = "Nome deve ter no máximo 200 caracteres")]
        public string Nome { get; set; } = string.Empty;

        [Required(ErrorMessage = "Código é obrigatório")]
        [StringLength(50, ErrorMessage = "Código deve ter no máximo 50 caracteres")]
        public string Codigo { get; set; } = string.Empty;

        [Required(ErrorMessage = "Preço de compra é obrigatório")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Preço de compra deve ser maior que zero")]
        public decimal PrecoCompra { get; set; }

        [Required(ErrorMessage = "Preço de venda é obrigatório")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Preço de venda deve ser maior que zero")]
        public decimal PrecoVenda { get; set; }

        [Required(ErrorMessage = "Categoria é obrigatória")]
        public int CategoriaId { get; set; }
    }
}
