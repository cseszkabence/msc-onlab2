using PCPartPicker.Interfaces;
using System;
using System.Collections.Generic;

namespace PCPartPicker.Models;

public partial class Pccase : IComponent
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public decimal? Price { get; set; }

    public string? FormFactor { get; set; }

    public string? Color { get; set; }

    public string? SidePanel { get; set; }

    public decimal? ExternalVolume { get; set; }

    public int? Internal35Bays { get; set; }

    public int? FormFactorTypeId { get; set; }

    public int? ManufacturerTypeId { get; set; }

    public virtual ICollection<Configuration> Configurations { get; set; } = new List<Configuration>();

    public virtual FormfactorType? FormFactorType { get; set; }

    public virtual ManufacturerType? ManufacturerType { get; set; }
}
