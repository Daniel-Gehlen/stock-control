using Microsoft.EntityFrameworkCore;
using StockControl.API.Models;

namespace StockControl.API.Data
{
    public class StockControlContext : DbContext
    {
        public StockControlContext(DbContextOptions<StockControlContext> options)
            : base(options)
        {
        }

        public DbSet<Produto> Produtos { get; set; }
        public DbSet<Categoria> Categorias { get; set; }
        public DbSet<Estoque> Estoques { get; set; }
        public DbSet<Movimentacao> Movimentacoes { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Produto>()
                .Property(p => p.PrecoCompra)
                .HasConversion<double>();

            modelBuilder.Entity<Produto>()
                .Property(p => p.PrecoVenda)
                .HasConversion<double>();
        }
    }
}
