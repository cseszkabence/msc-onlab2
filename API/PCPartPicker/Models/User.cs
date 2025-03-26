using System;
using System.Collections.Generic;

namespace PCPartPicker.Models;

public partial class User
{
    public int Id { get; set; }

    public string EmailAddress { get; set; } = null!;

    public string Password { get; set; } = null!;

    public virtual ICollection<Configuration> Configurations { get; set; } = new List<Configuration>();

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}
