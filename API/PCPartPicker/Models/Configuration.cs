using System;
using System.Collections.Generic;

namespace PCPartPicker.Models;

public partial class Configuration
{
    public int Id { get; set; }

    public string UserId { get; set; } = default!;
    public AppUser User { get; set; } = default!;
    public string Name { get; set; } = string.Empty;

    public int? MotherboardId { get; set; }

    public int? ProcessorId { get; set; }

    public int? VideocardId { get; set; }

    public int? MemoryId { get; set; }

    public int? PowersupplyId { get; set; }

    public int? CaseId { get; set; }

    public int? StorageId { get; set; }

    public int? CoolerId { get; set; }

    public virtual Pccase? Case { get; set; }

    public virtual Cpucooler? Cooler { get; set; }

    public virtual Memory? Memory { get; set; }

    public virtual Motherboard? Motherboard { get; set; }

    public virtual Powersupply? Powersupply { get; set; }

    public virtual Processor? Processor { get; set; }

    public virtual Harddrive? Storage { get; set; }


    public virtual Videocard? Videocard { get; set; }
}
