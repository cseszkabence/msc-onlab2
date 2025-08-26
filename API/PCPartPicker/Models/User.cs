using System;
using System.Collections.Generic;

namespace PCPartPicker.Models;

public partial class User : AspNetUser
{
    public virtual ICollection<Configuration> Configurations { get; set; } = new List<Configuration>();

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}
