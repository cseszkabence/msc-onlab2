using System;
using System.Collections.Generic;

namespace PCPartPicker.Models;

public partial class Harddrive
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public decimal? Price { get; set; }

    public decimal? Capacity { get; set; }

    public decimal? PricePerGb { get; set; }

    public string? Type { get; set; }

    public decimal? Cache { get; set; }

    public string? Interface { get; set; }

    public int? ManufacturerTypeId { get; set; }

    public int? DriveTypeId { get; set; }

    public virtual ICollection<Configuration> Configurations { get; set; } = new List<Configuration>();

    public virtual HarddriveType? DriveType { get; set; }

    public virtual ManufacturerType? ManufacturerType { get; set; }
}
