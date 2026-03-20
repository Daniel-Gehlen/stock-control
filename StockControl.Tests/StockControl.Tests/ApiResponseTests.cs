using StockControl.API.DTOs;
using Xunit;

namespace StockControl.Tests
{
    public class ApiResponseTests
    {
        [Fact]
        public void ApiResponse_DeveCriarSucessoResponse_Corretamente()
        {
            // Arrange
            var dados = "dados de teste";
            var mensagem = "Operação realizada com sucesso";

            // Act
            var response = ApiResponse<string>.SucessoResponse(dados, mensagem);

            // Assert
            Assert.True(response.Sucesso);
            Assert.Equal(mensagem, response.Mensagem);
            Assert.Equal(dados, response.Dados);
            Assert.Empty(response.Erros);
        }

        [Fact]
        public void ApiResponse_DeveCriarSucessoResponse_ComMensagemPadrao()
        {
            // Arrange
            var dados = "dados de teste";

            // Act
            var response = ApiResponse<string>.SucessoResponse(dados);

            // Assert
            Assert.True(response.Sucesso);
            Assert.Equal("Operação realizada com sucesso", response.Mensagem);
            Assert.Equal(dados, response.Dados);
            Assert.Empty(response.Erros);
        }

        [Fact]
        public void ApiResponse_DeveCriarErroResponse_Corretamente()
        {
            // Arrange
            var mensagem = "Erro ao processar";
            var erros = new List<string> { "Erro 1", "Erro 2" };

            // Act
            var response = ApiResponse<string>.ErroResponse(mensagem, erros);

            // Assert
            Assert.False(response.Sucesso);
            Assert.Equal(mensagem, response.Mensagem);
            Assert.Null(response.Dados);
            Assert.Equal(erros, response.Erros);
        }

        [Fact]
        public void ApiResponse_DeveCriarErroResponse_SemErros()
        {
            // Arrange
            var mensagem = "Erro ao processar";

            // Act
            var response = ApiResponse<string>.ErroResponse(mensagem);

            // Assert
            Assert.False(response.Sucesso);
            Assert.Equal(mensagem, response.Mensagem);
            Assert.Null(response.Dados);
            Assert.Empty(response.Erros);
        }

        [Fact]
        public void ApiResponse_DeveInicializarComValoresPadrao()
        {
            // Act
            var response = new ApiResponse<string>();

            // Assert
            Assert.False(response.Sucesso);
            Assert.Equal(string.Empty, response.Mensagem);
            Assert.Null(response.Dados);
            Assert.Empty(response.Erros);
        }
    }
}
