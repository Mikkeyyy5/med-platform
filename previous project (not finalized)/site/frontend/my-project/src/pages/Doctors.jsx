import React, { useState, useEffect } from 'react';
import { doctorsService } from '../services/doctorsService';
import LoadingSpinner from '../Components/LoadingSpinner';
import '../Components/css/styles doctor.css'

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDoctors();
  }, []);

  useEffect(() => {
    filterDoctors(activeTab);
  }, [doctors, activeTab]);

  const loadDoctors = async () => {
    try {
      const data = await doctorsService.getDoctors();
      setDoctors(data);
    } catch (error) {
      console.error('Error loading doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterDoctors = (category) => {
    if (category === 'all') {
      setFilteredDoctors(doctors);
    } else {
      const filtered = doctors.filter(doctor => 
        doctor.formats?.includes(category)
      );
      setFilteredDoctors(filtered);
    }
  };

  const handleTabClick = (category) => {
    setActiveTab(category);
  };

  if (loading) {
    return <LoadingSpinner text="Загрузка врачей..." />;
  }

  return (
    <div className="doctors-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Наши врачи</h1>
          <div>
            <button className="btn btn-outline">Фильтры</button>
            <button className="btn btn-primary">Добавить врача</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => handleTabClick('all')}
          >
            Все врачи
          </button>
          <button 
            className={`tab ${activeTab === 'Telemed' ? 'active' : ''}`}
            onClick={() => handleTabClick('Telemed')}
          >
            Телемедицина
          </button>
          <button 
            className={`tab ${activeTab === 'InPerson' ? 'active' : ''}`}
            onClick={() => handleTabClick('InPerson')}
          >
            Очный приём
          </button>
          <button 
            className={`tab ${activeTab === 'Home' ? 'active' : ''}`}
            onClick={() => handleTabClick('Home')}
          >
            Выездные
          </button>
        </div>

        {/* Doctors Grid */}
        <div className="doctors-grid">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map(doctor => (
              <div key={doctor.id} className="doctor-card">
                <div className="doctor-header">
                  <div>
                    <h3>{doctor.name}</h3>
                    <div className="doctor-specialty">{doctor.specialty}</div>
                  </div>
                  {doctor.formats?.includes('Telemed') && (
                    <span className="format-badge format-telemed">Телемедицина</span>
                  )}
                  {doctor.formats?.includes('InPerson') && (
                    <span className="format-badge format-in-person">Очный приём</span>
                  )}
                  {doctor.formats?.includes('Home') && (
                    <span className="format-badge format-home">Выездной</span>
                  )}
                </div>
                <p>Стаж: {doctor.experienceYears} лет. {doctor.description}</p>
                <div className="doctor-stats">
                  <div className="stat">
                    <div className="stat-value">{doctor.consultationsToday}</div>
                    <div className="stat-label">
                      {doctor.formats?.includes('Home') ? 'Выездов сегодня' : 'Приёмов сегодня'}
                    </div>
                  </div>
                  <div className="stat">
                    <div className="stat-value">{doctor.rating}</div>
                    <div className="stat-label">Рейтинг</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-doctors">
              <p>Врачи не найдены</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctors;