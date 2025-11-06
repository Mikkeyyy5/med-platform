using TestAPI.Models;
using TestAPI.Models.DTO;

namespace TestAPI.Services
{
    // Services/IAppealAnalysisService.cs
    public interface IAppealAnalysisService
    {
        AppealAnalysisResultDto AnalyzeAppeal(Appeal appeal);
    }
}
