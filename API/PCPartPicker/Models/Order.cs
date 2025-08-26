using System;
using System.Collections.Generic;

namespace PCPartPicker.Models;

public partial class Order
{
    public int OrderId { get; set; }

    public string UserId { get; set; } = default!;
    public AppUser User { get; set; } = default!;
    public DateTime? OrderDate { get; set; }

    public decimal? TotalPrice { get; set; }

    public string? Status { get; set; }

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

}
