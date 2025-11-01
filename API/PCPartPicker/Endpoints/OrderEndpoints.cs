using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PCPartPicker.Infrastructure;
using PCPartPicker.Models;
using Stripe.Checkout;

namespace PCPartPicker.Endpoints
{
    public record ShippingAddressDto(
    string RecipientName, string Line1, string? Line2,
    string City, string State, string PostalCode, string Country, string? Phone,
    string Currency // "usd", "eur", etc.
);

    public record CheckoutSessionRequest(); // placeholder if you later add shipping options
    public record ConfirmOrderRequest(string? SessionId);

    public static class OrderEndpoints
    {
        public static IEndpointRouteBuilder MapOrdersEndpoints(this IEndpointRouteBuilder app)
        {
            var orders = app.MapGroup("/api/orders").RequireAuthorization();

            // 1) Create a draft order from the cart + shipping address
            orders.MapPost("/draft", async (
                HttpContext ctx,
                [FromBody] ShippingAddressDto dto,
                ApplicationDbContext db) =>
            {
                var userId = ctx.GetUserIdString();
                if (string.IsNullOrEmpty(userId)) return Results.Unauthorized();

                var cart = await db.CartItems
                    .Where(c => c.UserId == userId)
                    .ToListAsync();

                if (cart.Count == 0) return Results.BadRequest("Cart is empty.");

                // create draft order
                var order = new Order
                {
                    UserId = userId,
                    OrderDate = DateTime.UtcNow,
                    Status = "Pending",
                    Currency = dto.Currency,
                    ShippingAddress = new ShippingAddress
                    {
                        RecipientName = dto.RecipientName,
                        Line1 = dto.Line1,
                        Line2 = dto.Line2,
                        City = dto.City,
                        State = dto.State,
                        PostalCode = dto.PostalCode,
                        Country = dto.Country,
                        Phone = dto.Phone
                    }
                };

                db.Orders.Add(order);
                await db.SaveChangesAsync(); // get OrderId

                // Snapshot items & prices now
                decimal total = 0m;
                var items = new List<OrderItem>();
                foreach (var ci in cart)
                {
                    var (unitPrice, typeId) =
                        await ResolveUnitPriceAndTypeIdAsync(db, ci.PartType, ci.PartId);

                    items.Add(new OrderItem
                    {
                        OrderId = order.OrderId,
                        PartTypeId = typeId,
                        PartId = ci.PartId,
                        Quantity = ci.Quantity,
                        UnitPrice = unitPrice
                    });

                    total += unitPrice * ci.Quantity;
                }

                await db.OrderItems.AddRangeAsync(items);
                order.TotalPrice = total;
                await db.SaveChangesAsync();

                return Results.Ok(new { orderId = order.OrderId });
            });

            // 2) Create a Stripe Checkout Session for a given order
            orders.MapPost("/{orderId:int}/checkout-session", async (
                HttpContext ctx,
                int orderId,
                [FromBody] CheckoutSessionRequest _,
                ApplicationDbContext db,
                IConfiguration config) =>
            {
                var userId = ctx.GetUserIdString();
                if (string.IsNullOrEmpty(userId)) return Results.Unauthorized();

                var order = await db.Orders
                    .Include(o => o.OrderItems)
                    .Where(o => o.OrderId == orderId && o.UserId == userId)
                    .FirstOrDefaultAsync();

                if (order is null) return Results.NotFound("Order not found.");
                if (order.Status != "Pending") return Results.BadRequest("Order is not pending.");

                // Build line items from the order snapshot
                var lineItems = new List<SessionLineItemOptions>();
                foreach (var oi in order.OrderItems)
                {
                    var name = await ResolveNameAsync(db, oi.PartTypeId, oi.PartId);
                    lineItems.Add(new SessionLineItemOptions
                    {
                        Quantity = oi.Quantity,
                        PriceData = new SessionLineItemPriceDataOptions
                        {
                            Currency = order.Currency,
                            UnitAmountDecimal = (long)(oi.UnitPrice * 100m), // amount in minor units
                            ProductData = new SessionLineItemPriceDataProductDataOptions
                            {
                                Name = string.IsNullOrWhiteSpace(name) ? $"Item #{oi.PartId}" : name
                            }
                        }
                    });
                }

                var frontendBase = config["FrontendBaseUrl"] ?? "http://localhost:4200";
                var success = $"{frontendBase}/checkout/success?orderId={order.OrderId}&session_id={{CHECKOUT_SESSION_ID}}";
                var cancel = $"{frontendBase}/checkout/cancel?orderId={order.OrderId}";

                var session = await new SessionService().CreateAsync(new SessionCreateOptions
                {
                    Mode = "payment",
                    ClientReferenceId = order.OrderId.ToString(),
                    SuccessUrl = success,
                    CancelUrl = cancel,
                    LineItems = lineItems,
                    Metadata = new Dictionary<string, string>
                    {
                        ["orderId"] = order.OrderId.ToString(),
                        ["userId"] = userId
                    }
                });

                order.CheckoutSessionId = session.Id;
                await db.SaveChangesAsync();

                return Results.Ok(new { url = session.Url, sessionId = session.Id });
            });

            // 3) Confirm order after Stripe success
            orders.MapPost("/{orderId:int}/confirm", async (
                HttpContext ctx,
                int orderId,
                [FromBody] ConfirmOrderRequest body,
                ApplicationDbContext db) =>
            {
                var userId = ctx.GetUserIdString();
                if (string.IsNullOrEmpty(userId)) return Results.Unauthorized();

                var order = await db.Orders
                    .Include(o => o.OrderItems)
                    .Where(o => o.OrderId == orderId && o.UserId == userId)
                    .FirstOrDefaultAsync();

                if (order is null) return Results.NotFound("Order not found.");

                if (order.Status == "Paid")
                    return Results.Ok(new { orderId = order.OrderId, order.Status }); // idempotent

                if (!string.IsNullOrWhiteSpace(body.SessionId))
                {
                    var s = await new SessionService().GetAsync(body.SessionId);
                    if (!string.Equals(s.PaymentStatus, "paid", StringComparison.OrdinalIgnoreCase))
                        return Results.BadRequest("Payment not completed.");
                    order.PaymentIntentId = s.PaymentIntentId;
                    order.CheckoutSessionId = s.Id;
                }

                order.Status = "Paid";

                // Clear cart now that we have a paid order
                var cartItems = await db.CartItems.Where(c => c.UserId == userId).ToListAsync();
                db.CartItems.RemoveRange(cartItems);

                await db.SaveChangesAsync();

                return Results.Ok(new
                {
                    orderId = order.OrderId,
                    order.TotalPrice,
                    order.Status
                });
            });

            return app;
        }

