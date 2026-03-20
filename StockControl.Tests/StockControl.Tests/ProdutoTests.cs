using StockControl.API.Models;
using System.ComponentModel.DataAnnotations;
using Xunit;

namespace StockControl.Tests
{
    public class ProdutoTests
    {
        [Fact]
        public void Produto_DeveSerValido_QuandoTodosCamposObrigatoriosPreenchidos()
        {
            // Arrange
            var produto = new Produto
            {
                Nome = "Produto Teste",
                Codigo = "PROD001",
                PrecoCompra = 10.50m,
                PrecoVenda = 15.00m,
                CategoriaId = 1
            };

            // Act
            var contexto = new ValidationContext(produto);
            var resultados = new List<ValidationResult>();
            var isValid = Validator.TryValidateObject(produto, contexto, resultados, true);

            // Assert
            Assert.True(isValid);
            Assert.Empty(resultados);
        }

        [Fact]
        public void Produto_DeveSerInvalido_QuandoNomeVazio()
        {
            // Arrange
            var produto = new Produto
            {
                Nome = "", // Nome vazio
                Codigo = "PROD001",
                PrecoCompra = 10.50m,
                PrecoVenda = 15.00m,
                CategoriaId = 1
            };

            // Act
            var contexto = new ValidationContext(produto);
            var resultados = new List<ValidationResult>();
            var isValid = Validator.TryValidateObject(produto, contexto, resultados, true);

            // Assert
            Assert.False(isValid);
            Assert.Contains(resultados, r => r.MemberNames.Contains("Nome"));
        }

        [Fact]
        public void Produto_DeveSerInvalido_QuandoPrecoCompraMenorQueZero()
        {
            // Arrange
            var produto = new Produto
            {
                Nome = "Produto Teste",
                Codigo = "PROD001",
                PrecoCompra = -10.50m, // Preço negativo
                PrecoVenda = 15.00m,
                CategoriaId = 1
            };

            // Act
            var contexto = new ValidationContext(produto);
            var resultados = new List<ValidationResult>();
            var isValid = Validator.TryValidateObject(produto, contexto, resultados, true);

            // Assert
            Assert.False(isValid);
            Assert.Contains(resultados, r => r.MemberNames.Contains("PrecoCompra"));
        }

        [Fact]
        public void Produto_DeveSerInvalido_QuandoCodigoVazio()
        {
            // Arrange
            var produto = new Produto
            {
                Nome = "Produto Teste",
                Codigo = "", // Código vazio
                PrecoCompra = 10.50m,
                PrecoVenda = 15.00m,
                CategoriaId = 1
            };

            // Act
            var contexto = new ValidationContext(produto);
            var resultados = new List<ValidationResult>();
            var isValid = Validator.TryValidateObject(produto, contexto, resultados, true);

            // Assert
            Assert.False(isValid);
            Assert.Contains(resultados, r => r.MemberNames.Contains("Codigo"));
        }

        [Fact]
        public void Produto_DeveSerInvalido_QuandoNomeMuitoLongo()
        {
            // Arrange
            var produto = new Produto
            {
                Nome = new string('A', 201), // Nome com 201 caracteres (máximo é 200)
                Codigo = "PROD001",
                PrecoCompra = 10.50m,
                PrecoVenda = 15.00m,
                CategoriaId = 1
            };

            // Act
            var contexto = new ValidationContext(produto);
            var resultados = new List<ValidationResult>();
            var isValid = Validator.TryValidateObject(produto, contexto, resultados, true);

            // Assert
            Assert.False(isValid);
            Assert.Contains(resultados, r => r.MemberNames.Contains("Nome"));
        }
    }
}
