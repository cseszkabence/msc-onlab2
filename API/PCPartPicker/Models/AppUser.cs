using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace PCPartPicker.Models
{
    public class AppUser : IdentityUser
    {
        public string FullName { get; set; } = string.Empty;

        public ICollection<Configuration> Configurations { get; set; } = new List<Configuration>();
        public ICollection<CartItem> Carts { get; set; } = new List<CartItem>();
        public ICollection<Order> Orders { get; set; } = new List<Order>();

    }
}
