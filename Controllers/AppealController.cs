using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Newtonsoft.Json;
using TestAPI.Data;
using TestAPI.Services;
using TestAPI.Models.DTO;
using TestAPI.Models;

namespace TestAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AppealsController : ControllerBase
    {
        private readonly MedicalDbContext _context;
        private readonly IAppealAnalysisService _analysisService;

        public AppealsController(MedicalDbContext context, IAppealAnalysisService analysisService)
        {
            _context = context;
            _analysisService = analysisService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateAppeal([FromBody] AppealDto appealDto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

                var appeal = new Appeal
                {
                    PatientName = appealDto.PatientName,
                    PatientAge = appealDto.PatientAge,
                    PatientPhone = appealDto.PatientPhone,
                    PatientLocation = appealDto.PatientLocation,
                    Symptoms = appealDto.Symptoms,
                    ChronicDiseases = JsonConvert.SerializeObject(appealDto.ChronicDiseases ?? new List<string>()),
                    SymptomDuration = appealDto.SymptomDuration,
                    PainLevel = appealDto.PainLevel,
                    UserId = userId,
                    Status = AppealStatus.Pending
                };

                _context.Appeals.Add(appeal);
                await _context.SaveChangesAsync();

                // Анализ обращения после сохранения (чтобы был ID)
                var analysisResult = _analysisService.AnalyzeAppeal(appeal);

                // Обновляем appeal с результатами анализа
                appeal.Priority = analysisResult.Priority;
                appeal.RecommendedFormat = analysisResult.RecommendedFormat;
                appeal.RecommendedSpecialty = analysisResult.RecommendedSpecialty;
                appeal.CoordinatorRecommendation = analysisResult.CoordinatorRecommendation;
                appeal.Status = AppealStatus.Analyzed;

                await _context.SaveChangesAsync();

                // Обновляем ID в результате
                analysisResult.AppealId = appeal.Id;

                return Ok(new
                {
                    appeal = new
                    {
                        appeal.Id,
                        appeal.PatientName,
                        appeal.PatientAge,
                        appeal.PatientPhone,
                        appeal.PatientLocation,
                        appeal.Symptoms,
                        ChronicDiseases = JsonConvert.DeserializeObject<List<string>>(appeal.ChronicDiseases),
                        appeal.SymptomDuration,
                        appeal.PainLevel,
                        appeal.Priority,
                        appeal.RecommendedFormat,
                        appeal.RecommendedSpecialty,
                        appeal.CoordinatorRecommendation,
                        appeal.Status,
                        appeal.CreatedAt
                    },
                    analysis = analysisResult
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetUserAppeals()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var appeals = await _context.Appeals
                .Where(a => a.UserId == userId)
                .Include(a => a.AssignedDoctor)
                .OrderByDescending(a => a.CreatedAt)
                .Select(a => new
                {
                    a.Id,
                    a.PatientName,
                    a.PatientAge,
                    a.PatientPhone,
                    a.PatientLocation,
                    a.Symptoms,
                    ChronicDiseases = JsonConvert.DeserializeObject<List<string>>(a.ChronicDiseases),
                    a.SymptomDuration,
                    a.PainLevel,
                    a.Priority,
                    a.RecommendedFormat,
                    a.RecommendedSpecialty,
                    a.CoordinatorRecommendation,
                    a.Status,
                    a.CreatedAt,
                    AssignedDoctor = a.AssignedDoctor != null ? new
                    {
                        a.AssignedDoctor.Id,
                        Name = $"{a.AssignedDoctor.FirstName} {a.AssignedDoctor.LastName}",
                        a.AssignedDoctor.Specialty
                    } : null
                })
                .ToListAsync();

            return Ok(appeals);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAppeal(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var appeal = await _context.Appeals
                .Where(a => a.Id == id && a.UserId == userId)
                .Include(a => a.AssignedDoctor)
                .Select(a => new
                {
                    a.Id,
                    a.PatientName,
                    a.PatientAge,
                    a.PatientPhone,
                    a.PatientLocation,
                    a.Symptoms,
                    ChronicDiseases = JsonConvert.DeserializeObject<List<string>>(a.ChronicDiseases),
                    a.SymptomDuration,
                    a.PainLevel,
                    a.Priority,
                    a.RecommendedFormat,
                    a.RecommendedSpecialty,
                    a.CoordinatorRecommendation,
                    a.Status,
                    a.CreatedAt,
                    AssignedDoctor = a.AssignedDoctor != null ? new
                    {
                        a.AssignedDoctor.Id,
                        Name = $"{a.AssignedDoctor.FirstName} {a.AssignedDoctor.LastName}",
                        a.AssignedDoctor.Specialty
                    } : null
                })
                .FirstOrDefaultAsync();

            if (appeal == null)
                return NotFound();

            return Ok(appeal);
        }

        [HttpPost("{id}/assign")]
        public async Task<IActionResult> AssignDoctor(int id, [FromBody] AssignDoctorDto assignDto)
        {
            try
            {
                var appeal = await _context.Appeals
                    .Include(a => a.User)
                    .FirstOrDefaultAsync(a => a.Id == id);

                if (appeal == null)
                    return NotFound("Appeal not found");

                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
                if (appeal.UserId != userId)
                    return Forbid();

                var doctor = await _context.Doctors.FindAsync(assignDto.DoctorId);
                if (doctor == null)
                    return NotFound("Doctor not found");

                appeal.AssignedDoctorId = assignDto.DoctorId;
                appeal.Status = AppealStatus.Assigned;

                // Создание приёма
                var appointment = new Appointment
                {
                    UserId = appeal.UserId,
                    DoctorId = assignDto.DoctorId,
                    AppealId = appeal.Id,
                    AppointmentDate = DateTime.UtcNow.AddDays(1).Date,
                    AppointmentTime = GetNextAvailableTime(),
                    Format = appeal.RecommendedFormat,
                    Location = GetAppointmentLocation(appeal.RecommendedFormat, appeal.PatientLocation),
                    Status = "Scheduled"
                };

                _context.Appointments.Add(appointment);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    appeal = new
                    {
                        appeal.Id,
                        appeal.Status,
                        AssignedDoctor = new
                        {
                            doctor.Id,
                            Name = $"{doctor.FirstName} {doctor.LastName}",
                            doctor.Specialty
                        }
                    },
                    appointment = new
                    {
                        appointment.Id,
                        appointment.AppointmentDate,
                        appointment.AppointmentTime,
                        appointment.Format,
                        appointment.Location,
                        appointment.Status
                    }
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        private string GetNextAvailableTime()
        {
            var times = new[] { "09:00", "10:00", "11:00", "14:00", "15:00", "16:00" };
            return times[new Random().Next(times.Length)];
        }

        private string GetAppointmentLocation(string format, string patientLocation)
        {
            return format switch
            {
                "Telemed" => "Онлайн",
                "InPerson" => "Поликлиника №1",
                "Home" => patientLocation,
                _ => "Не определено"
            };
        }
    }
}
