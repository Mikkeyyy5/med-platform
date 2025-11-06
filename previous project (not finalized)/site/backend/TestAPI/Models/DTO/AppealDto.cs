namespace TestAPI.Models.DTO
{
    public class AppealDto
    {
        public string PatientName { get; set; }
        public int PatientAge { get; set; }
        public string PatientPhone { get; set; }
        public string PatientLocation { get; set; }
        public string Symptoms { get; set; }
        public List<string> ChronicDiseases { get; set; }
        public string SymptomDuration { get; set; }
        public int PainLevel { get; set; }
    }
}
