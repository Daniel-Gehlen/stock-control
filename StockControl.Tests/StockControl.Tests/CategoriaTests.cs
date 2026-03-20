using StockControl.API.Models;
using System.ComponentModel.DataAnnotations;
using Xunit;

namespace StockControl.Tests
{
    public class CategoriaTests
    {
        [Fact]
        public void Categoria_DeveSerValida_QuandoNomePreenchido()
        {
            // Arrange
            var categoria = new Categoria
            {
                Nome = "Categoria Teste",
                Descricao = "Descrição da categoria teste"
            };

            // Act
            var contexto = new ValidationContext(categoria);
            var resultados = new List<ValidationResult>();
            var isValid = Validator.TryValidateObject(categoria, contexto, resultados, true);

            // Assert
            Assert.True(isValid);
            Assert.Empty(resultados);
        }

        [Fact]
        public void Categoria_DeveSerInvalida_QuandoNomeVazio()
        {
            // Arrange
            var categoria = new Categoria
            {
                Nome = "", // Nome vazio
                Descricao = "Descrição da categoria teste"
            };

            // Act
            var contexto = new ValidationContext(categoria);
            var resultados = new List<ValidationResult>();
            var isValid = Validator.TryValidateObject(categoria, contexto, resultados, true);

            // Assert
            Assert.False(isValid);
            Assert.Contains(resultados, r => r.MemberNames.Contains("Nome"));
        }

        [Fact]
        public void Categoria_DeveSerInvalida_QuandoNomeMuitoLongo()
        {
            // Arrange
            var categoria = new Categoria
            {
                Nome = new string('A', 101), // Nome com 101 caracteres (máximo é 100)
                Descricao = "Descrição da categoria teste"
            };

            // Act
            var contexto = new ValidationContext(categoria);
            var resultados = new List<ValidationResult>();
            var isValid = Validator.TryValidateObject(categoria, contexto, resultados, true);

            // Assert
            Assert.False(isValid);
            Assert.Contains(resultados, r => r.MemberNames.Contains("Nome"));
        }

        [Fact]
        public void Categoria_DeveSerInvalida_QuandoDescricaoMuitoLonga()
        {
            // Arrange
            var categoria = new Categoria
            {
                Nome = "Categoria Teste",
                Descricao = new string('A', 501) // Descrição com 501 caracteres (máximo é 500)
            };

            // Act
            var contexto = new ValidationContext(categoria);
            var resultados = new List<ValidationResult>();
            var isValid = Validator.TryValidateObject(categoria, contexto, resultados, true);

            // Assert
            Assert.False(isValid);
            Assert.Contains(resultados, r => r.MemberNames.Contains("Descricao"));
        }

        [Fact]
        public void Categoria_DevePermitirDescricaoVazia()
        {
            // Arrange
            var categoria = new Categoria
            {
                Nome = "Categoria Teste",
                Descricao = "" // Descrição vazia é permitida
            };

            // Act
            var contexto = new ValidationContext(categoria);
            var resultados = new List<ValidationResult>();
            var isValid = Validator.TryValidateObject(categoria, contexto, resultados, true);

            // Assert
            Assert.True(isValid);
            Assert.Empty(resultados);
        }
    }
}
