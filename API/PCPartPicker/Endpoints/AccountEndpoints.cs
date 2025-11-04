using Microsoft.AspNetCore.Identity;
using PCPartPicker.Infrastructure;
using PCPartPicker.Models;

namespace PCPartPicker.Endpoints
{
    public static class AccountEndpoints
    {
        public static IEndpointRouteBuilder MapAccountEndpoints(this IEndpointRouteBuilder app)
        {
            var acc = app.MapGroup("/api/account").RequireAuthorization();
            acc.MapGet("/me", async (HttpContext ctx, UserManager<AppUser> um) =>
            {
                var userId = ctx.GetUserIdString();
                if (string.IsNullOrEmpty(userId)) return Results.Unauthorized();
                var u = await um.FindByIdAsync(userId);
                return Results.Ok(new { id = u!.Id, email = u.Email, fullName = u.FullName });
            });
            return app;
        }
    }
}
