using System;
using System.Collections.Generic;

namespace PCPartPicker.Models;

public partial class Processor
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public decimal? Price { get; set; }

    public int? SocketTypeId { get; set; }

    public int? CoreCount { get; set; }

    public decimal? CoreClock { get; set; }

    public decimal? BoostClock { get; set; }

    public int? Tdp { get; set; }

    public string? Graphics { get; set; }

    public bool? Smt { get; set; }

    public int? ManufacturerTypeId { get; set; }

    public int? SeriesTypeId { get; set; }

    public virtual ICollection<Configuration> Configurations { get; set; } = new List<Configuration>();

    public virtual ManufacturerType? ManufacturerType { get; set; }

    public virtual SeriesType? SeriesType { get; set; }

    public virtual SocketType? SocketType { get; set; }
}
