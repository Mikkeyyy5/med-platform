namespace TestAPI.Models.DTO
{
    public class AppealAnalysisResultDto
    {
        public string Priority { get; set; }
        public string RecommendedFormat { get; set; }
        public string RecommendedSpecialty { get; set; }
        public string CoordinatorRecommendation { get; set; }
        public int AppealId { get; set; }
    }
}
