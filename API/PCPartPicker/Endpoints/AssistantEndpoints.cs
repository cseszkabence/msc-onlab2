using Mscc.GenerativeAI;

namespace PCPartPicker.Endpoints
{
    public static class AssistantEndpoints
    {
        public record ReviewByNamesRequest(
    string? Cpu,
    string? Gpu,
    string? Motherboard,
    string? Memory,
    string? Storage,
    string? Powersupply,
    string? Pccase,
    string? Cpucooler,
    string? TargetUse,
    string? BudgetTier
);
        public static IEndpointRouteBuilder MapAssistantEndpoints(this IEndpointRouteBuilder app)
        {

            app.MapPost("/api/assistant/review", async (
                ReviewByNamesRequest req,
                GenerativeModel model
            ) =>
            {
                var snapshot = new
                {
                    cpu = req.Cpu,
                    gpu = req.Gpu,
                    motherboard = req.Motherboard,
                    memory = req.Memory,
                    storage = req.Storage,
                    powersupply = req.Powersupply,
                    pccase = req.Pccase,
                    cpucooler = req.Cpucooler,
                    targetUse = req.TargetUse,
                    budgetTier = req.BudgetTier
                };

                var prompt = $@"
                You are a pragmatic PC build advisor. You will receive ONLY THE PART NAMES of a PC configuration.
                Based on widely-known typical performance of those parts (if known), give a conservative assessment.

                Rules:
                - If any part is unknown/ambiguous from name alone, you can look it up on the web and get the basic info about it.
                - Do NOT invent exact specs; stick to typical/approximate understanding only.
                - Suggest the top 1-3 upgrades that would most improve the stated target use (if provided) or general gaming/office use.
                - If there are parts missing, assume it that the user will add it later.

                Return a text based summary in a few sentences. Whats the current build good for, and what are its weaknesses? What could be improved?

                CURRENT BUILD (names only, some may be null):
                {System.Text.Json.JsonSerializer.Serialize(snapshot)}
                ";

                var result = await model.GenerateContent(prompt);
                var text = (result.Text ?? "I couldn't generate a review for this build. Try adding more parts.").Trim();

                return Results.Text(text, "text/plain; charset=utf-8");
            });
            return app;
        }
    }
}
