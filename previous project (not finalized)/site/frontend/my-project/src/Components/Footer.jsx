import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-column">
            <h3>МедПлатформа</h3>
            <ul>
              <li><a href="#">О нас</a></li>
              <li><a href="#">Контакты</a></li>
              <li><a href="#">Вакансии</a></li>
              <li><a href="#">Партнеры</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Пациентам</h3>
            <ul>
              <li><a href="#">Как это работает</a></li>
              <li><a href="#">Частые вопросы</a></li>
              <li><a href="#">Отзывы</a></li>
              <li><a href="#">Безопасность данных</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Врачам</h3>
            <ul>
              <li><a href="/doctors">Присоединиться к платформе</a></li>
              <li><a href="#">Документация</a></li>
              <li><a href="#">Обучение</a></li>
              <li><a href="#">Поддержка</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Контакты</h3>
            <ul>
              <li><i className="fas fa-phone"></i> +7 (800) 123-45-67</li>
              <li><i className="fas fa-envelope"></i> info@medplatform.ru</li>
              <li><i className="fas fa-map-marker-alt"></i> Астрахань, ул. Медицинская, 15</li>
            </ul>
          </div>
        </div>
        <div className="copyright">
          &copy; 2025 МедПлатформа. Все права защищены.
        </div>
      </div>
    </footer>
  );
};

export default Footer;