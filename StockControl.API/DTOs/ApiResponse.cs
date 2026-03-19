using System.Collections.Generic;

namespace StockControl.API.DTOs
{
    public class ApiResponse<T>
    {
        public bool Sucesso { get; set; }
        public string Mensagem { get; set; } = string.Empty;
        public T? Dados { get; set; }
        public List<string> Erros { get; set; } = new();

        public static ApiResponse<T> SucessoResponse(T dados, string mensagem = "Operação realizada com sucesso")
        {
            return new ApiResponse<T>
            {
                Sucesso = true,
                Mensagem = mensagem,
                Dados = dados
            };
        }

        public static ApiResponse<T> ErroResponse(string mensagem, List<string>? erros = null)
        {
            return new ApiResponse<T>
            {
                Sucesso = false,
                Mensagem = mensagem,
                Erros = erros ?? new List<string>()
            };
        }
    }
}
