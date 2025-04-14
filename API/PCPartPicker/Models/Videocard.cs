using PCPartPicker.Interfaces;
using System;
using System.Collections.Generic;

namespace PCPartPicker.Models;

public partial class Videocard : IComponent
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public decimal? Price { get; set; }

    public string? Chipset { get; set; }

    public decimal? Memory { get; set; }

    public int? CoreClock { get; set; }

    public int? BoostClock { get; set; }

    public string? Color { get; set; }

    public int? Length { get; set; }

    public int? ManufacturerTypeId { get; set; }

    public int? ChipsetTypeId { get; set; }

    public int? SeriesTypeId { get; set; }

    public virtual ChipsetType? ChipsetType { get; set; }

    public virtual ICollection<Configuration> Configurations { get; set; } = new List<Configuration>();

    public virtual ManufacturerType? ManufacturerType { get; set; }

    public virtual SeriesType? SeriesType { get; set; }
}
