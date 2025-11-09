using FluentAssertions;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging.Abstractions;
using PCPartPicker.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCPartPicker.Tests
{
    public class EmailServiceTests
    {
        [Fact]
        public async Task FormatEmailTemplate_Replaces_Placeholders()
        {
            // Arrange: temp working dir with Templates/email.html
            var tmp = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString("N"));
            Directory.CreateDirectory(Path.Combine(tmp, "Templates"));
            File.WriteAllText(Path.Combine(tmp, "Templates", "email.html"),
                "<title>{subject}</title><div>{fromEmail}:{message}</div>");

            var prev = Environment.CurrentDirectory;
            Environment.CurrentDirectory = tmp;
            try
            {
                var config = new ConfigurationBuilder().Build();
                var svc = new EmailService(NullLogger<EmailService>.Instance, config);

                // Act
                var html = await svc.FormatEmailTemplate("from@ex.com", "Subject X", "to@ex.com", "Hello!");

                // Assert
                html.Should().Contain("<title>Subject X</title>");
                html.Should().Contain("from@ex.com:Hello!");
            }
            finally
            {
                Environment.CurrentDirectory = prev;
                Directory.Delete(tmp, recursive: true);
            }
        }
    }
}
