using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PCPartPicker.Infrastructure;
using PCPartPicker.Models;

namespace PCPartPicker.Endpoints
{
    public static class CartEndpoints
    {
        public static IEndpointRouteBuilder MapCartEndpoints(this IEndpointRouteBuilder app)
        {
            var cart = app.MapGroup("/api/cart").RequireAuthorization();

            cart.MapGet("/", async (HttpContext ctx, ApplicationDbContext db) =>
            {
                var uid = ctx.GetUserIdString();

                var items = await db.CartItems
                    .Where(c => c.UserId == uid)
                    .ToListAsync();

                return Results.Ok(items);
            });

            cart.MapDelete("/clear", async (HttpContext ctx, ApplicationDbContext db) =>
            {
                var uid = ctx.GetUserIdString();

                var items = await db.CartItems
                    .Where(c => c.UserId == uid)
                    .ToListAsync();
                //var allItems = db.Set<CartItem>();
                db.RemoveRange(items);
                await db.SaveChangesAsync();
                return Results.Ok("Cart cleared.");
            });

            cart.MapPost("/", async ([FromBody] CartItem input, ApplicationDbContext db, HttpContext ctx) =>
            {
                var uid = ctx.GetUserIdString();
                var existingItem = await db.CartItems.FirstOrDefaultAsync(c =>
                    c.UserId == uid &&
                    c.PartType == input.PartType &&
                    c.PartId == input.PartId);

                if (existingItem != null)
                {
                    existingItem.Quantity += input.Quantity;
                }
                else
                {
                    input.UserId = uid;
                    db.CartItems.Add(input);
                }

                await db.SaveChangesAsync();
                return Results.Ok();
            });

            cart.MapPost("/update", async ([FromBody] CartItem input, ApplicationDbContext db, HttpContext ctx) =>
            {
                var uid = ctx.GetUserIdString();
                input.UserId = uid;

                var item = await db.CartItems.FirstOrDefaultAsync(c =>
                    c.UserId == uid &&
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
            return app;
        }
    }
}
