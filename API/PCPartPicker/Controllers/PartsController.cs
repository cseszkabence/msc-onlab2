using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PCPartPicker.Interface;
using PCPartPicker.Models;

namespace PCPartPicker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PartsController : ControllerBase
    {
        private readonly MyDbContext _dbContext;
        
        public PartsController(MyDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet("GetVideocard")]
        public async Task <IActionResult> GetVideocard() 
        {
            return Ok(await _dbContext.Videocards.ToListAsync());            
        }

        [HttpGet("GetCase")]
        public async Task<IActionResult> GetCase()
        {
            return Ok(await _dbContext.Pccases.ToListAsync());

        }

        [HttpGet("GetHarddrive")]
        public async Task<IActionResult> GetHarddrive()
        {
            return Ok(await _dbContext.Harddrives.ToListAsync());

        }

        [HttpGet("GetMemory")]
        public async Task<IActionResult> GetMemory()
        {
            return Ok(await _dbContext.Memories.ToListAsync());

        }

        [HttpGet("GetMotherboard")]
        public async Task<IActionResult> GetMotherboard()
        {
            return Ok(await _dbContext.Motherboards.ToListAsync());

        }

        [HttpGet("GetPowersupply")]
        public async Task<IActionResult> GetPowersupply()
        {
            return Ok(await _dbContext.Powersupplies.ToListAsync());
        }

        [HttpGet("GetProcessor")]
        public async Task<IActionResult> GetProcessor()
        {
            return Ok(await _dbContext.Processors.ToListAsync());
        }
        [HttpGet("GetProcessorCooler")]
        public async Task<IActionResult> GetProcessorCooler()
        {
            return Ok(await _dbContext.Cpucoolers.ToListAsync());
        }
    }
}
