using Microsoft.AspNetCore.Mvc;
using PCPartPicker.Models;
using Stripe;
using Stripe.Checkout;

namespace PCPartPicker.Endpoints
{
    public class CreatePaymentRequest
    {
        public List<CartItem> Products { get; set; }
    }
    public static class PaymentsEndpoints
    {
        public static IEndpointRouteBuilder MapPaymentsEndpoints(this IEndpointRouteBuilder app)
        {
            app.MapPost("/api/create-checkout-session", async ([FromBody] CreatePaymentRequest request, ApplicationDbContext db) =>
            {
                var options = new SessionCreateOptions
                {
                    LineItems = request.Products.Select(product => new SessionLineItemOptions
                    {
                        PriceData = new SessionLineItemPriceDataOptions
                        {
                            UnitAmount = (long?)(db.ComponentLookupForPrice(product.PartId, product.PartType) * 100),
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
            return app;
        }
    }
}
