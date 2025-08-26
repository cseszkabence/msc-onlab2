using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using PCPartPicker.Models;
using PCPartPicker.Services;
using Stripe;
using Stripe.Checkout;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using WireMock.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

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
      options.DefaultAuthenticateScheme = IdentityConstants.ApplicationScheme;   // "Identity.Application"
      options.DefaultChallengeScheme = IdentityConstants.ApplicationScheme;
      options.DefaultSignInScheme = IdentityConstants.ApplicationScheme;
      options.DefaultSignOutScheme = IdentityConstants.ApplicationScheme;
  })
  .AddCookie(options =>
  {
      options.Cookie.Name = "YourApp.Auth";
      options.Cookie.HttpOnly = true;
      options.Cookie.SameSite = SameSiteMode.None;
      options.Cookie.SecurePolicy = CookieSecurePolicy.None;
      options.LoginPath = "/api/auth/signin";    // redirects here if [Authorize] fails
      options.LogoutPath = "/api/auth/logout";
      options.ExpireTimeSpan = TimeSpan.FromHours(4);
      options.SlidingExpiration = true;
      // return 401 on unauthorized API calls instead of 302 Redirect
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

// 2.2) If you need sessions (optional—for storing extra data):
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
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
    // allow cookies
    .AllowAnyMethod()
    .AllowAnyHeader()
        .AllowCredentials()

  )
);
var app = builder.Build();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

}


// 2.3) Order matters:
app.UseRouting();
app.UseCors("AllowAngular");
app.UseSession();               // if using sessions
app.UseAuthentication();        // ← must come before UseAuthorization
app.UseAuthorization();


string GetUserIdString(HttpContext ctx)
{
    var id = ctx.User.FindFirstValue(ClaimTypes.NameIdentifier);
    if (string.IsNullOrEmpty(id)) throw new UnauthorizedAccessException("No user id claim.");
    return id;
}

// Group all config endpoints under /api/configurations
var cfgs = app.MapGroup("/api/configurations");

// LIST all configs for this user
cfgs.MapGet("/", async (ApplicationDbContext db, HttpContext ctx) =>
{
    var uid = GetUserIdString(ctx);
    var list = await db.Configurations
        .Where(c => c.UserId == uid)
        .ToListAsync();
    return Results.Ok(list);
});

// CREATE a new config
cfgs.MapPost("/", async ([FromBody] Configuration dto, ApplicationDbContext db, HttpContext ctx) =>
{
    var uid = GetUserIdString(ctx);
    dto.UserId = uid;
    db.Configurations.Add(dto);
    await db.SaveChangesAsync();
    return Results.Created($"/api/configurations/{dto.Id}", dto);
});

// UPDATE an existing config
cfgs.MapPut("/{id:int}", async (int id,
                                 [FromBody] Configuration update,
                                 ApplicationDbContext db,
                                 HttpContext ctx) =>
{
    var uid = GetUserIdString(ctx);
    var cfg = await db.Configurations.FindAsync(id);
    if (cfg == null || cfg.UserId != uid) return Results.NotFound();

    // overwrite allowed fields
    cfg.Name = update.Name;
    cfg.MotherboardId = update.MotherboardId;
    cfg.ProcessorId = update.ProcessorId;
    // …etc for each part FK…

    await db.SaveChangesAsync();
    return Results.Ok(cfg);
});

