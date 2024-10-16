using System;
using System.Collections.Generic;

namespace PCPartPicker.Models;

public partial class SocketType
{
    public int SocketId { get; set; }

    public string? Type { get; set; }

    public virtual ICollection<Motherboard> Motherboards { get; set; } = new List<Motherboard>();

    public virtual ICollection<Processor> Processors { get; set; } = new List<Processor>();
}
