using Google.GenAI;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Mscc.GenerativeAI;
using PCPartPicker.Endpoints;
using PCPartPicker.Models;
using PCPartPicker.Services;
using Stripe;
using System.Globalization;
using System.Reflection;

using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;

var builder = WebApplication.CreateBuilder(args);
var stripeKey = builder.Configuration["StripeConfig:SecretApiKey"];
var geminiApiKey = builder.Configuration["Gemini:GEMINI_API_KEY"];

builder.Services.AddControllers();

builder.Services.Configure<IdentityOptions>(options =>
{
    options.Password.RequireDigit = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;
    options.User.RequireUniqueEmail = true;
});

builder.Services
  .AddAuthentication(options =>
  {
      options.DefaultAuthenticateScheme = IdentityConstants.ApplicationScheme;
      options.DefaultChallengeScheme = IdentityConstants.ApplicationScheme;
      options.DefaultSignInScheme = IdentityConstants.ApplicationScheme;
      options.DefaultSignOutScheme = IdentityConstants.ApplicationScheme;
  })

  .AddCookie(options =>
  {
      options.Cookie.Name = "PCPP.Auth";
      options.Cookie.HttpOnly = true;
      options.Cookie.SameSite = SameSiteMode.None;
      options.Cookie.SecurePolicy = CookieSecurePolicy.None;
      options.LoginPath = "/api/auth/signin";
      options.LogoutPath = "/api/auth/logout";
      options.ExpireTimeSpan = TimeSpan.FromHours(4);
      options.SlidingExpiration = true;
      options.Events.OnRedirectToLogin = ctx =>
      {
          if (ctx.Request.Path.StartsWithSegments("/api"))
          {
              ctx.Response.StatusCode = StatusCodes.Status401Unauthorized;
          }
          else
          {
              ctx.Response.Redirect(ctx.RedirectUri);
          }
          return Task.CompletedTask;
      };
      options.Events.OnRedirectToAccessDenied = ctx =>
      {
          if (ctx.Request.Path.StartsWithSegments("/api"))
          {
              ctx.Response.StatusCode = StatusCodes.Status403Forbidden;
          }
          else
          {
              ctx.Response.Redirect(ctx.RedirectUri);
          }
          return Task.CompletedTask;
      };
  });

builder.Services.AddAuthorization();

builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services
    .AddIdentityApiEndpoints<AppUser>()
    .AddEntityFrameworkStores<ApplicationDbContext>();
builder.Services.AddControllersWithViews()
                .AddJsonOptions(x => x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddCors(opts =>
  opts.AddPolicy("AllowAngular", policy => policy
        .WithOrigins("http://localhost:4200")
    .AllowAnyMethod()
    .AllowAnyHeader()
        .AllowCredentials()
  )
);

builder.Services.AddSingleton(sp =>
{
    var client = new Client(apiKey: geminiApiKey);
    return client;
});

var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

}

app.UseRouting();
app.UseCors("AllowAngular");
app.UseSession();

app.UseAuthentication();
app.UseAuthorization();
app.MapOrdersEndpoints();
app.MapCompatEndpoints();
app.MapConfigurationsEndpoints();
app.MapPaymentsEndpoints();
app.MapAssistantEndpoints();
app.MapPartsEndpoint();
app.MapEmailEndpoints();
app.MapAuthEndpoints();
app.MapCartEndpoints();
app.MapAccountEndpoints();

StripeConfiguration.ApiKey = stripeKey;

app.MapGet("/api/me", [Authorize] (HttpContext ctx) =>
{
    var id = ctx.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
    return Results.Ok(new { authenticated = ctx.User.Identity?.IsAuthenticated, id });
});

app.Run();