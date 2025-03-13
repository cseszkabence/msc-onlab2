using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PCPartPicker.Models;
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

app.Run();

public class UserRegistrationModel
{
    public string Email { get; set; }
    public string Password { get; set; }
    public string FullName { get; set; }
}
