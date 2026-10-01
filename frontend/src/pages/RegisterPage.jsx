import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Phone } from 'lucide-react';

const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ROLE_CUSTOMER');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await register(email, password, fullName, phone, role);
      if (user.role === 'ROLE_SHOP_OWNER') {
        navigate('/owner/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="mx-auto" style={{ maxWidth: '450px' }}>
        <div className="bg-white p-4 p-md-5 rounded-4 border shadow-sm">
          <h3 className="font-heading fw-bold text-dark mb-1 text-center">Create an Account</h3>
          <p className="text-secondary small mb-4 text-center">Register to browse, reserve & sell pre-owned phones</p>

          {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label font-semibold text-sm">Full Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label font-semibold text-sm">Email Address *</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label font-semibold text-sm">Phone Number *</label>
              <input
                type="tel"
                className="form-control"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label font-semibold text-sm">Password *</label>
              <input
                type="password"
                className="form-control"
                placeholder="Choose password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label font-semibold text-sm">Register As</label>
              <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="ROLE_CUSTOMER">Customer (Buyer / Seller)</option>
                <option value="ROLE_SHOP_OWNER">Shop Owner (Manager)</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary-custom w-100 py-2.5 font-semibold shadow mb-3" disabled={submitting}>
              {submitting ? "Registering..." : "Create Account"}
            </button>
          </form>

          <div className="text-center mt-3 small text-secondary">
            Already have an account? <Link to="/login" className="text-primary fw-semibold">Login here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
