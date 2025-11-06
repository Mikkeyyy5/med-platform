import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigation } from '../hooks/useNavigation';
import LoadingSpinner from '../Components/LoadingSpinner'
import '../Components/css/styles reg.css'

const Login = () => {
  const { login, register } = useAuth();
  const { goTo } = useNavigation();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    address: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const result = await login({
          email: formData.email,
          password: formData.password
        });
        
        if (result.success) {
          goTo('/');
        } else {
          alert(result.error);
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          alert('Пароли не совпадают');
          return;
        }

        const result = await register({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          address: formData.address,
          password: formData.password
        });

        if (result.success) {
          goTo('/');
        } else {
          alert(result.error);
        }
      }
    } catch (error) {
      alert('Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text={isLogin ? "Вход..." : "Регистрация..."} />;
  }

  return (
    <div className="login-page">
      <div className="auth-container">
        <div className="auth-tabs">
          <button 
            className={`auth-tab ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Вход
          </button>
          <button 
            className={`auth-tab ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Регистрация
          </button>
        </div>
        
        {/* Login Form */}
        {isLogin ? (
          <div className="auth-form">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="login-email">Email</label>
                <input
                  type="email"
                  id="login-email"
                  name="email"
                  className="form-control"
                  placeholder="Введите ваш email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="login-password">Пароль</label>
                <input
                  type="password"
                  id="login-password"
                  name="password"
                  className="form-control"
                  placeholder="Введите ваш пароль"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit" className="submit-btn">
                Войти
              </button>
              <div className="form-footer">
                <a href="#">Забыли пароль?</a>
              </div>
            </form>
          </div>
        ) : (
          /* Register Form */
          <div className="auth-form">
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="register-firstname">Имя</label>
                  <input
                    type="text"
                    id="register-firstname"
                    name="firstName"
                    className="form-control"
                    placeholder="Введите ваше имя"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="register-lastname">Фамилия</label>
                  <input
                    type="text"
                    id="register-lastname"
                    name="lastName"
                    className="form-control"
                    placeholder="Введите вашу фамилию"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="register-phone">Телефон</label>
                <input
                  type="tel"
                  id="register-phone"
                  name="phone"
                  className="form-control"
                  placeholder="+7 (XXX) XXX-XX-XX"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="register-email">Email</label>
                <input
                  type="email"
                  id="register-email"
                  name="email"
                  className="form-control"
                  placeholder="Введите ваш email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="register-city">Город</label>
                  <input
                    type="text"
                    id="register-city"
                    name="city"
                    className="form-control"
                    placeholder="Введите ваш город"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="register-address">Адрес проживания</label>
                  <input
                    type="text"
                    id="register-address"
                    name="address"
                    className="form-control"
                    placeholder="Введите ваш адрес"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="register-password">Пароль</label>
                <input
                  type="password"
                  id="register-password"
                  name="password"
                  className="form-control"
                  placeholder="Придумайте пароль"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="register-confirm-password">Подтверждение пароля</label>
                <input
                  type="password"
                  id="register-confirm-password"
                  name="confirmPassword"
                  className="form-control"
                  placeholder="Повторите пароль"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit" className="submit-btn">
                Зарегистрироваться
              </button>
              <div className="form-footer">
                Нажимая кнопку "Зарегистрироваться", вы соглашаетесь с <a href="#">условиями использования</a>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;