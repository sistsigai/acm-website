import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import logo from "../../assets/acm-logo.png";
import { useAuth } from "../../context/AuthContext";

const sanitizeInput = (input: string): string => {
    return input
        .replace(/[<>]/g, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .trim();
};

const AdminLogin = () => {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ variant: "success" | "error"; text: string } | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const [errors, setErrors] = useState({ username: "", password: "" });
    const [touched, setTouched] = useState({ username: false, password: false });

    // Clean all input state and error messages when entering or reloading the login page
    useEffect(() => {
        setUsername("");
        setPassword("");
        setErrors({ username: "", password: "" });
        setTouched({ username: false, password: false });
        setMessage(null);

        if (isAuthenticated) {
            navigate("/admin/dashboard", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleClearForm = () => {
        setUsername("");
        setPassword("");
        setErrors({ username: "", password: "" });
        setTouched({ username: false, password: false });
        setMessage(null);
    };

    const validateField = (name: string, value: string) => {
        let error = "";
        const sanitizedValue = sanitizeInput(value);

        switch (name) {
            case "username":
                if (!sanitizedValue.trim()) {
                    error = "Username is required";
                } else if (sanitizedValue.length < 3) {
                    error = "Min 3 characters";
                }
                break;
            case "password":
                if (!value) {
                    error = "Password is required";
                } else if (value.length < 6) {
                    error = "Password must be at least 6 characters";
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
            const res = await login({
                username: sanitizedUsername,
                password: sanitizedPassword
            });

            if (res.success) {
                setMessage({
                    variant: "success",
                    text: res.message || "Login successful!"
                });

                // Clear sensitive password from state immediately
                setPassword("");

                setTimeout(() => {
                    handleClearForm();
                    navigate("/admin/dashboard");
                }, 800);

            } else {
                // Clear password on login failure for security and clear state
                setPassword("");
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
            setPassword("");

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

    return (
        <div className="login-wrapper">
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