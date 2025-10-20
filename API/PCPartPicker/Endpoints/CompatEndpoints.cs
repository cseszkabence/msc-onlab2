using PCPartPicker.Models;

namespace PCPartPicker.Endpoints
{
    public record StrictCompatRequest(
    int? cpuId,
    int? motherboardId,
    int? memoryId,
    int? caseId
);

    public record StrictCompatResult(
        bool ok,
        string[] errors,
        object facts
    );
    public static class CompatEndpoints
    {
        public static IEndpointRouteBuilder MapCompatEndpoints(this IEndpointRouteBuilder app)
        {
            app.MapPost("/api/compat/strict", async (
                StrictCompatRequest req,
                ApplicationDbContext db) =>
            {
                // Load only the pieces we need
                var cpu = req.cpuId is int cId ? await db.Processors.FindAsync(cId) : null;
                var mobo = req.motherboardId is int mId ? await db.Motherboards.FindAsync(mId) : null;
                var ram = req.memoryId is int rId ? await db.Memories.FindAsync(rId) : null;
                var kase = req.caseId is int kId ? await db.Pccases.FindAsync(kId) : null;

                var errors = new List<string>();

                // --- Helpers (adjust property names to your schema!) ---
                // Most projects have both an Id FK and a Name via navigation; we accept either.
                static string? Name(dynamic? x) => x?.Name;

                static int? SocketId(dynamic? x) => (int?)(x?.SocketTypeId);
                static string? SocketName(dynamic? x) => (string?)(x?.SocketType?.Type);

                static int? MemTypeId(dynamic? x) => (int?)(x?.MemoryTypeId);
                static string? MemTypeName(dynamic? x) => (string?)(x?.MemoryType?.Type);

                static int? FormId(dynamic? x) => (int?)(x?.FormFactorTypeId);
                static string? FormName(dynamic? x) => (string?)(x?.FormFactorType?.Type);

                // Case can be modeled two ways:
                // A) single form-factor (FormfactorTypeId), or
                // B) "SupportedFormfactors" collection (many-to-many)
                static IReadOnlyList<int> CaseSupportedFormIds(dynamic? kase)
                    => ((IEnumerable<object>?)kase?.SupportedFormfactors ?? Array.Empty<object>())
                       .Select(o => (int?)(o as dynamic)?.Id ?? -1).Where(i => i > 0).Cast<int>().ToList();

                static IReadOnlyList<string> CaseSupportedFormNames(dynamic? kase)
                    => ((IEnumerable<object>?)kase?.SupportedFormfactors ?? Array.Empty<object>())
                       .Select(o => (string?)(o as dynamic)?.TYpe ?? "")
                       .Where(s => !string.IsNullOrWhiteSpace(s)).Cast<string>().ToList();

                static bool StrEq(string? a, string? b)
                    => !(string.IsNullOrWhiteSpace(a) || string.IsNullOrWhiteSpace(b)) &&
                       string.Equals(a.Trim(), b.Trim(), StringComparison.OrdinalIgnoreCase);

                // --- 1) CPU ↔ Motherboard: socket ---
                if (cpu is not null && mobo is not null)
                {
                    var cpuSid = SocketId(cpu);
                    var mobSid = SocketId(mobo);
                    var cpuSn = SocketName(cpu);
                    var mobSn = SocketName(mobo);

                    var match =
                        (cpuSid.HasValue && mobSid.HasValue && cpuSid == mobSid) ||
                        StrEq(cpuSn, mobSn);

                    if (!match)
                        errors.Add($"CPU socket ({cpuSn ?? cpuSid?.ToString() ?? "?"}) does not match motherboard socket ({mobSn ?? mobSid?.ToString() ?? "?"}).");
                }

                // --- 2) Memory ↔ Motherboard: memory type ---
                if (ram is not null && mobo is not null)
                {
                    var ramTid = MemTypeId(ram);
                    var mobTid = MemTypeId(mobo);
                    var ramTn = MemTypeName(ram);   // e.g. "DDR4"
                    var mobTn = MemTypeName(mobo);

                    var match =
                        (ramTid.HasValue && mobTid.HasValue && ramTid == mobTid) ||
                        StrEq(ramTn, mobTn);

                    if (!match)
                        errors.Add($"Memory type ({ramTn ?? ramTid?.ToString() ?? "?"}) is not supported by motherboard ({mobTn ?? mobTid?.ToString() ?? "?"}).");
                }

                // --- 3) Motherboard ↔ Case: form factor support ---
                if (mobo is not null && kase is not null)
                {
                    var mfId = FormId(mobo);
                    var mfNm = FormName(mobo);

                    // Path A: case lists many supported form factors
                    var supportsIds = CaseSupportedFormIds(kase);
                    var supportsNms = CaseSupportedFormNames(kase);

                    bool supported;
                    if (supportsIds.Count > 0 || supportsNms.Count > 0)
                    {
                        supported =
                            (mfId.HasValue && supportsIds.Contains(mfId.Value)) ||
                            supportsNms.Any(n => StrEq(n, mfNm));
                    }
                    else
                    {
                        // Path B: case has a single form factor (fallback to equality)
                        var caseId = FormId(kase);
                        var caseNm = FormName(kase);
                        supported = (mfId.HasValue && caseId.HasValue && mfId == caseId) || StrEq(mfNm, caseNm);
                    }

                    if (!supported)
                        errors.Add($"Case does not list support for motherboard form factor {mfNm ?? mfId?.ToString() ?? "?"}.");
                }

                // Build facts (for UI and for Gemini to *explain*)
                var facts = new
                {
                    names = new
                    {
                        cpu = Name(cpu),
                        mobo = Name(mobo),
                        memory = Name(ram),
                        kase = Name(kase)
                    },
                    sockets = new { cpu = SocketName(cpu) ?? SocketId(cpu)?.ToString(), mobo = SocketName(mobo) ?? SocketId(mobo)?.ToString() },
                    memtype = new { memory = MemTypeName(ram) ?? MemTypeId(ram)?.ToString(), mobo = MemTypeName(mobo) ?? MemTypeId(mobo)?.ToString() },
                    form = new
                    {
                        mobo = FormName(mobo) ?? FormId(mobo)?.ToString(),
                        caseSupports = CaseSupportedFormNames(kase),
                        caseForm = FormName(kase) ?? FormId(kase)?.ToString()
                    }
                };

                var ok = errors.Count == 0;
                return Results.Ok(new StrictCompatResult(ok, errors.ToArray(), facts));
            }); return app;
        }
    }
}
