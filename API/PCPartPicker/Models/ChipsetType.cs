using System;
using System.Collections.Generic;

namespace PCPartPicker.Models;

public partial class ChipsetType
{
    public int ChipsetTypeId { get; set; }

    public string? Type { get; set; }

    public virtual ICollection<Videocard> Videocards { get; set; } = new List<Videocard>();
}
