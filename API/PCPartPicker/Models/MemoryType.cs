using System;
using System.Collections.Generic;

namespace PCPartPicker.Models;

public partial class MemoryType
{
    public int MemoryTypeId { get; set; }

    public string? Type { get; set; }

    public virtual ICollection<Memory> Memories { get; set; } = new List<Memory>();

    public virtual ICollection<Motherboard> Motherboards { get; set; } = new List<Motherboard>();
}
