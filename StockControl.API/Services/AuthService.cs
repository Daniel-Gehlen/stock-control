using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using StockControl.API.Data;
using StockControl.API.DTOs;
using StockControl.API.Models;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace StockControl.API.Services
{
    public class AuthService
    {
        private readonly StockControlContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(StockControlContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<AuthResponseDto> Login(LoginDto loginDto)
        {
            try
            {
                var usuario = _context.Usuarios.FirstOrDefault(u => u.Email == loginDto.Email);

                if (usuario == null)
                {
                    return new AuthResponseDto
                    {
                        Sucesso = false,
                        Mensagem = "Email ou senha inválidos"
                    };
                }

                if (!usuario.Ativo)
                {
                    return new AuthResponseDto
                    {
                        Sucesso = false,
                        Mensagem = "Usuário desativado"
                    };
                }

                if (!VerificarSenha(loginDto.Senha, usuario.SenhaHash))
                {
                    return new AuthResponseDto
                    {
                        Sucesso = false,
                        Mensagem = "Email ou senha inválidos"
                    };
                }

                // Atualizar último login
                usuario.UltimoLogin = DateTime.Now;
                await _context.SaveChangesAsync();

                // Gerar token
                var token = GerarToken(usuario);
                var expiracao = DateTime.Now.AddHours(24);

                return new AuthResponseDto
                {
                    Sucesso = true,
                    Mensagem = "Login realizado com sucesso",
                    Token = token,
                    Expiracao = expiracao,
                    Usuario = new UsuarioDto
                    {
                        Id = usuario.Id,
                        Nome = usuario.Nome,
                        Email = usuario.Email,
                        Role = usuario.Role,
                        Ativo = usuario.Ativo,
                        DataCriacao = usuario.DataCriacao,
                        UltimoLogin = usuario.UltimoLogin,
                        Avatar = usuario.Avatar
                    }
                };
            }
            catch (Exception ex)
            {
                return new AuthResponseDto
                {
                    Sucesso = false,
                    Mensagem = $"Erro ao realizar login: {ex.Message}"
                };
            }
        }

        public async Task<AuthResponseDto> Registro(RegistroDto registroDto)
        {
            try
            {
                // Verificar se email já existe
                if (_context.Usuarios.Any(u => u.Email == registroDto.Email))
                {
                    return new AuthResponseDto
                    {
                        Sucesso = false,
                        Mensagem = "Email já cadastrado"
                    };
                }

                // Criar hash da senha
                var senhaHash = GerarHashSenha(registroDto.Senha);

                // Criar usuário
                var usuario = new Usuario
                {
                    Nome = registroDto.Nome,
                    Email = registroDto.Email,
                    SenhaHash = senhaHash,
                    Role = registroDto.Role,
                    Ativo = true,
                    DataCriacao = DateTime.Now
                };

                _context.Usuarios.Add(usuario);
                await _context.SaveChangesAsync();

                // Gerar token
                var token = GerarToken(usuario);
                var expiracao = DateTime.Now.AddHours(24);

                return new AuthResponseDto
                {
                    Sucesso = true,
                    Mensagem = "Usuário registrado com sucesso",
                    Token = token,
                    Expiracao = expiracao,
                    Usuario = new UsuarioDto
                    {
                        Id = usuario.Id,
                        Nome = usuario.Nome,
                        Email = usuario.Email,
                        Role = usuario.Role,
                        Ativo = usuario.Ativo,
                        DataCriacao = usuario.DataCriacao,
                        UltimoLogin = usuario.UltimoLogin,
                        Avatar = usuario.Avatar
                    }
                };
            }
            catch (Exception ex)
            {
                return new AuthResponseDto
                {
                    Sucesso = false,
                    Mensagem = $"Erro ao registrar usuário: {ex.Message}"
                };
            }
        }

        private string GerarToken(Usuario usuario)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] ?? "ChaveSecretaPadrao123!@#");

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
                    new Claim(ClaimTypes.Name, usuario.Nome),
                    new Claim(ClaimTypes.Email, usuario.Email),
                    new Claim(ClaimTypes.Role, usuario.Role)
                }),
                Expires = DateTime.Now.AddHours(24),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private string GerarHashSenha(string senha)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(senha));
            return Convert.ToBase64String(hashedBytes);
        }

        private bool VerificarSenha(string senha, string hash)
        {
            var hashSenha = GerarHashSenha(senha);
            return hashSenha == hash;
        }
    }
}
