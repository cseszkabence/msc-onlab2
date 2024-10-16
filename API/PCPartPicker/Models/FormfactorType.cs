using System;
using System.Collections.Generic;

namespace PCPartPicker.Models;

public partial class FormfactorType
{
    public int FormfactorId { get; set; }

    public string? Type { get; set; }

    public virtual ICollection<Motherboard> Motherboards { get; set; } = new List<Motherboard>();

    public virtual ICollection<Pccase> Pccases { get; set; } = new List<Pccase>();

    public virtual ICollection<Powersupply> Powersupplies { get; set; } = new List<Powersupply>();
}
