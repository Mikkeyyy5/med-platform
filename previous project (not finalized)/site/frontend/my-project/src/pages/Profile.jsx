import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { appointmentsService } from '../services/appointmentService';
import LoadingSpinner from '../Components/LoadingSpinner';
import '../Components/css/styles profile.css'

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, []);

  useEffect(() => {
    filterAppointments('all');
  }, [appointments]);

  const loadAppointments = async () => {
    try {
      const data = await appointmentsService.getUserAppointments();
      setAppointments(data);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = (status) => {
    if (status === 'all') {
      setFilteredAppointments(appointments);
    } else {
      const filtered = appointments.filter(appt => appt.status === status);
      setFilteredAppointments(filtered);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    if (window.confirm('Вы уверены, что хотите отменить приём?')) {
      try {
        await appointmentsService.cancelAppointment(appointmentId);
        loadAppointments(); // Reload appointments
        alert('Приём отменен');
      } catch (error) {
        console.error('Error canceling appointment:', error);
        alert('Ошибка при отмене приёма');
      }
    }
  };

  if (loading) {
    return <LoadingSpinner text="Загрузка профиля..." />;
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Мой профиль</h1>
        </div>

        <div className="profile-layout">
          {/* Sidebar */}
          <div className="profile-sidebar">
            <div className="user-avatar">
              <i className="fas fa-user-circle avatar-icon"></i>
              <div className="user-name">{user?.firstName} {user?.lastName}</div>
              <div className="user-email">{user?.email}</div>
            </div>
            
            <ul className="profile-nav">
              <li>
                <a 
                  href="#" 
                  className={activeTab === 'appointments' ? 'active' : ''}
                  onClick={(e) => { e.preventDefault(); setActiveTab('appointments'); }}
                >
                  <i className="fas fa-calendar-check"></i> Мои приёмы
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className={activeTab === 'personal-info' ? 'active' : ''}
                  onClick={(e) => { e.preventDefault(); setActiveTab('personal-info'); }}
                >
                  <i className="fas fa-user-edit"></i> Личная информация
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className={activeTab === 'medical-info' ? 'active' : ''}
                  onClick={(e) => { e.preventDefault(); setActiveTab('medical-info'); }}
                >
                  <i className="fas fa-file-medical"></i> Медицинская карта
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className={activeTab === 'settings' ? 'active' : ''}
                  onClick={(e) => { e.preventDefault(); setActiveTab('settings'); }}
                >
                  <i className="fas fa-cog"></i> Настройки
                </a>
              </li>
            </ul>
          </div>

          {/* Content */}
          <div className="profile-content">
            {/* Appointments Tab */}
            {activeTab === 'appointments' && (
              <div className="tab-content active">
                <h2>Мои приёмы у врача</h2>
                
                <div className="tabs">
                  <button 
                    className="tab active"
                    onClick={() => filterAppointments('all')}
                  >
                    Все приёмы
                  </button>
                  <button 
                    className="tab"
                    onClick={() => filterAppointments('scheduled')}
                  >
                    Запланированные
                  </button>
                  <button 
                    className="tab"
                    onClick={() => filterAppointments('completed')}
                  >
                    Завершённые
                  </button>
                  <button 
                    className="tab"
                    onClick={() => filterAppointments('cancelled')}
                  >
                    Отменённые
                  </button>
                </div>

                <div className="appointments-list">
                  {filteredAppointments.length > 0 ? (
                    filteredAppointments.map(appointment => (
                      <div key={appointment.id} className="appointment-card">
                        <div className="appointment-header">
                          <div>
                            <div className="appointment-doctor">{appointment.doctor?.name}</div>
                            <div className="appointment-specialty">{appointment.doctor?.specialty}</div>
                          </div>
                          <span className={`appointment-status status-${appointment.status}`}>
                            {appointment.status === 'scheduled' ? 'Запланирован' :
                             appointment.status === 'completed' ? 'Завершён' : 'Отменён'}
                          </span>
                        </div>
                        <div className="appointment-details">
                          <div className="detail-item">
                            <span className="detail-label">Дата и время</span>
                            <span className="detail-value">
                              {new Date(appointment.appointmentDate).toLocaleDateString('ru-RU')} в {appointment.appointmentTime}
                            </span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Формат приёма</span>
                            <span className="detail-value">{appointment.format}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Место приёма</span>
                            <span className="detail-value">{appointment.location}</span>
                          </div>
                        </div>
                        {appointment.status === 'scheduled' && (
                          <div className="appointment-actions">
                            <button 
                              className="btn btn-outline"
                              onClick={() => cancelAppointment(appointment.id)}
                            >
                              Отменить приём
                            </button>
                            <button className="btn btn-primary">
                              Перенести
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <i className="fas fa-calendar-times empty-icon"></i>
                      <h3>У вас пока нет приёмов</h3>
                      <p>Запишитесь на приём к врачу, чтобы увидеть его здесь</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Personal Info Tab */}
            {activeTab === 'personal-info' && (
              <div className="tab-content active">
                <h2>Личная информация</h2>
                <form className="personal-info-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="first-name">Имя</label>
                      <input
                        type="text"
                        id="first-name"
                        className="form-control"
                        defaultValue={user?.firstName}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="last-name">Фамилия</label>
                      <input
                        type="text"
                        id="last-name"
                        className="form-control"
                        defaultValue={user?.lastName}
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      className="form-control"
                      defaultValue={user?.email}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="phone">Телефон</label>
                    <input
                      type="tel"
                      id="phone"
                      className="form-control"
                      defaultValue={user?.phone}
                    />
                  </div>
                  
                  <button type="submit" className="btn btn-primary">
                    Сохранить изменения
                  </button>
                </form>
              </div>
            )}

            {/* Other tabs can be implemented similarly */}
            {activeTab === 'medical-info' && (
              <div className="tab-content active">
                <h2>Медицинская карта</h2>
                <p>Раздел в разработке...</p>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="tab-content active">
                <h2>Настройки</h2>
                <p>Раздел в разработке...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;