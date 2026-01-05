import React, { useState } from 'react';
import RafLogo from '../assets/RafLogoBlanco.png';
import axios from 'axios';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const btn = document.querySelector('.signin-btn');
        btn.textContent = 'Cleared for takeoff...';
        btn.disabled = true;
        setError('');

        try {
            const response = await axios.post('http://localhost:3000/api/login', {
                username,
                password,
            });

            const { token } = response.data;
            localStorage.setItem('token', token); // Guardar el token
            localStorage.setItem('username', username); // Guardar el username
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Configurar token para futuras peticiones

            if (onLogin) {
                onLogin(username);
            }
        } catch (err) {
            btn.textContent = 'Get Started';
            btn.disabled = false;
            if (err.response) {
                setError(err.response.data.message || 'Error en el inicio de sesión');
            } else {
                setError('No se pudo conectar al servidor');
            }
        }
    };

    const togglePassword = () => {
        setShowPassword(s => !s);
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
                }

                .blur3 {
                    background: #a5f3fc;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
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
                    background: linear-gradient(to bottom, #0f172a 50%, #374151 50%);
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
                    color: #ffffff;
                    font-size: 24px;
                    font-weight: 600;
                    text-align: center;
                    margin-bottom: 12px;
                }

                .subtitle {
                    color: #e0e7ff;
                    font-size: 15px;
                    text-align: center;
                    margin-bottom: 30px;
                    line-height: 1.6;
                }
                
                .subtitle-2{
                    color: #c7d2fe;
                    font-size: 12px;
                    text-align: center;
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
                
                .error-message {
                    color: #ff8c69;
                    text-align: center;
                    margin-top: 15px;
                    font-weight: 500;
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
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
                                </svg>
                                <input 
                                    type="text" 
                                    id="username" 
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
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
                                    type={showPassword ? 'text' : 'password'}
                                     id="password" 
                                     placeholder="Password"
                                     value={password}
                                     onChange={(e) => setPassword(e.target.value)}
                                     required
                                 />
                                <svg
                                    className="toggle-password"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    width="20"
                                    height="20"
                                    onClick={togglePassword}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {showPassword ? (
                                        // eye-off (visible -> show "hide" icon)
                                        <>
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                                            <line x1="1" y1="1" x2="23" y2="23"/>
                                        </>
                                    ) : (
                                        // eye (hidden -> show "view" icon)
                                        <>
                                            <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.27 2.943 9.542 7-1.272 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </>
                                    )}
                                </svg>
                             </div>
                         </div>
                        
                        {error && <p className="error-message">{error}</p>}

                        <button type="submit" className="signin-btn">Get Started</button>
                    </form>

                    <div className="divider">
                        <p className='subtitle-2'>Engineered by Alex Linares & Max Bragado</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
