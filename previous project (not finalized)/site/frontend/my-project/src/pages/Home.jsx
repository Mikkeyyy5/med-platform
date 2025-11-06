import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigation } from '../hooks/useNavigation';
import '../Components/css/styles med.css';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const { goTo } = useNavigation();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      goTo('/appeal');
    } else {
      goTo('/login');
    }
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h2>Оптимизация медицинской помощи</h2>
          <p>Цифровая платформа для автоматического определения формата оказания помощи и эффективного распределения ресурсов медицинских учреждений</p>
          <button className="btn btn-primary hero-btn" onClick={handleGetStarted}>
            Начать использование
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="section-title">
            <h2>Ключевые возможности платформы</h2>
            <p>Решение, которое учитывает специфику здравоохранения и готово к интеграции с существующими ИТ-системами</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-user-injured"></i>
              </div>
              <h3>Приём обращений пациентов</h3>
              <p>Принимаем обращения через удобную веб-форму или API, собирая все необходимые параметры: возраст, симптомы, локация, хронические заболевания.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-brain"></i>
              </div>
              <h3>Анализ и классификация</h3>
              <p>Автоматически определяем уровень срочности обращения и рекомендуемый формат приёма: телемедицина, очный приём или выезд врача.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-user-md"></i>
              </div>
              <h3>Управление врачами</h3>
              <p>Разделение врачей на категории: телемедицина, очные приёмы и выездные специалисты для оптимального распределения нагрузки.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-calendar-alt"></i>
              </div>
              <h3>Формирование расписания</h3>
              <p>Автоматическое формирование расписания или предоставление рекомендаций координатору поликлиники.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-chart-bar"></i>
              </div>
              <h3>Визуальная панель мониторинга</h3>
              <p>Dashboard для врачей и администраторов с возможностью фильтрации и сортировки обращений по статусу, врачу и типу приёма.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-mobile-alt"></i>
              </div>
              <h3>Адаптивный интерфейс</h3>
              <p>Платформа работает в веб-формате и полностью адаптирована для использования на мобильных устройствах.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="dashboard-preview">
        <div className="container">
          <div className="section-title">
            <h2>Панель управления для координаторов</h2>
            <p>Лаконичный интерфейс без перегрузки визуальными элементами</p>
          </div>
          <div className="dashboard-container">
            <div className="dashboard-header">
              <h3>Текущие обращения пациентов</h3>
              <div>
                <button className="btn btn-outline">Фильтры</button>
                <button className="btn btn-primary">Экспорт</button>
              </div>
            </div>
            
            <div className="stats-cards">
              <div className="stat-card">
                <h3>Всего обращений</h3>
                <div className="value">142</div>
              </div>
              <div className="stat-card">
                <h3>Высокий приоритет</h3>
                <div className="value">23</div>
              </div>
              <div className="stat-card">
                <h3>Ожидают назначения</h3>
                <div className="value">18</div>
              </div>
              <div className="stat-card">
                <h3>За сегодня</h3>
                <div className="value">9</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;