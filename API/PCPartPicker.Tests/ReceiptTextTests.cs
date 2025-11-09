using FluentAssertions;
using PCPartPicker.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static PCPartPicker.Endpoints.EmailEndpoints;

namespace PCPartPicker.Tests
{
    public class ReceiptTextTests
    {
        [Fact]
        public void ComposeOrderReceipt_TextVersion_Contains_Items_With_Quantities()
        {
            var order = new Order { OrderId = 99, Currency = "eur", ShippingAddress = new ShippingAddress(), TotalPrice = 30m };
            var lines = new[] {
            new ReceiptLine("SSD", 1, 20m, 20m),
            new ReceiptLine("Cable", 2, 5m, 10m)
        };

            var (text, _) = EmailTemplates.ComposeOrderReceipt(order, lines);

            text.Should().Contain("SSD").And.Contain("x1");
            text.Should().Contain("Cable").And.Contain("x2");
            text.Should().Contain("(EUR)");
        }
    }
}
