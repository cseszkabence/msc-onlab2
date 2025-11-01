using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PCPartPicker.Infrastructure;
using PCPartPicker.Models;
using PCPartPicker.Services;

namespace PCPartPicker.Endpoints
{
    public static class EmailEndpoints
    {
        public static IEndpointRouteBuilder MapEmailEndpoints(this IEndpointRouteBuilder app)
        {
            var emails = app.MapGroup("/api/email").RequireAuthorization();

            // POST /api/email/receipt/{orderId}
            emails.MapPost("/receipt/{orderId:int}", async (
                HttpContext ctx,
                int orderId,
                ApplicationDbContext db,
                UserManager<AppUser> userManager,
                IEmailService emailService) =>
            {
                var userId = ctx.GetUserIdString();
                if (string.IsNullOrEmpty(userId)) return Results.Unauthorized();

                // Load order (must belong to current user)
                var order = await db.Orders
                    .Include(o => o.OrderItems)
                    .FirstOrDefaultAsync(o => o.OrderId == orderId && o.UserId == userId);

                if (order is null) return Results.NotFound("Order not found.");

                // Load recipient
                var user = await userManager.FindByIdAsync(userId);
                var to = user?.Email;
                if (string.IsNullOrWhiteSpace(to))
                    return Results.BadRequest("User has no email.");

                // Enrich order items with product names for the receipt
                var items = new List<ReceiptLine>();
                foreach (var oi in order.OrderItems)
                {
                    var name = await ResolveNameAsync(db, oi.PartTypeId, oi.PartId);
                    items.Add(new ReceiptLine(
                        name: string.IsNullOrWhiteSpace(name) ? $"Item #{oi.PartId}" : name,
                        qty: oi.Quantity,
                        unit: oi.UnitPrice,
                        total: oi.UnitPrice * oi.Quantity
                    ));
                }

                // Compose email content
                var subject = $"Your receipt – Order #{order.OrderId}";
                var (text, html) = EmailTemplates.ComposeOrderReceipt(order, items);

                var model = new EmailModel
                {
                    ToEmail = to,
                    Subject = subject,
                    Body = html
                };

                await emailService.SendEmail(model);

                return Results.Ok();
            });

            return app;
        }

        // Same helper mapping you used in Orders endpoints
        private static async Task<string> ResolveNameAsync(ApplicationDbContext db, int partTypeId, int partId)
        {
            return partTypeId switch
            {
                1 => (await db.Processors.FindAsync(partId))?.Name ?? "",
                2 => (await db.Motherboards.FindAsync(partId))?.Name ?? "",
                3 => (await db.Videocards.FindAsync(partId))?.Name ?? "",
                4 => (await db.Memories.FindAsync(partId))?.Name ?? "",
                5 => (await db.Powersupplies.FindAsync(partId))?.Name ?? "",
                6 => (await db.Harddrives.FindAsync(partId))?.Name ?? "",
                7 => (await db.Pccases.FindAsync(partId))?.Name ?? "",
                8 => (await db.Cpucoolers.FindAsync(partId))?.Name ?? "",
                _ => ""
            };
        }

        public record ReceiptLine(string name, int qty, decimal unit, decimal total);
    }
}
