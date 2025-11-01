using System;
using System.Collections.Generic;

namespace PCPartPicker.Models;

public class Order
{
    public int OrderId { get; set; }

    public string UserId { get; set; } = default!;
    public AppUser User { get; set; } = default!;

    public DateTime OrderDate { get; set; } = DateTime.UtcNow;
    public string Status { get; set; } = "Pending"; // Pending -> Paid -> (Shipped, etc.)
    public string Currency { get; set; } = "usd";    // ISO-4217, e.g. "usd", "eur"
    public decimal TotalPrice { get; set; }          // use decimal(18,2)

    public string? PaymentIntentId { get; set; }
    public string? CheckoutSessionId { get; set; }

    // NEW
    public ShippingAddress ShippingAddress { get; set; } = new();
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
