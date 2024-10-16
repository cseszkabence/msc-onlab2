using System;
using System.Collections.Generic;

namespace PCPartPicker.Models;

public partial class ManufacturerType
{
    public int ManufacturerTypeId { get; set; }

    public string? Type { get; set; }

    public virtual ICollection<Cpucooler> Cpucoolers { get; set; } = new List<Cpucooler>();

    public virtual ICollection<Harddrive> Harddrives { get; set; } = new List<Harddrive>();

    public virtual ICollection<Memory> Memories { get; set; } = new List<Memory>();

    public virtual ICollection<Motherboard> Motherboards { get; set; } = new List<Motherboard>();

    public virtual ICollection<Pccase> Pccases { get; set; } = new List<Pccase>();

    public virtual ICollection<Powersupply> Powersupplies { get; set; } = new List<Powersupply>();

    public virtual ICollection<Processor> Processors { get; set; } = new List<Processor>();

    public virtual ICollection<Videocard> Videocards { get; set; } = new List<Videocard>();
}
