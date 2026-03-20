using Microsoft.EntityFrameworkCore;
using StockControl.API.Models;

namespace StockControl.API.Data
{
    public class StockControlContext : DbContext
    {
        public DbSet<Produto> Produtos { get; set; }
        public DbSet<Categoria> Categorias { get; set; }
        public DbSet<Estoque> Estoques { get; set; }
        public DbSet<Movimentacao> Movimentacoes { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("Server=(localdb)\\mssqllocaldb;Database=StockControl;Trusted_Connection=True;");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Produto>()
                .Property(p => p.PrecoCompra)
                .HasColumnType("decimal(18, 2)");

            modelBuilder.Entity<Produto>()
                .Property(p => p.PrecoVenda)
                .HasColumnType("decimal(18, 2)");
        }
    }
}
