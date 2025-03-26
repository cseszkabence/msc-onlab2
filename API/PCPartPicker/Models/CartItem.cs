using System;
using System.Collections.Generic;

namespace PCPartPicker.Models;

public partial class CartItem
{
    public int Id { get; set; }

    public string UserId { get; set; } = null!;

    public string PartType { get; set; } = null!;

    public int PartId { get; set; }

    public int Quantity { get; set; }
}
