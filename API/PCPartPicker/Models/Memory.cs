using System;
using System.Collections.Generic;

namespace PCPartPicker.Models;

public partial class Memory
{
    public int Memoryid { get; set; }

    public string? Name { get; set; }

    public decimal? Price { get; set; }

    public decimal? Speed { get; set; }

    public string? Modules { get; set; }

    public decimal? PricePerGb { get; set; }

    public string? Color { get; set; }

    public decimal? FirstWordLatency { get; set; }

    public decimal? CasLatency { get; set; }

    public int? ManufacturerTypeId { get; set; }

    public int? Type { get; set; }

    public virtual ManufacturerType? ManufacturerType { get; set; }

    public virtual MemoryType? TypeNavigation { get; set; }
}
