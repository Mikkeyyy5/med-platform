using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TestAPI.Models
{
    public class Doctor
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Specialty { get; set; }
        public string Formats { get; set; } // JSON string: ["Telemed", "InPerson", "Home"]
        public int ExperienceYears { get; set; }
        public string Description { get; set; }
        public decimal Rating { get; set; }
        public int ConsultationsToday { get; set; }
        public bool IsActive { get; set; } = true;

        public List<Appeal> Appeals { get; set; } = new();
        public List<Appointment> Appointments { get; set; } = new();
    }
}
