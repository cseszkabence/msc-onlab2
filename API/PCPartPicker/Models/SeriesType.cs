using System;
using System.Collections.Generic;

namespace PCPartPicker.Models;

public partial class SeriesType
{
    public int SeriesTypeId { get; set; }

    public string? Type { get; set; }

    public virtual ICollection<Processor> Processors { get; set; } = new List<Processor>();

    public virtual ICollection<Videocard> Videocards { get; set; } = new List<Videocard>();
}
