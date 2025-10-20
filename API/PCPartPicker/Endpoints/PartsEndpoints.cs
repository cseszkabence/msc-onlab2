using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PCPartPicker.Models;

namespace PCPartPicker.Endpoints
{
    public static class PartsEndpoints
    {
        public static IEndpointRouteBuilder MapPartsEndpoint(this IEndpointRouteBuilder app)
        {
            var parts = app.MapGroup("/api/parts");
            parts.MapGet("/getPart", async (int partId, string partType, ApplicationDbContext db) =>
            {
                var item = await db.ComponentLookup(partId, partType);

                return Results.Ok(item);
            });
            parts.MapGet("/GetVideocard", async ([FromServices] ApplicationDbContext db) =>
            {
                var list = await db.Videocards
                    .Include(p => p.ManufacturerType)
                    .Include(p => p.ChipsetType)
                    .Include(p => p.SeriesType)
                    .Select(p => new
                    {
                        p.Id,
                        p.Name,
                        p.Price,
                        p.Chipset,
                        p.Memory,
                        p.CoreClock,
                        p.BoostClock,
                        p.Color,
                        p.Length,
                        ManufacturerType = p.ManufacturerType!.Type,
                        ChipsetType = p.ChipsetType!.Type,
                        SeriesType = p.SeriesType!.Type
                    })
                    .ToListAsync();

                return Results.Ok(list);
            });

            // GET /api/parts/GetCase
            parts.MapGet("/GetCase", async ([FromServices] ApplicationDbContext db) =>
            {
                var list = await db.Pccases
                    .Include(p => p.ManufacturerType)
                    .Include(p => p.FormFactorType)
                    .Select(p => new
                    {
                        p.Id,
                        p.Name,
                        p.Price,
                        p.FormFactor,
                        p.Color,
                        p.SidePanel,
                        p.ExternalVolume,
                        p.Internal35Bays,
                        ManufacturerType = p.ManufacturerType!.Type,
                        FormFactorType = p.FormFactorType!.Type
                    })
                    .ToListAsync();

                return Results.Ok(list);
            });

            // GET /api/parts/GetHarddrive
            parts.MapGet("/GetHarddrive", async ([FromServices] ApplicationDbContext db) =>
            {
                var list = await db.Harddrives
                    .Include(p => p.ManufacturerType)
                    .Include(p => p.DriveType)
                    .Select(p => new
                    {
                        p.Id,
                        p.Name,
                        p.Price,
                        p.Capacity,
                        p.PricePerGb,
                        p.Type,
                        p.Cache,
                        p.Interface,
                        ManufacturerType = p.ManufacturerType!.Type,
                        DriveType = p.DriveType!.Type
                    })
                    .ToListAsync();

                return Results.Ok(list);
            });

            // GET /api/parts/GetMemory
            parts.MapGet("/GetMemory", async ([FromServices] ApplicationDbContext db) =>
            {
                var list = await db.Memories
                    .Include(p => p.ManufacturerType)
                    .Include(p => p.TypeNavigation)
                    .Select(p => new
                    {
                        p.Id,
                        p.Name,
                        p.Price,
                        p.Speed,
                        p.Modules,
                        p.PricePerGb,
                        p.Color,
                        p.FirstWordLatency,
                        p.CasLatency,
                        ManufacturerType = p.ManufacturerType!.Type,
                        TypeNavigation = p.TypeNavigation!.Type
                    })
                    .ToListAsync();

                return Results.Ok(list);
            });

            // GET /api/parts/GetMotherboard
            parts.MapGet("/GetMotherboard", async ([FromServices] ApplicationDbContext db) =>
            {
                var list = await db.Motherboards
                    .Include(p => p.ManufacturerType)
                    .Include(p => p.SocketType)
                    .Include(p => p.MemoryType)
                    .Include(p => p.FormFactorType)
                    .Select(p => new
                    {
                        p.Id,
                        p.Name,
                        p.Price,
                        p.Socket,
                        p.FormFactor,
                        p.MaxMemory,
                        p.MemorySlots,
                        p.Color,
                        ManufacturerType = p.ManufacturerType!.Type,
                        SocketType = p.SocketType!.Type,
                        MemoryType = p.MemoryType!.Type,
                        FormFactorType = p.FormFactorType!.Type,
                    })
                    .ToListAsync();

                return Results.Ok(list);
            });

            // GET /api/parts/GetPowersupply
            parts.MapGet("/GetPowersupply", async ([FromServices] ApplicationDbContext db) =>
            {
                var list = await db.Powersupplies
                    .Include(p => p.ManufacturerType)
                    .Include(p => p.FormFactor)
                    .Select(p => new
                    {
                        p.Id,
                        p.Name,
                        p.Price,
                        p.Type,
                        p.Efficiency,
                        p.Wattage,
                        p.Modular,
                        p.Color,
                        ManufacturerType = p.ManufacturerType!.Type,
                        FormFactor = p.FormFactor!.Type,
                    })
                    .ToListAsync();

                return Results.Ok(list);
            });

            // GET /api/parts/GetProcessor
            parts.MapGet("/GetProcessor", async ([FromServices] ApplicationDbContext db) =>
            {
                var list = await db.Processors
                    .Include(p => p.ManufacturerType)
                    .Include(p => p.SocketType)
                    .Include(p => p.SeriesType)
                    .Select(p => new
                    {
                        p.Id,
                        p.Name,
                        p.Price,
                        p.SocketTypeId,
                        p.CoreCount,
                        p.CoreClock,
                        p.BoostClock,
                        p.Tdp,
                        p.Graphics,
                        p.Smt,
                        ManufacturerType = p.ManufacturerType!.Type,
                        SocketType = p.SocketType!.Type,
                        SeriesType = p.SeriesType!.Type
                    })
                    .ToListAsync();

                return Results.Ok(list);
            });

            // GET /api/parts/GetProcessorCooler
            parts.MapGet("/GetProcessorCooler", async ([FromServices] ApplicationDbContext db) =>
            {
                var list = await db.Cpucoolers
                    .Include(p => p.ManufacturerType)
                    .Select(p => new
                    {
                        p.Id,
                        p.Name,
                        p.Price,
                        p.Rpm,
                        p.NoiseLevel,
                        p.Color,
                        p.Size,
                        ManufacturerType = p.ManufacturerType!.Type,
                    })
                    .ToListAsync();

                return Results.Ok(list);
            });
            return app;
        }
    }
}
