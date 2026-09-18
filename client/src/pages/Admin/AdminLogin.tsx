import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import logo from "../../assets/acm-logo.png";
import { adminLogin } from "../../services/admin/authService";
import { clearAuthToken, getAuthToken } from "../../utils/authToken";

const SESSION_TIMEOUT = 30 * 60 * 1000;
const WARNING_TIME = 5 * 60 * 1000;

const sanitizeInput = (input: string): string => {
    return input
        .replace(/[<>]/g, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .trim();
};

const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePasswordStrength = (password: string): string[] => {
    const errors: string[] = [];

    if (password.length < 8) errors.push("At least 8 characters");
    if (!/[A-Z]/.test(password)) errors.push("One uppercase letter");
    if (!/[a-z]/.test(password)) errors.push("One lowercase letter");
    if (!/\d/.test(password)) errors.push("One number");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push("One special character");

    return errors;
};

const AdminLogin = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ variant: "success" | "error"; text: string } | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [inactivityTimer, setInactivityTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
    const [warningTimer, setWarningTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
    const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(SESSION_TIMEOUT);

    const [errors, setErrors] = useState({ username: "", password: "" });
    const [touched, setTouched] = useState({ username: false, password: false });

    const resetInactivityTimer = () => {
        if (inactivityTimer) clearTimeout(inactivityTimer);
        if (warningTimer) clearTimeout(warningTimer);
        setShowTimeoutWarning(false);
        setTimeLeft(SESSION_TIMEOUT);

        const warningTimeout = setTimeout(() => {
            setShowTimeoutWarning(true);
            let remaining = WARNING_TIME;
            const countdown = setInterval(() => {
                remaining -= 1000;
                setTimeLeft(remaining);
                if (remaining <= 0) {
                    clearInterval(countdown);
                }
            }, 1000);
        }, SESSION_TIMEOUT - WARNING_TIME);

        const logoutTimeout = setTimeout(() => {
            handleAutoLogout();
        }, SESSION_TIMEOUT);

        setWarningTimer(warningTimeout);
        setInactivityTimer(logoutTimeout);
    };

    const handleAutoLogout = () => {
        clearAuthToken();
        setMessage({
            variant: "error",
            text: "Session expired due to inactivity. Please login again."
        });
        navigate("/admin/login");
    };

    const extendSession = () => {
        setShowTimeoutWarning(false);
        resetInactivityTimer();
    };

    useEffect(() => {
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];

        const handleActivity = () => {
            if (getAuthToken()) {
                resetInactivityTimer();
            }
        };

        events.forEach(event => {
            document.addEventListener(event, handleActivity);
        });

        return () => {
            events.forEach(event => {
                document.removeEventListener(event, handleActivity);
            });
            if (inactivityTimer) clearTimeout(inactivityTimer);
            if (warningTimer) clearTimeout(warningTimer);
        };
    }, []);

    const validateField = (name: string, value: string) => {
        let error = "";
        const sanitizedValue = sanitizeInput(value);

        switch (name) {
            case "username":
                if (!sanitizedValue.trim()) {
                    error = "Username is required";
                } else if (sanitizedValue.length < 3) {
                    error = "Min 3 characters";
                } else if (!/^[a-zA-Z0-9_.-]+$/.test(sanitizedValue)) {
                    if (sanitizedValue.includes('@')) {
                        if (!validateEmail(sanitizedValue)) {
                            error = "Invalid email format";
                        }
                    } else {
                        error = "Only letters, numbers, dots, hyphens, underscores allowed";
                    }
                }
                break;
            case "password":
                if (!value) {
                    error = "Password is required";
                } else {
                    const strengthErrors = validatePasswordStrength(value);
                    if (strengthErrors.length > 0) {
                        error = `Password must contain: ${strengthErrors.join(', ')}`;
                    }
                }
                break;
            default: break;
        }
        return error;
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const sanitizedValue = sanitizeInput(value);
        setTouched(prev => ({ ...prev, [name]: true }));
        setErrors(prev => ({ ...prev, [name]: validateField(name, sanitizedValue) }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const sanitizedValue = sanitizeInput(value);

        if (name === "username") setUsername(sanitizedValue);
        if (name === "password") setPassword(value);

        if (errors[name as keyof typeof errors] && touched[name as keyof typeof touched]) {
            setErrors(prev => ({ ...prev, [name]: validateField(name, sanitizedValue) }));
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setErrors({ username: "", password: "" });

        const sanitizedUsername = sanitizeInput(username);
        const sanitizedPassword = password;

        const newErrors = {
            username: validateField("username", sanitizedUsername),
            password: validateField("password", sanitizedPassword)
        };
        setErrors(newErrors);
        setTouched({ username: true, password: true });

        if (newErrors.username || newErrors.password) {
            setMessage({ variant: "error", text: "Please fix the errors below." });
            return;
        }

        try {
            setLoading(true);
            const res = await adminLogin({
                username: sanitizedUsername,
                password: sanitizedPassword
            });

            if (res.success && res.token) {

                setMessage({
                    variant: "success",
                    text: res.message || "Login successful!"
                });

                resetInactivityTimer();

                setTimeout(() => {
                    navigate("/admin/dashboard");
                }, 1000);

            } else {
                setMessage({
                    variant: "error",
                    text: res.message || "Login failed. Please try again."
                });

                if (res.field && res.message) {
                    setErrors(prev => ({
                        ...prev,
                        [res.field!]: res.message
                    }));
                    setTouched(prev => ({
                        ...prev,
                        [res.field!]: true
                    }));
                }
            }
        } catch (err: any) {
            console.error("Login error:", err);

            if (err.message && err.message.includes("Network Error")) {
                setMessage({
                    variant: "error",
                    text: "Network error. Please check your internet connection and try again."
                });
            } else {
                setMessage({
                    variant: "error",
                    text: "An unexpected error occurred. Please try again."
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="login-wrapper">
            <style>{`
                .login-wrapper {
                    min-height: 100vh;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: radial-gradient(circle at 10% 20%, rgb(15, 23, 42) 0%, rgb(30, 27, 75) 90%);
                    position: relative;
                    overflow: hidden;
                    padding: 20px;
                }

                /* Timeout warning modal */
                .timeout-warning {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(10px);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: fadeIn 0.3s ease-out;
                }
                
                .timeout-content {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                    padding: 2rem;
                    max-width: 400px;
                    width: 90%;
                    text-align: center;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                }
                
                .timeout-timer {
                    font-size: 2.5rem;
                    font-weight: bold;
                    color: #ef4444;
                    margin: 1rem 0;
                    font-family: monospace;
                }
                
                .timeout-buttons {
                    display: flex;
                    gap: 1rem;
                    margin-top: 1.5rem;
                }
                
                .timeout-buttons button {
                    flex: 1;
                    padding: 0.75rem;
                    border-radius: 10px;
                    font-weight: 600;
                    border: none;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .extend-btn {
                    background: linear-gradient(90deg, #2563eb 0%, #7c3aed 100%);
                    color: white;
                }
                
                .logout-btn {
                    background: rgba(239, 68, 68, 0.2);
                    color: #ef4444;
                    border: 1px solid rgba(239, 68, 68, 0.3) !important;
                }

                /* Background shapes */
                .login-wrapper::before, .login-wrapper::after {
                    content: '';
                    position: absolute;
                    width: 300px;
                    height: 300px;
                    border-radius: 50%;
                    filter: blur(100px);
                    opacity: 0.2;
                    z-index: 0;
                }
                .login-wrapper::before {
                    top: -50px;
                    left: -50px;
                    background: #3b82f6;
                }
                .login-wrapper::after {
                    bottom: -50px;
                    right: -50px;
                    background: #8b5cf6;
                }
                
                .glass-card {
                    position: relative;
                    z-index: 10;
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
                    border-radius: 24px;
                    padding: 3rem;
                    width: 100%;
                    max-width: 420px;
                    animation: fadeIn 0.8s ease-out;
                }

                .logo-container {
                    width: 80px; 
                    height: 80px;
                    transition: all 0.3s ease;
                }

                .custom-input-group {
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    padding: 0 15px;
                    transition: all 0.3s ease;
                    height: 50px;
                }

                .custom-input-group:focus-within {
                    border-color: #60a5fa;
                    background: rgba(0, 0, 0, 0.4);
                }

                .custom-input-group.error {
                    border-color: #ef4444;
                }

                .form-control-custom {
                    background: transparent;
                    border: none;
                    color: #fff;
                    padding: 10px;
                    width: 100%;
                    outline: none;
                    font-size: 1rem;
                }
                
                .form-control-custom::placeholder {
                    color: rgba(255, 255, 255, 0.4);
                }

                /* Autofill fix */
                input:-webkit-autofill,
                input:-webkit-autofill:hover, 
                input:-webkit-autofill:focus, 
                input:-webkit-autofill:active{
                    -webkit-box-shadow: 0 0 0 30px #131522 inset !important;
                    -webkit-text-fill-color: white !important;
                    transition: background-color 5000s ease-in-out 0s;
                }

                .login-btn {
                    background: linear-gradient(90deg, #2563eb 0%, #7c3aed 100%);
                    border: none;
                    border-radius: 12px;
                    padding: 12px;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                    width: 100%;
                    margin-top: 10px;
                    height: 48px;
                }

                .password-strength {
                    margin-top: 10px;
                    font-size: 0.8rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 14px;
                    flex-wrap: wrap;
                }
                
                .strength-requirement {
                    color: rgba(255, 255, 255, 0.6);
                    display: inline-flex;
                    align-items: center;
                    white-space: nowrap;
                }

                .strength-requirement.valid {
                    color: #10b981;
                }
                                
                .strength-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.3);
                    margin-right: 6px;
                }
                                
                .strength-requirement.valid .strength-dot {
                    background: #10b981;
                }

                /* Mobile styles */
                @media (max-width: 576px) {
                    .glass-card {
                        padding: 2rem 1.5rem;
                        border-radius: 20px;
                    }

                    .logo-container {
                        width: 60px;
                        height: 60px;
                        padding: 0.35rem !important;
                    }

                    h4 {
                        font-size: 1.25rem;
                    }

                    .small-text {
                        font-size: 0.8rem;
                    }

                    .custom-input-group {
                        height: 45px;
                    }
                    
                    .form-control-custom {
                        font-size: 0.95rem;
                    }
                    
                    .timeout-content {
                        padding: 1.5rem;
                    }
                    
                    .timeout-timer {
                        font-size: 2rem;
                    }
                    
                    .timeout-buttons {
                        flex-direction: column;
                    }
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .text-danger {
                    color: #ef4444 !important;
                    font-size: 0.85rem;
                    display: flex;
                    align-items: center;
                }

                .custom-input-group.error {
                    border-color: #ef4444 !important;
                    background: rgba(239, 68, 68, 0.05) !important;
                    animation: shake 0.3s ease-in-out;
                }

                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }

                /* Message component styling */
                .message-error {
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    color: #ef4444;
                }

                .message-success {
                    background: rgba(16, 185, 129, 0.1);
                    border: 1px solid rgba(16, 185, 129, 0.3);
                    color: #10b981;
                }

                .login-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
            `}</style>

            {showTimeoutWarning && (
                <div className="timeout-warning">
                    <div className="timeout-content">
                        <h4 className="text-white mb-2">Session About to Expire</h4>
                        <p className="text-white-50">
                            Your session will expire due to inactivity in:
                        </p>
                        <div className="timeout-timer">
                            {formatTime(timeLeft)}
                        </div>
                        <p className="text-white-50 small mb-3">
                            Click "Extend Session" to continue working
                        </p>
                        <div className="timeout-buttons">
                            <button className="extend-btn" onClick={extendSession}>
                                Extend Session
                            </button>
                            <button className="logout-btn" onClick={handleAutoLogout}>
                                Log Out Now
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Loader loading={loading} />

            <div className="glass-card">
                <div className="text-center mb-4">
                    <div className="logo-container d-inline-flex align-items-center justify-content-center bg-white rounded-circle p-2 mb-3 shadow-lg">
                        <img src={logo} alt="Logo" style={{ width: "100%", objectFit: 'contain' }} />
                    </div>
                    <h4 className="fw-bold text-white mb-1">Admin Portal</h4>
                    <p className="small small-text text-white-50">SIST ACM SIGAI Student Chapter</p>
                </div>

                {message && (
                    <div className="mb-4">
                        <Message
                            variant={message.variant}
                            onClose={() => setMessage(null)}
                        >
                            {message.text}
                        </Message>
                    </div>
                )}

                <form onSubmit={handleLogin} noValidate>
                    <div className="mb-3">
                        <label className="form-label text-white-50 small mb-1">
                            Username
                        </label>
                        <div className={`custom-input-group ${touched.username && errors.username ? 'error' : ''}`}>
                            <i className="bi bi-person text-white-50 fs-5"></i>
                            <input
                                type="text"
                                name="username"
                                className="form-control-custom"
                                placeholder="Enter username"
                                value={username}
                                autoComplete="off"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={loading}
                            />
                        </div>
                        {touched.username && errors.username && (
                            <small className="text-danger mt-1 d-block ms-2 animate__animated animate__fadeIn">
                                <i className="bi bi-exclamation-circle me-1"></i>
                                {errors.username}
                            </small>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="form-label text-white-50 small mb-1">
                            Password
                        </label>
                        <div className={`custom-input-group ${touched.password && errors.password ? 'error' : ''}`}>
                            <i className="bi bi-lock text-white-50 fs-5"></i>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                className="form-control-custom"
                                placeholder="Enter password"
                                value={password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={loading}
                                autoComplete="off"
                            />
                            <i
                                className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} text-white-50 p-2`}
                                style={{ cursor: 'pointer' }}
                                onClick={() => setShowPassword(prev => !prev)}
                                title={showPassword ? "Hide password" : "Show password"}
                            ></i>
                        </div>
                        {touched.password && errors.password && (
                            <small className="text-danger mt-1 d-block ms-2 animate__animated animate__fadeIn">
                                {errors.password}
                            </small>
                        )}

                        {password && (
                            <div className="password-strength">
                                <div className={`strength-requirement ${password.length >= 8 ? 'valid' : ''}`}>
                                    <span className="strength-dot"></span>
                                    8+ characters
                                </div>

                                <div className={`strength-requirement ${/[A-Z]/.test(password) ? 'valid' : ''}`}>
                                    <span className="strength-dot"></span>
                                    Uppercase
                                </div>

                                <div className={`strength-requirement ${/[a-z]/.test(password) ? 'valid' : ''}`}>
                                    <span className="strength-dot"></span>
                                    Lowercase
                                </div>

                                <div className={`strength-requirement ${/\d/.test(password) ? 'valid' : ''}`}>
                                    <span className="strength-dot"></span>
                                    Number
                                </div>

                                <div
                                    className={`strength-requirement ${/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'valid' : ''
                                        }`}
                                >
                                    <span className="strength-dot"></span>
                                    Special
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn text-white login-btn shadow-lg"
                        disabled={loading || !username || !password}
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;