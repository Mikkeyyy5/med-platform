using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TestAPI.Models
{
    public class Appeal
    {
        public int Id { get; set; }
        public string PatientName { get; set; }
        public int PatientAge { get; set; }
        public string PatientPhone { get; set; }
        public string PatientLocation { get; set; }
        public string Symptoms { get; set; }
        public string ChronicDiseases { get; set; } // JSON string
        public string SymptomDuration { get; set; }
        public int PainLevel { get; set; }

        // Результаты анализа
        public string Priority { get; set; } // High, Medium, Low
        public string RecommendedFormat { get; set; } // Telemed, InPerson, Home
        public string RecommendedSpecialty { get; set; }
        public string CoordinatorRecommendation { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }

        public int? AssignedDoctorId { get; set; }
        public Doctor AssignedDoctor { get; set; }

        public AppealStatus Status { get; set; } = AppealStatus.Pending;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
    public enum AppealStatus
    {
        Pending,
        Analyzed,
        Assigned,
        Completed,
        Cancelled
    }
}
