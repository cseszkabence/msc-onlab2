using Microsoft.AspNetCore.Identity;
using PCPartPicker.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;

namespace PCPartPicker.Endpoints
{
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
    public static class AuthEndpoints
    {
        public static IEndpointRouteBuilder MapAuthEndpoints(this IEndpointRouteBuilder app)
        {
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

                await signInManager.SignInAsync(user, isPersistent: false);
                return Results.Ok(new { message = "Logged in" });
            });

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
            // Identity default endpoints if you used them
            app.MapGroup("/api").MapIdentityApi<AppUser>();

            return app;
        }
    }
}
