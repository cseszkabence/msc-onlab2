using System.Security.Claims;

namespace PCPartPicker.Infrastructure;

public static class HttpContextExtensions
{
    public static string GetUserIdString(this HttpContext ctx)
    {
        var id = ctx.User.FindFirstValue(ClaimTypes.NameIdentifier);
        return id;
    }
}
