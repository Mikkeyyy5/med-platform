import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigation } from '../hooks/useNavigation';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { goTo } = useNavigation();

  const handleLogout = () => {
    logout();
    goTo('/');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo" onClick={() => goTo('/')}>
            <i className="fas fa-stethoscope logo-icon"></i>
            <h1>МедПлатформа</h1>
          </div>
          <nav>
            <ul>
              <li><a href="/" onClick={(e) => { e.preventDefault(); goTo('/'); }}>Главная</a></li>
              <li><a href="/appeal" onClick={(e) => { e.preventDefault(); goTo('/appeal'); }}>Обращения</a></li>
              <li><a href="/doctors" onClick={(e) => { e.preventDefault(); goTo('/doctors'); }}>Врачи</a></li>
              {isAuthenticated && (
                <li><a href="/profile" onClick={(e) => { e.preventDefault(); goTo('/profile'); }}>Профиль</a></li>
              )}
            </ul>
          </nav>
          <div className="user-actions">
            {!isAuthenticated ? (
              <>
                <button className="btn btn-outline" onClick={() => goTo('/login')}>Войти</button>
                <button className="btn btn-primary" onClick={() => goTo('/login')}>Регистрация</button>
              </>
            ) : (
              <div className="user-profile">
                <div className="profile-info">
                  <i className="fas fa-user-circle profile-icon"></i>
                  <span>{user?.firstName} {user?.lastName}</span>
                </div>
                <div className="profile-menu">
                  <button className="logout-btn" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i> Выйти
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;