using System;
using System.Collections.Generic;

namespace PCPartPicker.Models;

public partial class Cpucooler
{
    public int Cpucoolerid { get; set; }

    public string? Name { get; set; }

    public decimal? Price { get; set; }

    public decimal? Rpm { get; set; }

    public decimal? NoiseLevel { get; set; }

    public string? Color { get; set; }

    public decimal? Size { get; set; }

    public int? ManufacturerTypeId { get; set; }

    public virtual ManufacturerType? ManufacturerType { get; set; }
}
