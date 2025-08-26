using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PCPartPicker.Models;

namespace PCPartPicker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PartsController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;

        public PartsController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet("GetVideocard")]
        public async Task<IActionResult> GetVideocard()
        {
            return Ok(await _dbContext.Videocards
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
        .ToListAsync());
        }

        [HttpGet("GetCase")]
        public async Task<IActionResult> GetCase()
        {
            return Ok(await _dbContext.Pccases
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
        .ToListAsync());

        }

        [HttpGet("GetHarddrive")]
        public async Task<IActionResult> GetHarddrive()
        {
            return Ok(await _dbContext.Harddrives
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
        .ToListAsync());

        }

        [HttpGet("GetMemory")]
        public async Task<IActionResult> GetMemory()
        {
            return Ok(await _dbContext.Memories
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
        .ToListAsync());

        }

        [HttpGet("GetMotherboard")]
        public async Task<IActionResult> GetMotherboard()
        {
            return Ok(await _dbContext.Motherboards
        .Include(p => p.ManufacturerType)
        .Include(p => p.SocketType)
        .Include(p => p.MemoryType)
        .Include(p => p.FormFactoryType)
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
            FormFactoryType = p.FormFactoryType!.Type,
        })
        .ToListAsync());

        }

        [HttpGet("GetPowersupply")]
        public async Task<IActionResult> GetPowersupply()
        {
            return Ok(await _dbContext.Powersupplies
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
        .ToListAsync());
        }

        [HttpGet("GetProcessor")]
        public async Task<IActionResult> GetProcessor()
        {
            return Ok(await _dbContext.Processors
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
            ManufacturerType = p.ManufacturerType!.Type,  // Only include the Type
            SocketType = p.SocketType!.Type,
            SeriesType = p.SeriesType!.Type
        })
        .ToListAsync());
        }

        [HttpGet("GetProcessorCooler")]
        public async Task<IActionResult> GetProcessorCooler()
        {
            return Ok(await _dbContext.Cpucoolers
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
        .ToListAsync());
        }

        /*
        [HttpGet("GetProcessorManufData")]
        public async Task<List<string?>> GetProcessorManufData()
        {
            return await _dbContext.Processors
        .Select(p => p.ManufacturerTypeId)
        .Distinct()
        .Join(_dbContext.ManufacturerTypes,
              processorManufacturerId => processorManufacturerId,
              manufacturer => manufacturer.ManufacturerTypeId,
              (processorManufacturerId, manufacturer) => manufacturer.Type)
        .ToListAsync();
        }*/
    }
}
