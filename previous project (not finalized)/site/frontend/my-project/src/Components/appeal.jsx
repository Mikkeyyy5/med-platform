import React, { useState } from 'react';
import { useNavigation } from '../hooks/useNavigation';
import { useAuth } from '../hooks/useAuth';
import { appealService } from '../services/appealService';

const Appeal = () => {
  const { goTo } = useNavigation();
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    patientName: '',
    patientAge: '',
    patientPhone: '',
    patientLocation: '',
    symptoms: '',
    chronicDiseases: [],
    symptomDuration: '',
    painLevel: 1
  });
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Система обработки обращений</h1>
        <div>
          <button className="btn btn-outline">Экспорт данных</button>
          <button className="btn btn-primary" onClick={() => document.getElementById('patient-appeal-form').scrollIntoView()}>
            Новое обращение
          </button>
        </div>
      </div>

      {/* Форма обращения - аналогичная HTML версии */}
      <div className="appeal-form">
        <h2>Форма обращения пациента</h2>
        <form id="patient-appeal-form" onSubmit={handleSubmit}>
          {/* Поля формы как в HTML */}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Анализ...' : 'Проанализировать обращение'}
          </button>
        </form>
      </div>

      {/* Результат анализа */}
      {analysisResult && (
        <div className="analysis-result active">
          {/* Аналогично HTML версии */}
        </div>
      )}
    </div>
  );
};

export default Appeal;