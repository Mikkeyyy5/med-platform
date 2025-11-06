using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TestAPI.Data;
using Newtonsoft.Json;

namespace TestAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DoctorsController : ControllerBase
    {
        private readonly MedicalDbContext _context;

        public DoctorsController(MedicalDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetDoctors([FromQuery] string format = null)
        {
            var query = _context.Doctors.Where(d => d.IsActive);

            if (!string.IsNullOrEmpty(format))
            {
                query = query.Where(d => d.Formats.Contains(format));
            }

            var doctors = await query
                .Select(d => new
                {
                    d.Id,
                    Name = $"{d.FirstName} {d.LastName}",
                    d.Specialty,
                    d.ExperienceYears,
                    d.Description,
                    d.Rating,
                    d.ConsultationsToday,
                    Formats = JsonConvert.DeserializeObject<List<string>>(d.Formats),
                })
                .ToListAsync();

            return Ok(doctors);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDoctor(int id)
        {
            var doctor = await _context.Doctors
                .Where(d => d.Id == id && d.IsActive)
                .Select(d => new
                {
                    d.Id,
                    Name = $"{d.FirstName} {d.LastName}",
                    d.Specialty,
                    d.ExperienceYears,
                    d.Description,
                    d.Rating,
                    d.ConsultationsToday,
                    Formats = JsonConvert.DeserializeObject<List<string>>(d.Formats),
                })
                .FirstOrDefaultAsync();

            if (doctor == null)
                return NotFound();

            return Ok(doctor);
        }
    }
}
