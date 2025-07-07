import React, { useState } from 'react';

const AuthForm = ({ type = 'login', onSubmit }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password || (type === 'register' && !form.name)) {
      setError('All fields are required');
      return;
    }

    if (type === 'register' && form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');
    const success = await onSubmit(form, setError);
    setLoading(false);

    if (!success) {
      setForm({ ...form, password: '' }); // clear password on error
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>{type === 'login' ? 'Login' : 'Register'}</h2>

      {type === 'register' && (
        <input
          className="auth-input"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />
      )}

      <input
        className="auth-input"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />

      <input
        className="auth-input"
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
      />

      {error && <p className="auth-error">{error}</p>}

      <button className="auth-btn" type="submit" disabled={loading}>
        {loading ? 'Please wait...' : type === 'login' ? 'Login' : 'Register'}
      </button>
    </form>
  );
};

export default AuthForm;
