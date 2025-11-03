
import React, { useState } from 'react';
import RafLogo from '../assets/RafLogo.png';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const btn = document.querySelector('.signin-btn');
        btn.textContent = 'Cleared for takeoff...';
        btn.disabled = true;

        setTimeout(() => {
            // Here you would typically handle authentication
            // For now, we'll just call the onLogin callback
            onLogin();
        }, 1500);
    };

    const togglePassword = () => {
        const passwordInput = document.getElementById('password');
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
        } else {
            passwordInput.type = 'password';
        }
    };

    return (
        <div style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
            height: "100vh",
            overflow: "hidden",
            background: "linear-gradient(to bottom, #0f172a, #1e3a8a",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px"
        }}>
            <style>{`
                .background-blur {
                    position: fixed;
                    width: 400px;
                    height: 400px;
                    border-radius: 50%;
                    filter: blur(100px);
                    opacity: 0.6;
                    animation: float 15s ease-in-out infinite;
                }

                .blur1 {
                    background: #7dd3fc;
                    top: -100px;
                    left: -100px;
                }

                .blur2 {
                    background: #93c5fd;
                    bottom: -100px;
                    right: -100px;
                    animation-delay: 3s;
                }

                .blur3 {
                    background: #a5f3fc;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    animation-delay: 6s;
                }

                @keyframes float {
                    0%, 100% { transform: translate(0, 0); }
                    33% { transform: translate(30px, -30px); }
                    66% { transform: translate(-30px, 30px); }
                }

                .container {
                    width: 100%;
                    max-width: 380px;
                    animation: slideUp 0.8s ease-out;
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(40px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .logo-container {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 30px;
                }

                .logo {
                    width: 90px;
                    height: 90px;
                    border-radius: 50%;
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(to bottom, #3b82f6 50%, #374151 50%);
                    border: 4px solid #9ca3af;
                    box-shadow: 
                        0 0 10px rgba(0,0,0,0.3),
                        inset 0 0 5px rgba(0,0,0,0.5);
                    transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1);
                }

                .logo:hover {
                    transform: rotate(15deg);
                }

                .logo::before {
                    content: '';
                    position: absolute;
                    left: -10%;
                    right: -10%;
                    top: 50%;
                    height: 3px;
                    background: white;
                    transform: translateY(-1.5px);
                    z-index: 2;
                }

                .logo::after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 8px;
                    height: 8px;
                    background: white;
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 2;
                }
                
                .logo img {
                    width: 40px;
                    height: 40px;
                    z-index: 1;
                    transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1);
                }

                .logo:hover img {
                    transform: rotate(-15deg);
                }

                .login-card {
                    background: rgba(255, 255, 255, 0.25);
                    backdrop-filter: blur(30px);
                    border-radius: 32px;
                    padding: 30px;
                    box-shadow: 
                        0 8px 32px rgba(0, 0, 0, 0.1),
                        inset 0 1px 0 rgba(255, 255, 255, 0.5);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                }

                h1 {
                    color: #0f172a;
                    font-size: 24px;
                    font-weight: 600;
                    text-align: center;
                    margin-bottom: 12px;
                }

                .subtitle {
                    color: black;
                    font-size: 15px;
                    text-align: center;
                    margin-bottom: 30px;
                    line-height: 1.6;
                }

                .form-group {
                    margin-bottom: 20px;
                }

                .input-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                    background: rgba(255, 255, 255, 0.5);
                    backdrop-filter: blur(10px);
                    border-radius: 16px;
                    padding: 0 20px;
                    border: 1px solid rgba(255, 255, 255, 0.4);
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
                }

                .input-wrapper:focus-within {
                    background: rgba(255, 255, 255, 0.7);
                    border-color: rgba(59, 130, 246, 0.5);
                    box-shadow: 0 8px 24px rgba(59, 130, 246, 0.15);
                }

                .input-icon {
                    width: 24px;
                    height: 24px;
                    margin-right: 12px;
                    color: #64748b;
                    flex-shrink: 0;
                }

                input {
                    width: 100%;
                    padding: 16px 0;
                    border: none;
                    background: transparent;
                    font-size: 15px;
                    color: #0f172a;
                    outline: none;
                }

                input::placeholder {
                    color: #94a3b8;
                }

                .password-wrapper {
                    position: relative;
                }

                .toggle-password {
                    position: absolute;
                    right: 20px;
                    top: 50%;
                    transform: translateY(-50%);
                    cursor: pointer;
                    color: #64748b;
                    transition: color 0.3s ease;
                }

                .toggle-password:hover {
                    color: #334155;
                }

                .forgot-password {
                    text-align: right;
                    margin-top: 12px;
                }

                .forgot-password a {
                    color: #0f172a;
                    text-decoration: none;
                    font-size: 14px;
                    font-weight: 500;
                    transition: opacity 0.3s ease;
                }

                .forgot-password a:hover {
                    opacity: 0.7;
                }

                .signin-btn {
                    width: 100%;
                    padding: 16px;
                    background: #0f172a;
                    color: white;
                    border: none;
                    border-radius: 16px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin-top: 30px;
                    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.3);
                }

                .signin-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 32px rgba(15, 23, 42, 0.4);
                }

                .signin-btn:active {
                    transform: translateY(0);
                }

                .divider {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    margin: 30px 0;
                }

                .divider::before,
                .divider::after {
                    content: '';
                    flex: 1;
                    height: 1px;
                    background: linear-gradient(to right, transparent, rgba(148, 163, 184, 0.3), transparent);
                }

                .divider span {
                    color: #64748b;
                    font-size: 13px;
                    white-space: nowrap;
                }

                .social-login {
                    display: flex;
                    gap: 12px;
                    justify-content: center;
                }

                .social-btn {
                    width: 64px;
                    height: 64px;
                    background: rgba(255, 255, 255, 0.5);
                    backdrop-filter: blur(10px);
                    border-radius: 16px;
                    border: 1px solid rgba(255, 255, 255, 0.4);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
                }

                .social-btn:hover {
                    background: rgba(255, 255, 255, 0.7);
                    transform: translateY(-4px);
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
                }

                .social-btn svg {
                    width: 28px;
                    height: 28px;
                }

                @media (max-width: 480px) {
                    .login-card {
                        padding: 40px 30px;
                    }

                    h1 {
                        font-size: 28px;
                    }

                    .logo {
                        width: 80px;
                        height: 80px;
                    }

                    .social-btn {
                        width: 58px;
                        height: 58px;
                    }
                }
            `}</style>
            <div className="background-blur blur1"></div>
            <div className="background-blur blur2"></div>
            <div className="background-blur blur3"></div>

            <div className="container">
                <div className="logo-container">
                    <div className="logo">
                        <img src={RafLogo} alt="RAF International Logo" />
                    </div>
                </div>

                <div className="login-card">
                    <h1>Sign in with your credentials</h1>
                    <p className="subtitle">Please fasten your seatbelt</p>

                    <form id="loginForm" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <div className="input-wrapper">
                                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                    <polyline points="22,6 12,13 2,6"/>
                                </svg>
                                <input 
                                    type="email" 
                                    id="email" 
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group password-wrapper">
                            <div className="input-wrapper">
                                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                </svg>
                                <input 
                                    type="password" 
                                    id="password" 
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <svg className="toggle-password" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20" onClick={togglePassword}>
                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                                    <line x1="1" y1="1" x2="23" y2="23"/>
                                </svg>
                            </div>
                            <div className="forgot-password">
                                <a href="#">Forgot password?</a>
                            </div>
                        </div>

                        <button type="submit" className="signin-btn">Get Started</button>
                    </form>

                    <div className="divider">
                        <span>Engineered by Lex Groove & Max Bragado</span>
                    </div>

                    <div className="social-login">
                        <div className="social-btn" onClick={() => alert('Apple sign-in would be implemented here')}>
                            <svg viewBox="0 0 24 24" fill="#000000">
                                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
