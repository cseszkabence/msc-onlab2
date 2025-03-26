using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PCPartPicker.Models;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

//var connectionString = builder.Configuration.GetConnectionString("PCPartPickerDBConnection");
//builder.Services.AddSingleton<IParts>(repo => new PartsRepository(connectionString ?? "Conncetion"));

builder.Services.Configure<IdentityOptions>(options =>
{
    options.Password.RequireDigit = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;
    options.User.RequireUniqueEmail = true;
});

builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = x.DefaultChallengeScheme = x.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(y =>
{
    y.SaveToken = false;
    y.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["AppSettings:JWTSecret"]!))
    };
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<MyDbContext>();
builder.Services.AddDbContext<IdentityContext>(options =>
                    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddControllersWithViews()
                .AddJsonOptions(x => x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);
builder.Services.AddIdentityApiEndpoints<AppUser>()
    .AddEntityFrameworkStores<IdentityContext>();
var app = builder.Build();

app.UseCors(cors => cors.AllowAnyHeader().AllowAnyOrigin().AllowAnyMethod());

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

}

app.UseCors(options =>
    options.WithOrigins("http://localhost:4200")
            .AllowAnyMethod()
            .AllowAnyHeader());

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapGroup("/api")
    .MapIdentityApi<AppUser>();

app.MapPost("/api/signup", async (
    UserManager<AppUser> userManager,
    [FromBody] UserRegistrationModel userRegistrationModel
    ) =>
{
    AppUser user = new AppUser()
    {
        UserName = userRegistrationModel.Email,
        Email = userRegistrationModel.Email,
        FullName = userRegistrationModel.FullName,
    };
    var result = await userManager.CreateAsync(user, userRegistrationModel.Password);
    if (result.Succeeded)
    {
        return Results.Ok(result);
    }
    else
    {
        return Results.BadRequest(result);
    }
});

app.MapPost("/api/signin", async (
    UserManager<AppUser> userManager,
    [FromBody] LoginModel loginModel
    ) =>
{
    var user = await userManager.FindByEmailAsync(loginModel.Email);
    if (user != null && await userManager.CheckPasswordAsync(user, loginModel.Password))
    {
        var signInKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["AppSettings:JWTSecret"]!));
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new Claim[]
            {
                new Claim("UserID",user.Id.ToString())
            }),
            Expires = DateTime.UtcNow.AddMinutes(10),
            SigningCredentials = new SigningCredentials(signInKey, SecurityAlgorithms.HmacSha256Signature)
        };
        var tokenHandler = new JwtSecurityTokenHandler();
        var securityToken = tokenHandler.CreateToken(tokenDescriptor);
        var token = tokenHandler.WriteToken(securityToken);
        return Results.Ok(new { token });
    }
    else
    {
        return Results.BadRequest(new { message = "Username or password is incorrect" });
    }
});

// Shopping Cart Endpoints

app.MapGet("/api/cart", async (string userId, MyDbContext db) =>
{
    var items = await db.CartItems
        .Where(c => c.UserId == userId)
        .ToListAsync();

    return Results.Ok(items);
});

app.MapPost("/api/cart", async ([FromBody] CartItem input, MyDbContext db) =>
{
    var existingItem = await db.CartItems.FirstOrDefaultAsync(c =>
        c.UserId == input.UserId &&
        c.PartType == input.PartType &&
        c.PartId == input.PartId);

    if (existingItem != null)
    {
        existingItem.Quantity += input.Quantity;
    }
    else
    {
        db.CartItems.Add(input);
    }

    await db.SaveChangesAsync();
    return Results.Ok();
});

app.MapPost("/api/cart/update", async ([FromBody] CartItem input, MyDbContext db) =>
{
    var item = await db.CartItems.FirstOrDefaultAsync(c =>
        c.UserId == input.UserId &&
        c.PartType == input.PartType &&
        c.PartId == input.PartId);

    if (item != null)
    {
        item.Quantity += input.Quantity;

        if (item.Quantity <= 0)
        {
            db.CartItems.Remove(item);
        }
    }
    else if (input.Quantity > 0)
    {
        db.CartItems.Add(input);
    }

    await db.SaveChangesAsync();

    return Results.Ok();
});

app.Run();

public class UserRegistrationModel
{
    public string Email { get; set; }
    public string Password { get; set; }
    public string FullName { get; set; }
}

public class LoginModel
{
    public string Email { get; set; }
    public string Password { get; set; }
}