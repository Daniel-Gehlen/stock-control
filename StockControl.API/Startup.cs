using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using StockControl.API.Data;
using StockControl.API.Middleware;
using StockControl.API.Services;

namespace StockControl.API
{
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<StockControlContext>();
            services.AddControllers();
            services.AddScoped<EstoqueService>();

            // Configuração do CORS
            services.AddCors(options =>
            {
                options.AddPolicy("AllowAll",
                    builder =>
                    {
                        builder.AllowAnyOrigin()
                               .AllowAnyMethod()
                               .AllowAnyHeader();
                    });
            });

            // Configuração do Swagger
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "Stock Control API",
                    Version = "v1",
                    Description = "API para controle de estoque de produtos"
                });
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            // Middleware de tratamento de exceções
            app.UseMiddleware<ExceptionMiddleware>();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            // Configuração do Swagger
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Stock Control API v1");
                c.RoutePrefix = string.Empty; // Swagger na raiz
            });

            app.UseCors("AllowAll");

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
