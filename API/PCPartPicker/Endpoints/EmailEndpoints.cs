using Microsoft.AspNetCore.Mvc;
using PCPartPicker.Models;
using PCPartPicker.Services;

namespace PCPartPicker.Endpoints
{
    public static class EmailEndpoints
    {
        public static IEndpointRouteBuilder MapEmailEndpoints(this IEndpointRouteBuilder app)
        {
            app.MapPost("/api/email/sendmail", async (
                IEmailService emailService,
                [FromBody] EmailModel emailModel
                ) =>
            {
                var result = await emailService.SendEmail(emailModel);
                if (result)
                {
                    return Results.Ok(new { message = "Email sent successfully." });
                }
                else
                {
                    return Results.BadRequest(new { message = "Error sending email." });
                }
            }); return app;
        }
    }
}
