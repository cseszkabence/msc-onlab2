using System;
using System.Collections.Generic;

namespace PCPartPicker.Models;

public partial class Powersupply
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public decimal? Price { get; set; }

    public string? Type { get; set; }

    public string? Efficiency { get; set; }

    public decimal? Wattage { get; set; }

    public string? Modular { get; set; }

    public string? Color { get; set; }

    public int? ManufacturerTypeId { get; set; }

    public int? FormFactorId { get; set; }

    public virtual ICollection<Configuration> Configurations { get; set; } = new List<Configuration>();

    public virtual FormfactorType? FormFactor { get; set; }

    public virtual ManufacturerType? ManufacturerType { get; set; }
}
