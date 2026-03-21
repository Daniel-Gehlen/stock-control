using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using StockControl.API.Data;
using StockControl.API.Middleware;
using StockControl.API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace StockControl.API
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<StockControlContext>(options =>
                options.UseSqlite(Configuration.GetConnectionString("DefaultConnection")));
            services.AddControllers();
            services.AddScoped<EstoqueService>();
            services.AddScoped<AuthService>();

            // Configuração do JWT
            var key = Encoding.ASCII.GetBytes("ChaveSecretaPadrao123!@#");
            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(x =>
            {
                x.RequireHttpsMetadata = false;
                x.SaveToken = true;
                x.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });

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
            // Criar banco de dados automaticamente
            using (var scope = app.ApplicationServices.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<StockControlContext>();
                context.Database.EnsureCreated();
            }

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
