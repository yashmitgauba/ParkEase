import React, { useState } from 'react';
import '../styles/Signup.css';
import { FaParking, FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const validateName = () => name.trim().length >= 2;
  const validateEmail = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = () => password.length >= 8;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!validateName()) newErrors.name = 'Name must be at least 2 characters long';
    if (!validateEmail()) newErrors.email = 'Please enter a valid email address';
    if (!validatePassword()) newErrors.password = 'Password must be at least 8 characters long';

    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard'); // Use navigate for routing
      }, 1000);
    } catch (err) {
      console.error('Signup failed:', err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-image">
        <div className="image-content">
          <h2>Welcome to ParkEase</h2>
          <p>Join our community and experience hassle-free parking at your favorite malls.</p>
        </div>
      </div>

      <div className="auth-form">
        <Link to="/" className="logo">
          <FaParking /> ParkEase
        </Link>

        <div className="form-header">
          <h2>Create your account</h2>
          <p>Start your journey with ParkEase today</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <div className="input-group">
              <FaUser />
              <input
                type="text"
                id="name"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => {
                  if (!validateName()) setErrors(prev => ({ ...prev, name: 'Name must be at least 2 characters long' }));
                  else setErrors(prev => ({ ...prev, name: undefined }));
                }}
                required
              />
            </div>
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-group">
              <FaEnvelope />
              <input
                type="email"
                id="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => {
                  if (!validateEmail()) setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
                  else setErrors(prev => ({ ...prev, email: undefined }));
                }}
                required
              />
            </div>
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-group">
              <FaLock />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => {
                  if (!validatePassword()) setErrors(prev => ({ ...prev, password: 'Password must be at least 8 characters long' }));
                  else setErrors(prev => ({ ...prev, password: undefined }));
                }}
                required
              />
              <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>

          <button type="submit" className="btn btn-primary">
            Create Account
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/Login">Log in</Link>
        </div>
      </div>

      {success && <div className="success-message">Account created successfully!</div>}
    </div>
  );
};

export default Signup;
