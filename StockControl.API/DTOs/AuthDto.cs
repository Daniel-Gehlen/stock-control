using System;
using System.ComponentModel.DataAnnotations;

namespace StockControl.API.DTOs
{
    public class LoginDto
    {
        [Required(ErrorMessage = "Email é obrigatório")]
        [EmailAddress(ErrorMessage = "Email inválido")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Senha é obrigatória")]
        public string Senha { get; set; } = string.Empty;
    }

    public class RegistroDto
    {
        [Required(ErrorMessage = "Nome é obrigatório")]
        [StringLength(100, ErrorMessage = "Nome deve ter no máximo 100 caracteres")]
        public string Nome { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email é obrigatório")]
        [StringLength(200, ErrorMessage = "Email deve ter no máximo 200 caracteres")]
        [EmailAddress(ErrorMessage = "Email inválido")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Senha é obrigatória")]
        [StringLength(100, ErrorMessage = "Senha deve ter no máximo 100 caracteres")]
        [MinLength(6, ErrorMessage = "Senha deve ter no mínimo 6 caracteres")]
        public string Senha { get; set; } = string.Empty;

        [Required(ErrorMessage = "Confirmação de senha é obrigatória")]
        [Compare("Senha", ErrorMessage = "Senhas não conferem")]
        public string ConfirmarSenha { get; set; } = string.Empty;

        [StringLength(50, ErrorMessage = "Role deve ter no máximo 50 caracteres")]
        public string Role { get; set; } = "Operador";
    }

    public class AuthResponseDto
    {
        public bool Sucesso { get; set; }
        public string Mensagem { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public DateTime Expiracao { get; set; }
        public UsuarioDto? Usuario { get; set; }
    }

    public class UsuarioDto
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public bool Ativo { get; set; }
        public DateTime DataCriacao { get; set; }
        public DateTime? UltimoLogin { get; set; }
        public string Avatar { get; set; } = string.Empty;
    }
}
