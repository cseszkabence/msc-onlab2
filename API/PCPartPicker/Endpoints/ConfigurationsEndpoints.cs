using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PCPartPicker.Models;
using PCPartPicker.Infrastructure;

namespace PCPartPicker.Endpoints
{
    public static class ConfigurationsEndpoints
    {
        public static IEndpointRouteBuilder MapConfigurationsEndpoints(this IEndpointRouteBuilder app)
        {
            var cfgs = app.MapGroup("/api/configurations").RequireAuthorization();

            cfgs.MapGet("/", async (ApplicationDbContext db, HttpContext ctx) =>
            {
                var uid = ctx.GetUserIdString();
                var list = await db.Configurations
                    .Where(c => c.UserId == uid)
                    .ToListAsync();
                return Results.Ok(list);
            });

            cfgs.MapPost("/", async ([FromBody] Configuration dto, ApplicationDbContext db, HttpContext ctx) =>
            {
                var uid = ctx.GetUserIdString();
                dto.UserId = uid;
                db.Configurations.Add(dto);
                await db.SaveChangesAsync();
                return Results.Created($"/api/configurations/{dto.Id}", dto);
            });

            cfgs.MapPut("/{id:int}", async (int id,
                                             [FromBody] Configuration update,
                                             ApplicationDbContext db,
                                             HttpContext ctx) =>
            {
                var uid = ctx.GetUserIdString();
                var cfg = await db.Configurations.FindAsync(id);
                if (cfg == null || cfg.UserId != uid) return Results.NotFound();

                // overwrite allowed fields
                cfg.Name = update.Name;
                cfg.MotherboardId = update.MotherboardId;
                cfg.ProcessorId = update.ProcessorId;
                // …etc for each part FK…

                await db.SaveChangesAsync();
                return Results.Ok(cfg);
            });

            cfgs.MapDelete("/{id:int}", async (int id, ApplicationDbContext db, HttpContext ctx) =>
            {
                var uid = ctx.GetUserIdString();
                var cfg = await db.Configurations.FindAsync(id);
                if (cfg == null || cfg.UserId != uid) return Results.NotFound();

                db.Configurations.Remove(cfg);
                await db.SaveChangesAsync();
                return Results.NoContent();
            });

            cfgs.MapGet("/mine", async (HttpContext ctx, ApplicationDbContext db) =>
            {
                var userId = ctx.GetUserIdString();
                if (string.IsNullOrEmpty(userId)) return Results.Unauthorized();

                var list = await db.Configurations
                    .Where(c => c.UserId == userId)
                    .OrderByDescending(c => c.Id)
                    .Select(c => new
                    {
                        configurationId = c.Id,
                        name = c.Name
                    })
                    .ToListAsync();

                return Results.Ok(list);
            });
            return app;

        }

    }
}
