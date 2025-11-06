namespace TestAPI.Services
{
    using TestAPI.Models;
    using TestAPI.Models.DTO;

    public class AppealAnalysisService : IAppealAnalysisService
    {
        public AppealAnalysisResultDto AnalyzeAppeal(Appeal appeal)
        {
            var symptoms = appeal.Symptoms?.ToLower() ?? "";
            var age = appeal.PatientAge;
            var painLevel = appeal.PainLevel;

            // Логика определения приоритета
            string priority = DeterminePriority(symptoms, painLevel, age);

            // Логика определения формата приёма
            string format = DetermineFormat(symptoms, age, priority);

            // Логика определения специализации
            string specialty = DetermineSpecialty(symptoms);

            // Формирование рекомендации
            string recommendation = GenerateRecommendation(priority, format, specialty);

            return new AppealAnalysisResultDto
            {
                Priority = priority,
                RecommendedFormat = format,
                RecommendedSpecialty = specialty,
                CoordinatorRecommendation = recommendation,
                AppealId = appeal.Id
            };
        }

        private string DeterminePriority(string symptoms, int painLevel, int age)
        {
            // Высокий приоритет
            if (painLevel >= 8 ||
                symptoms.Contains("сильная боль") ||
                symptoms.Contains("не могу дышать") ||
                symptoms.Contains("потеря сознания") ||
                symptoms.Contains("кровотечение") ||
                symptoms.Contains("инфаркт") ||
                symptoms.Contains("инсульт"))
            {
                return "High";
            }

            // Низкий приоритет
            if (painLevel <= 3 &&
                !symptoms.Contains("температура") &&
                !symptoms.Contains("рвота") &&
                !symptoms.Contains("тошнота") &&
                symptoms.Contains("плановый") ||
                symptoms.Contains("осмотр"))
            {
                return "Low";
            }

            // Средний приоритет по умолчанию
            return "Medium";
        }

        private string DetermineFormat(string symptoms, int age, string priority)
        {
            // Выезд на дом для пожилых и тяжёлых случаев
            if (age > 70 ||
                symptoms.Contains("не могу ходить") ||
                symptoms.Contains("паралич") ||
                priority == "High")
            {
                return "Home";
            }

            // Очный приём для осмотров и операций
            if (symptoms.Contains("осмотр") ||
                symptoms.Contains("операция") ||
                symptoms.Contains("перелом") ||
                symptoms.Contains("рентген") ||
                symptoms.Contains("узи"))
            {
                return "InPerson";
            }

            // Телемедицина по умолчанию
            return "Telemed";
        }

        private string DetermineSpecialty(string symptoms)
        {
            if (symptoms.Contains("сердце") || symptoms.Contains("давление") || symptoms.Contains("груд"))
                return "Кардиолог";

            if (symptoms.Contains("желудок") || symptoms.Contains("кишечник") || symptoms.Contains("тошнота") || symptoms.Contains("рвота"))
                return "Гастроэнтеролог";

            if (symptoms.Contains("голова") || symptoms.Contains("головокружение") || symptoms.Contains("нерв") || symptoms.Contains("память"))
                return "Невролог";

            if (symptoms.Contains("кожа") || symptoms.Contains("сыпь") || symptoms.Contains("аллергия"))
                return "Дерматолог";

            if (symptoms.Contains("кость") || symptoms.Contains("сустав") || symptoms.Contains("травма") || symptoms.Contains("перелом"))
                return "Травматолог";

            if (symptoms.Contains("ребенок") || symptoms.Contains("дети") || symptoms.Contains("педиатр"))
                return "Педиатр";

            // Терапевт по умолчанию
            return "Терапевт";
        }

        private string GenerateRecommendation(string priority, string format, string specialty)
        {
            return priority switch
            {
                "High" => $"Срочно организовать медицинскую помощь. Приоритет - {GetFormatDescription(format)}. Рекомендуется консультация {specialty}.",
                "Medium" => $"Назначить {GetFormatDescription(format).ToLower()} в течение 24 часов. При ухудшении состояния - организовать очный осмотр. Рекомендуется {specialty}.",
                "Low" => $"Плановый приём. Можно назначить {GetFormatDescription(format).ToLower()} в удобное для пациента время. Рекомендуется {specialty}.",
                _ => $"Назначить {GetFormatDescription(format).ToLower()}. Рекомендуется консультация {specialty}."
            };
        }

        private string GetFormatDescription(string format)
        {
            return format switch
            {
                "Telemed" => "телемедицинскую консультацию",
                "InPerson" => "очный приём в клинике",
                "Home" => "выезд врача на дом",
                _ => "медицинскую консультацию"
            };
        }
    }
}
