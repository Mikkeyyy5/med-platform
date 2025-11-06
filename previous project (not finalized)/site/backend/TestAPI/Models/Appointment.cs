namespace TestAPI.Models
{
    public class Appointment
    {
        public int Id { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string AppointmentTime { get; set; }
        public string Format { get; set; }
        public string Location { get; set; }
        public string Status { get; set; } = "Scheduled";

        public int UserId { get; set; }
        public User User { get; set; }

        public int DoctorId { get; set; }
        public Doctor Doctor { get; set; }

        public int AppealId { get; set; }
        public Appeal Appeal { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
    
}
