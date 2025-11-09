using FluentAssertions;
using Microsoft.AspNetCore.Http;
using PCPartPicker.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace PCPartPicker.Tests
{
    public class HttpContextExtensionsTests
    {
        [Fact]
        public void GetUserIdString_Returns_NameIdentifier()
        {
            var ctx = new DefaultHttpContext();
            var identity = new ClaimsIdentity(new[] {
            new Claim(ClaimTypes.NameIdentifier, "user-123")
        }, "TestAuth");
            ctx.User = new ClaimsPrincipal(identity);

            var id = HttpContextExtensions.GetUserIdString(ctx);
            id.Should().Be("user-123");
        }
    }
}
