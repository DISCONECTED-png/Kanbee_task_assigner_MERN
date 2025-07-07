import { useNavigate, Link } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import React from 'react';
import '../App.css'; // Make sure styles are globally applied

const RegisterPage = () => {
  const navigate = useNavigate();

  const handleRegister = async (form, setError) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Registration failed');
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
        <p className="auth-subtitle">Create your account to get started</p>

        <AuthForm type="register" onSubmit={handleRegister} />

        <p className="auth-switch">
          Already a user?{' '}
          <Link to="/" className="auth-link">
            Login now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
