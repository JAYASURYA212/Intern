import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Smartphone, LogIn, Lock, Mail } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await login(email, password);
      if (user.role === 'ROLE_SHOP_OWNER' || user.role === 'ROLE_ADMIN') {
        navigate('/owner/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError("Invalid email or password.");
      setSubmitting(false);
    }
  };

  const fillDemo = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="container py-5">
      <div className="mx-auto" style={{ maxWidth: '420px' }}>
        <div className="bg-white p-4 p-md-5 rounded-4 border shadow-sm text-center">
          <div className="bg-primary text-white p-3 rounded-circle d-inline-flex mb-3 shadow">
            <Smartphone size={32} />
          </div>
          <h3 className="font-heading fw-bold text-dark mb-1">Welcome Back</h3>
          <p className="text-secondary small mb-4">Login to access saved wishlist, sell requests & shop portal</p>

          {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}

          <form onSubmit={handleSubmit} className="text-start">
            <div className="mb-3">
              <label className="form-label font-semibold text-sm">Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 ps-3"><Mail size={18} className="text-muted" /></span>
                <input
                  type="email"
                  className="form-control bg-light border-start-0 py-2.5"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label font-semibold text-sm">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 ps-3"><Lock size={18} className="text-muted" /></span>
                <input
                  type="password"
                  className="form-control bg-light border-start-0 py-2.5"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary-custom w-100 py-2.5 font-semibold shadow mb-3" disabled={submitting}>
              {submitting ? "Logging in..." : "Login to Account"}
            </button>
          </form>

          {/* Demo Accounts Quick Login Box */}
          <div className="p-3 bg-light rounded-3 text-start mt-3">
            <div className="small font-semibold text-dark mb-2">⚡ Quick Demo Login:</div>
            <div className="d-flex flex-wrap gap-1">
              <button className="btn btn-xs btn-outline-secondary" onClick={() => fillDemo('customer@example.com')}>Customer</button>
              <button className="btn btn-xs btn-outline-primary" onClick={() => fillDemo('owner@example.com')}>Shop Owner</button>
              <button className="btn btn-xs btn-outline-dark" onClick={() => fillDemo('admin@example.com')}>Admin</button>
            </div>
          </div>

          <div className="text-center mt-4 small text-secondary">
            Don't have an account? <Link to="/register" className="text-primary fw-semibold">Register here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
