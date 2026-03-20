using System;
using System.ComponentModel.DataAnnotations;

namespace StockControl.API.Models
{
    public class Usuario
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Nome é obrigatório")]
        [StringLength(100, ErrorMessage = "Nome deve ter no máximo 100 caracteres")]
        public string Nome { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email é obrigatório")]
        [StringLength(200, ErrorMessage = "Email deve ter no máximo 200 caracteres")]
        [EmailAddress(ErrorMessage = "Email inválido")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Senha é obrigatória")]
        [StringLength(100, ErrorMessage = "Senha deve ter no máximo 100 caracteres")]
        public string SenhaHash { get; set; } = string.Empty;

        [Required(ErrorMessage = "Role é obrigatória")]
        [StringLength(50, ErrorMessage = "Role deve ter no máximo 50 caracteres")]
        public string Role { get; set; } = "Operador"; // Admin, Operador, Visualizador

        public bool Ativo { get; set; } = true;

        public DateTime DataCriacao { get; set; } = DateTime.Now;

        public DateTime? UltimoLogin { get; set; }

        [StringLength(500, ErrorMessage = "Avatar deve ter no máximo 500 caracteres")]
        public string Avatar { get; set; } = string.Empty;
    }
}
