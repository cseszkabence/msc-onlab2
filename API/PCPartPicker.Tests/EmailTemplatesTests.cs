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
    public class EmailTemplatesTests
    {
        [Fact]
        public void ComposeOrderReceipt_EscapesHtml_In_HtmlVersion()
        {
            var order = new Order
            {
                OrderId = 123,
                Currency = "usd",
                ShippingAddress = new ShippingAddress
                {
                    RecipientName = "<b>Eve</b>",
                    Line1 = "Main <script>alert(1)</script> St",
                    PostalCode = "12345",
                    City = "Budapest",
                    State = "BP",
                    Country = "HU"
                },
                TotalPrice = 2000m
            };

            var lines = new List<ReceiptLine> {
            new ReceiptLine("<b>GPU</b>", 2, 1000m, 2000m)
        };

            var (text, html) = EmailTemplates.ComposeOrderReceipt(order, lines);

            // HTML must be encoded (no raw <b> tags)
            html.Should().Contain("&lt;b&gt;GPU&lt;/b&gt;");
            html.Should().Contain("&lt;b&gt;Eve&lt;/b&gt;");
            html.Should().NotContain("<b>GPU</b>");

            // Text version stays readable, includes the item name and quantity
            text.Should().Contain("GPU");
            text.Should().Contain("x2");

            // Footer shows uppercase ISO currency code
            html.Should().Contain("(USD)");
        }

        [Theory]
        [InlineData("usd", "(USD)")]
        [InlineData("eur", "(EUR)")]
        [InlineData("huf", "(HUF)")]
        public void ComposeOrderReceipt_ShowsIsoCurrencyInTotals(string input, string expected)
        {
            var order = new Order { OrderId = 7, Currency = input, ShippingAddress = new ShippingAddress(), TotalPrice = 10m };
            var lines = new[] { new ReceiptLine("Item", 1, 10m, 10m) };

            var (_, html) = EmailTemplates.ComposeOrderReceipt(order, lines);
            html.Should().Contain(expected);
        }
    }
}