// DELETE a config
cfgs.MapDelete("/{id:int}", async (int id, ApplicationDbContext db, HttpContext ctx) =>
{
    var uid = GetUserIdString(ctx);
    var cfg = await db.Configurations.FindAsync(id);
    if (cfg == null || cfg.UserId != uid) return Results.NotFound();

    db.Configurations.Remove(cfg);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.MapControllers();

app.MapGroup("/api")
    .MapIdentityApi<AppUser>();

var auth = app.MapGroup("/api/auth");

auth.MapPost("/signup", async (
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


// ————————————————
// POST /api/signin
// ————————————————
auth.MapPost("/signin", async (
  SignInManager<AppUser> signInManager,
  UserManager<AppUser> userManager,
  [FromBody] LoginModel loginModel
) =>
{
    var user = await userManager.FindByEmailAsync(loginModel.Email);
    if (user is null) return Results.BadRequest(new { message = "Email or password is incorrect" });

    var valid = await userManager.CheckPasswordAsync(user, loginModel.Password);
    if (!valid) return Results.BadRequest(new { message = "Email or password is incorrect" });

    await signInManager.SignInAsync(user, isPersistent: true); // uses Identity.Application
    return Results.Ok(new { message = "Logged in" });
});


// ————————————————
// POST /api/logout
// ————————————————
auth.MapPost("/logout",
  [Authorize] async (
    HttpContext ctx,
    SignInManager<AppUser> signInManager
  ) =>
  {
      // 1) Sign out via SignInManager (uses Identity.Application)
      await signInManager.SignOutAsync();

      // 2) (Optional) also sign out explicitly, in case multiple schemes exist
      await ctx.SignOutAsync(IdentityConstants.ApplicationScheme);
      await ctx.SignOutAsync(IdentityConstants.ExternalScheme);   // if you used external auth

      return Results.NoContent();
  });

app.MapGet("/api/auth/status",
    [Authorize] (HttpContext ctx) => Results.Ok())
  .RequireAuthorization();

// Shopping Cart Endpoints

app.MapGet("/api/cart", async (string userId, ApplicationDbContext db) =>
{
    var items = await db.CartItems
        .Where(c => c.UserId == userId)
        .ToListAsync();

    return Results.Ok(items);
});

app.MapDelete("/api/cart/clear", async (string userId, ApplicationDbContext db) =>
{
    var items = await db.CartItems
        .Where(c => c.UserId == userId)
        .ToListAsync();
    //var allItems = db.Set<CartItem>();
    db.RemoveRange(items);
    await db.SaveChangesAsync();
    return Results.Ok("Cart cleared.");
});

app.MapPost("/api/cart", async ([FromBody] CartItem input, ApplicationDbContext db) =>
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

app.MapPost("/api/cart/update", async ([FromBody] CartItem input, ApplicationDbContext db) =>
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

StripeConfiguration.ApiKey = "sk_test_51Q2EtTB2B1CUn6npLoD8gQBOnS2y08mvD9hLyy449A6KcXh0xlFuOUQ7QOtPvzH47KqSGtsRfWHc4YORhoWHTV5T00PcQYlgDd";

// Define the endpoint for creating a checkout session
app.MapPost("/api/create-checkout-session", async ([FromBody] CreatePaymentRequest request, ApplicationDbContext db) =>
{
    var options = new SessionCreateOptions
    {
        LineItems = request.Products.Select(product => new SessionLineItemOptions
        {
            PriceData = new SessionLineItemPriceDataOptions
            {
                UnitAmount = (long?)(db.ComponentLookupForPrice(product.PartId, product.PartType) * 100), // Convert to cents
                Currency = "usd",
                ProductData = new SessionLineItemPriceDataProductDataOptions
                {
                    Name = db.ComponentLookupForName(product.PartId, product.PartType)
                },
            },
            Quantity = product.Quantity,
        }).ToList(),
        Mode = "payment",
        SuccessUrl = "http://localhost:4200/checkoutsuccess-component",
        CancelUrl = "http://localhost:4200/checkoutcancel-component",
    };

    var service = new SessionService();
    var session = await service.CreateAsync(options);

    return Results.Ok(new
    {
        Url = session.Url,
        sessionId = session.Id
    });
});

app.MapPost("/api/email/sendmail", async (
    IEmailService emailService,
    [FromBody] EmailModel emailModel
    ) =>
{
    var result = await emailService.SendEmail(emailModel);
    if (result)
    {
        return Results.Ok(new { message = "Email sent successfully." });
    }
    else
    {
        return Results.BadRequest(new { message = "Error sending email." });
    }
});

app.MapGet("/api/parts/getPart", async (int partId, string partType, ApplicationDbContext db) =>
{
    var item = await db.ComponentLookup(partId, partType);

    return Results.Ok(item);
});

app.MapGet("/api/me", [Authorize] (HttpContext ctx) =>
{
    var id = ctx.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
    return Results.Ok(new { authenticated = ctx.User.Identity?.IsAuthenticated, id });
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

// Models for the request
public class CreatePaymentRequest
{
    public List<CartItem> Products { get; set; }
}

public class Product
{
    public string Name { get; set; }
    public int Price { get; set; }
    public int Quantity { get; set; }
}