using System;
using System.Collections.Generic;

namespace StockControl.API.DTOs
{
    public class PaginatedResponse<T>
    {
        public List<T> Items { get; set; } = new();
        public int PaginaAtual { get; set; }
        public int TamanhoPagina { get; set; }
        public int TotalItens { get; set; }
        public int TotalPaginas { get; set; }
        public bool TemPaginaAnterior => PaginaAtual > 1;
        public bool TemProximaPagina => PaginaAtual < TotalPaginas;

        public static PaginatedResponse<T> Create(List<T> items, int paginaAtual, int tamanhoPagina, int totalItens)
        {
            return new PaginatedResponse<T>
            {
                Items = items,
                PaginaAtual = paginaAtual,
                TamanhoPagina = tamanhoPagina,
                TotalItens = totalItens,
                TotalPaginas = (int)Math.Ceiling(totalItens / (double)tamanhoPagina)
            };
        }
    }
}