        // Helpers (map your existing part tables; uses your current string PartType)
        private static async Task<(decimal unitPrice, int partTypeId)> ResolveUnitPriceAndTypeIdAsync(
            ApplicationDbContext db, string partType, int partId)
        {
            switch (partType)
            {
                case "Processor": return ((await db.Processors.FindAsync(partId))?.Price ?? 0m, 1);
                case "Motherboard": return ((await db.Motherboards.FindAsync(partId))?.Price ?? 0m, 2);
                case "Videocard": return ((await db.Videocards.FindAsync(partId))?.Price ?? 0m, 3);
                case "Memory": return ((await db.Memories.FindAsync(partId))?.Price ?? 0m, 4);
                case "Powersupply": return ((await db.Powersupplies.FindAsync(partId))?.Price ?? 0m, 5);
                case "Harddrive": return ((await db.Harddrives.FindAsync(partId))?.Price ?? 0m, 6);
                case "Pccase": return ((await db.Pccases.FindAsync(partId))?.Price ?? 0m, 7);
                case "Cpucooler": return ((await db.Cpucoolers.FindAsync(partId))?.Price ?? 0m, 8);
                default: return (0m, 0);
            }
        }

        private static async Task<string> ResolveNameAsync(ApplicationDbContext db, int partTypeId, int partId)
        {
            switch (partTypeId)
            {
                case 1: return (await db.Processors.FindAsync(partId))?.Name ?? "";
                case 2: return (await db.Motherboards.FindAsync(partId))?.Name ?? "";
                case 3: return (await db.Videocards.FindAsync(partId))?.Name ?? "";
                case 4: return (await db.Memories.FindAsync(partId))?.Name ?? "";
                case 5: return (await db.Powersupplies.FindAsync(partId))?.Name ?? "";
                case 6: return (await db.Harddrives.FindAsync(partId))?.Name ?? "";
                case 7: return (await db.Pccases.FindAsync(partId))?.Name ?? "";
                case 8: return (await db.Cpucoolers.FindAsync(partId))?.Name ?? "";
                default: return "";
            }
        }
    }
}
