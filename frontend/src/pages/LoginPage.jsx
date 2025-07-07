import { useNavigate, Link } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import React from 'react';
import '../App.css'; // if you're using global styles

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = async (form, setError) => {
    try {
      const res = await fetch('https://kanbee-task-assigner-mern.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Login failed');
        return false;
      }

      localStorage.setItem('token', data.token);
      navigate('/board');
      return true;
    } catch (err) {
      setError('Server error');
      return false;
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h1 className="auth-title">🧠 Kanbee</h1>
        <p className="auth-subtitle">Login to manage your workflow</p>

        <AuthForm type="login" onSubmit={handleLogin} />

        <p className="auth-switch">
          Not a user?{' '}
          <Link to="/register" className="auth-link">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
