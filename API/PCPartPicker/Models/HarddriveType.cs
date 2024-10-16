using System;
using System.Collections.Generic;

namespace PCPartPicker.Models;

public partial class HarddriveType
{
    public int HarddirveTypeId { get; set; }

    public string? Type { get; set; }

    public virtual ICollection<Harddrive> Harddrives { get; set; } = new List<Harddrive>();
}
