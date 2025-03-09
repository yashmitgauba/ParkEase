import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaParking, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaFacebookF, FaApple } from 'react-icons/fa';
import "../styles/Login.css";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [successMessage, setSuccessMessage] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        const rememberedEmail = localStorage.getItem('userEmail');
        if (rememberedEmail) {
            setEmail(rememberedEmail);
            setRememberMe(true);
        }
    }, []);

    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError('Please enter a valid email address');
            return false;
        }
        setEmailError('');
        return true;
    };

    const validatePassword = () => {
        if (password.length < 1) {
            setPasswordError('Password is required');
            return false;
        }
        setPasswordError('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();

        if (!isEmailValid || !isPasswordValid) return;

        if (rememberMe) {
            localStorage.setItem('userEmail', email);
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            setSuccessMessage(true);

            const isAdmin = email.includes('admin');

            setTimeout(() => {
                window.location.href = isAdmin ? '/admin-dashboard' : '/dashboard';
            }, 1000);
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-image">
                <div className="image-content">
                    <h2>Welcome Back!</h2>
                    <p>Access your ParkEase account and manage your parking experience.</p>
                </div>
            </div>
            <div className="auth-form">
                <Link to="/" className="logo">
                    <FaParking />
                    ParkEase
                </Link>
                <div className="form-header">
                    <h2>Login</h2>
                    <p>Enter your credentials to access your account</p>
                </div>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <div className="input-group">
                            <FaEnvelope />
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onBlur={validateEmail}
                                className="form-control"
                                required
                            />
                        </div>
                        {emailError && <div className="error-message">{emailError}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-group">
                            <FaLock />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onBlur={validatePassword}
                                className="form-control"
                                required
                            />
                            <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                        {passwordError && <div className="error-message">{passwordError}</div>}
                    </div>
                    <div className="remember-forgot">
                        <label className="remember-me">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            Remember me
                        </label>
                        <Link to="/forgot-password" className="forgot-password">Forgot password?</Link>
                    </div>
                    <button type="submit" className="btn btn-primary">Login</button>
                </form>
                <div className="social-login">
                    <p>Or continue with</p>
                    <div className="social-buttons">
                        <button className="social-btn" onClick={() => alert('Social login coming soon!')}>
                            <FaGoogle />
                        </button>
                        <button className="social-btn" onClick={() => alert('Social login coming soon!')}>
                            <FaFacebookF />
                        </button>
                        <button className="social-btn" onClick={() => alert('Social login coming soon!')}>
                            <FaApple />
                        </button>
                    </div>
                </div>
                <div className="auth-footer">
                    Don't have an account? <Link to="/signup">Sign up</Link>
                </div>
            </div>
            {successMessage && <div className="success-message">Login successful!</div>}
        </div>
    );
}
