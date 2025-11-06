import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigation } from '../hooks/useNavigation'
import { appealService } from '../services/appealService';
import LoadingSpinner from '../Components/LoadingSpinner'
import '../Components/css/styles appeal.css';

const Appeal = () => {
  const { isAuthenticated } = useAuth();
  const { goTo } = useNavigation();
  const [activeTab, setActiveTab] = useState('appeal-form');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const [formData, setFormData] = useState({
    patientName: '',
    patientAge: '',
    patientPhone: '',
    patientLocation: '',
    symptoms: '',
    chronicDiseases: [],
    symptomDuration: '1-3-days',
    painLevel: 1
  });

  const chronicDiseasesOptions = [
    'Гипертония',
    'Сахарный диабет',
    'Бронхиальная астма',
    'Ишемическая болезнь сердца',
    'Заболевания почек',
    'Нет хронических заболеваний'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        chronicDiseases: checked 
          ? [...prev.chronicDiseases, value]
          : prev.chronicDiseases.filter(disease => disease !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      goTo('/login');
      return;
    }

    setLoading(true);
    try {
      const result = await appealService.createAppeal(formData);
      setAnalysisResult(result.analysis);
    } catch (error) {
      console.error('Error creating appeal:', error);
      alert('Ошибка при создании обращения');
    } finally {
      setLoading(false);
    }
  };

  const assignAppointment = async (doctorId) => {
    try {
      await appealService.assignDoctor(analysisResult.appealId, doctorId);
      alert('Приём успешно назначен!');
      goTo('/profile');
    } catch (error) {
      console.error('Error assigning doctor:', error);
      alert('Ошибка при назначении приёма');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Анализ обращения..." />;
  }

  return (
    <div className="appeal-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Система обработки обращений</h1>
          <div>
            <button className="btn btn-outline">Экспорт данных</button>
            <button 
              className="btn btn-primary" 
              onClick={() => setActiveTab('appeal-form')}
            >
              Новое обращение
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'appeal-form' ? 'active' : ''}`}
            onClick={() => setActiveTab('appeal-form')}
          >
            Новое обращение
          </button>
          <button 
            className={`tab ${activeTab === 'doctors' ? 'active' : ''}`}
            onClick={() => setActiveTab('doctors')}
          >
            Врачи
          </button>
        </div>

        {/* Appeal Form Tab */}
        {activeTab === 'appeal-form' && (
          <div className="tab-content active">
            <div className="appeal-form">
              <h2>Форма обращения пациента</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="patient-name">ФИО пациента *</label>
                    <input
                      type="text"
                      id="patient-name"
                      name="patientName"
                      className="form-control"
                      placeholder="Введите ФИО"
                      value={formData.patientName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="patient-age">Возраст *</label>
                    <input
                      type="number"
                      id="patient-age"
                      name="patientAge"
                      className="form-control"
                      placeholder="Возраст"
                      min="0"
                      max="120"
                      value={formData.patientAge}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="patient-phone">Телефон *</label>
                    <input
                      type="tel"
                      id="patient-phone"
                      name="patientPhone"
                      className="form-control"
                      placeholder="+7 (XXX) XXX-XX-XX"
                      value={formData.patientPhone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="patient-location">Местоположение *</label>
                    <input
                      type="text"
                      id="patient-location"
                      name="patientLocation"
                      className="form-control"
                      placeholder="Город, район"
                      value={formData.patientLocation}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="symptoms">Симптомы и жалобы *</label>
                  <textarea
                    id="symptoms"
                    name="symptoms"
                    className="form-control"
                    placeholder="Подробно опишите симптомы, длительность, интенсивность..."
                    rows="4"
                    value={formData.symptoms}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>

                <div className="form-group">
                  <label>Хронические заболевания</label>
                  <div className="checkbox-group">
                    {chronicDiseasesOptions.map(disease => (
                      <label key={disease} className="checkbox-label">
                        <input
                          type="checkbox"
                          value={disease}
                          checked={formData.chronicDiseases.includes(disease)}
                          onChange={handleInputChange}
                        />
                        {disease}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="symptom-duration">Длительность симптомов</label>
                    <select
                      id="symptom-duration"
                      name="symptomDuration"
                      className="form-control"
                      value={formData.symptomDuration}
                      onChange={handleInputChange}
                    >
                      <option value="less-day">Менее 1 дня</option>
                      <option value="1-3-days">1-3 дня</option>
                      <option value="3-7-days">3-7 дней</option>
                      <option value="more-week">Более недели</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="pain-level">Уровень боли (1-10)</label>
                    <input
                      type="range"
                      id="pain-level"
                      name="painLevel"
                      className="form-control"
                      min="1"
                      max="10"
                      value={formData.painLevel}
                      onChange={handleInputChange}
                    />
                    <div className="pain-level-display">
                      <span>1 - минимальная</span>
                      <span className="pain-value">{formData.painLevel}</span>
                      <span>10 - невыносимая</span>
                    </div>
                  </div>
                </div>

                <button type="submit" className="submit-btn">
                  Проанализировать обращение
                </button>
              </form>
            </div>

            {/* Analysis Result */}
            {analysisResult && (
              <div className="analysis-result active">
                <div className="result-header">
                  <h3>Результат анализа обращения</h3>
                  <div>
                    <span className={`priority-badge priority-${analysisResult.priority?.toLowerCase()}`}>
                      {analysisResult.priority === 'High' ? 'Высокий приоритет' : 
                       analysisResult.priority === 'Medium' ? 'Средний приоритет' : 'Низкий приоритет'}
                    </span>
                    <span className={`format-badge format-${analysisResult.recommendedFormat?.toLowerCase()}`}>
                      {analysisResult.recommendedFormat === 'Telemed' ? 'Телемедицина' : 
                       analysisResult.recommendedFormat === 'InPerson' ? 'Очный приём' : 'Выезд на дом'}
                    </span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Рекомендуемый формат приёма:</label>
                    <div className="recommended-value">
                      {analysisResult.recommendedFormat === 'Telemed' ? 'Телемедицинская консультация' : 
                       analysisResult.recommendedFormat === 'InPerson' ? 'Очный приём в клинике' : 'Выезд врача на дом'}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Предполагаемая специализация:</label>
                    <div className="recommended-value">{analysisResult.recommendedSpecialty}</div>
                  </div>
                </div>

                <div className="recommendation-card">
                  <h4>Рекомендации координатору:</h4>
                  <p>{analysisResult.coordinatorRecommendation}</p>
                  
                  <div className="doctor-assignment">
                    <label htmlFor="doctor-assignment">Назначить врача:</label>
                    <select id="doctor-assignment" className="form-control">
                      <option value="">-- Выберите врача --</option>
                      <option value="1">Иванов А.П. (Терапевт, телемедицина)</option>
                      <option value="2">Петрова М.С. (Терапевт, очный приём)</option>
                      <option value="3">Сидоров В.И. (Терапевт, выездной)</option>
                    </select>
                  </div>

                  <div className="action-buttons">
                    <button 
                      className="btn btn-success" 
                      onClick={() => assignAppointment(1)}
                    >
                      Назначить приём
                    </button>
                    <button 
                      className="btn btn-outline" 
                      onClick={() => setAnalysisResult(null)}
                    >
                      Редактировать обращение
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Doctors Tab */}
        {activeTab === 'doctors' && (
          <div className="tab-content active">
            <div className="doctors-tab">
              <h2>Штат врачей</h2>
              <div className="doctors-grid">
                <div className="doctor-card">
                  <div className="doctor-header">
                    <div>
                      <h3>Иванов А.П.</h3>
                      <div className="doctor-specialty">Терапевт</div>
                    </div>
                    <span className="format-badge format-telemed">Телемедицина</span>
                  </div>
                  <p>Стаж: 15 лет. Специализация: терапия, кардиология.</p>
                  <div className="doctor-stats">
                    <div className="stat">
                      <div className="stat-value">12</div>
                      <div className="stat-label">Приёмов сегодня</div>
                    </div>
                    <div className="stat">
                      <div className="stat-value">4.8</div>
                      <div className="stat-label">Рейтинг</div>
                    </div>
                  </div>
                </div>

                <div className="doctor-card">
                  <div className="doctor-header">
                    <div>
                      <h3>Петрова М.С.</h3>
                      <div className="doctor-specialty">Хирург</div>
                    </div>
                    <span className="format-badge format-in-person">Очный приём</span>
                  </div>
                  <p>Стаж: 12 лет. Специализация: общая хирургия, травматология.</p>
                  <div className="doctor-stats">
                    <div className="stat">
                      <div className="stat-value">8</div>
                      <div className="stat-label">Приёмов сегодня</div>
                    </div>
                    <div className="stat">
                      <div className="stat-value">4.9</div>
                      <div className="stat-label">Рейтинг</div>
                    </div>
                  </div>
                </div>

                <div className="doctor-card">
                  <div className="doctor-header">
                    <div>
                      <h3>Сидоров В.И.</h3>
                      <div className="doctor-specialty">Терапевт</div>
                    </div>
                    <span className="format-badge format-home">Выездной</span>
                  </div>
                  <p>Стаж: 10 лет. Специализация: терапия, гериатрия.</p>
                  <div className="doctor-stats">
                    <div className="stat">
                      <div className="stat-value">5</div>
                      <div className="stat-label">Выездов сегодня</div>
                    </div>
                    <div className="stat">
                      <div className="stat-value">4.7</div>
                      <div className="stat-label">Рейтинг</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appeal;