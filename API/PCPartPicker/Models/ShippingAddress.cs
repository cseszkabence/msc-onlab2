using Microsoft.EntityFrameworkCore;

namespace PCPartPicker.Models
{
    [Owned]
    public class ShippingAddress
    {
        public string RecipientName { get; set; } = "";
        public string Line1 { get; set; } = "";
        public string? Line2 { get; set; }
        public string City { get; set; } = "";
        public string State { get; set; } = "";
        public string PostalCode { get; set; } = "";
        public string Country { get; set; } = ""; // 2-letter code ("US","HU",...)
        public string? Phone { get; set; }
    }
}
