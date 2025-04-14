using PCPartPicker.Interfaces;
using System;
using System.Collections.Generic;

namespace PCPartPicker.Models;

public partial class Motherboard : IComponent
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public decimal? Price { get; set; }

    public string? Socket { get; set; }

    public string? FormFactor { get; set; }

    public int? MaxMemory { get; set; }

    public int? MemorySlots { get; set; }

    public string? Color { get; set; }

    public int? ManufacturerTypeId { get; set; }

    public int? SocketTypeId { get; set; }

    public int? MemoryTypeId { get; set; }

    public int? FormFactoryTypeId { get; set; }

    public virtual ICollection<Configuration> Configurations { get; set; } = new List<Configuration>();

    public virtual FormfactorType? FormFactoryType { get; set; }

    public virtual ManufacturerType? ManufacturerType { get; set; }

    public virtual MemoryType? MemoryType { get; set; }

    public virtual SocketType? SocketType { get; set; }
}
