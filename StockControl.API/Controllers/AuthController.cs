using Microsoft.AspNetCore.Mvc;
using StockControl.API.DTOs;
using StockControl.API.Services;
using System.Threading.Tasks;

namespace StockControl.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<ApiResponse<AuthResponseDto>>> Login(LoginDto loginDto)
        {
            var resultado = await _authService.Login(loginDto);

            if (!resultado.Sucesso)
            {
                return BadRequest(ApiResponse<AuthResponseDto>.ErroResponse(resultado.Mensagem));
            }

            return Ok(ApiResponse<AuthResponseDto>.SucessoResponse(resultado, "Login realizado com sucesso"));
        }

        [HttpPost("registro")]
        public async Task<ActionResult<ApiResponse<AuthResponseDto>>> Registro(RegistroDto registroDto)
        {
            var resultado = await _authService.Registro(registroDto);

            if (!resultado.Sucesso)
            {
                return BadRequest(ApiResponse<AuthResponseDto>.ErroResponse(resultado.Mensagem));
            }

            return Ok(ApiResponse<AuthResponseDto>.SucessoResponse(resultado, "Usuário registrado com sucesso"));
        }

        [HttpGet("perfil")]
        public async Task<ActionResult<ApiResponse<UsuarioDto>>> GetPerfil()
        {
            // Implementação simples - em produção, usar claims do token JWT
            return Ok(ApiResponse<UsuarioDto>.SucessoResponse(new UsuarioDto(), "Perfil do usuário"));
        }
    }
}
