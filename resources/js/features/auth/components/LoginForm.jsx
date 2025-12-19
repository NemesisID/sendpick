import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [dataForm, setDataForm] = useState({
        email: '',
        password: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Handle login logic here
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Welcome Back Section */}
            <div className="login-welcome-back">
                <h2 className="login-form-title">Welcome Back!</h2>
                <p className="login-form-subtitle">
                    Don't have an account?{' '}
                    <a href="/auth/register" className="login-link">
                        Create a new account now
                    </a>
                    , it's FREE! Takes less than a minute.
                </p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
                {/* Email Field */}
                <div className="login-field">
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={dataForm.email}
                        onChange={(e) =>
                            setDataForm({ ...dataForm, email: e.target.value })
                        }
                        className="login-input"
                        placeholder="your@email.com"
                    />
                </div>

                {/* Password Field */}
                <div className="login-field">
                    <label htmlFor="password" className="login-label">
                        Password
                    </label>
                    <div className="login-password-wrapper">
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            required
                            value={dataForm.password}
                            onChange={(e) =>
                                setDataForm({ ...dataForm, password: e.target.value })
                            }
                            className="login-input"
                            placeholder="Enter your password"
                        />
                        <button
                            type="button"
                            aria-label={
                                showPassword ? 'Hide password' : 'Show password'
                            }
                            className="login-password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <EyeOff className="login-eye-icon" />
                            ) : (
                                <Eye className="login-eye-icon" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Login Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="login-submit-button"
                >
                    {isLoading ? (
                        <span className="login-loading">
                            <svg className="login-spinner" viewBox="0 0 24 24">
                                <circle
                                    className="login-spinner-circle"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    fill="none"
                                />
                            </svg>
                            Processing...
                        </span>
                    ) : (
                        'Login Now'
                    )}
                </button>

                {/* Google Login Button */}
                <button
                    type="button"
                    disabled={isLoading}
                    className="login-google-button"
                >
                    <svg className="login-google-icon" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    Login with Google
                </button>

                {/* Forgot Password Link */}
                <div className="login-forgot-password">
                    <span className="login-forgot-text">Forget password</span>
                    <a href="/auth/forgot-password" className="login-forgot-link">
                        Click here
                    </a>
                </div>
            </form>

            {/* Styles */}
            <style>{`
                .login-welcome-back {
                    margin-bottom: 32px;
                }
                
                .login-form-title {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #1a1a1a;
                    margin-bottom: 8px;
                    font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
                }
                
                .login-form-subtitle {
                    font-size: 0.875rem;
                    color: #666666;
                    line-height: 1.5;
                    font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
                }
                
                .login-link {
                    color: #1a1a1a;
                    text-decoration: underline;
                    font-weight: 500;
                    transition: color 0.2s ease;
                }
                
                .login-link:hover {
                    color: #3b5de7;
                }
                
                .login-form {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                
                .login-field {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                
                .login-label {
                    font-size: 0.875rem;
                    color: #666666;
                    font-weight: 400;
                    font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
                }
                
                .login-input {
                    width: 100%;
                    padding: 14px 16px;
                    border: 1px solid #e0e0e0;
                    border-radius: 4px;
                    font-size: 0.95rem;
                    color: #1a1a1a;
                    background: #fff;
                    transition: all 0.2s ease;
                    font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
                }
                
                .login-input::placeholder {
                    color: #999999;
                }
                
                .login-input:focus {
                    outline: none;
                    border-color: #3b5de7;
                    box-shadow: 0 0 0 3px rgba(59, 93, 231, 0.1);
                }
                
                .login-password-wrapper {
                    position: relative;
                }
                
                .login-password-wrapper .login-input {
                    padding-right: 48px;
                }
                
                .login-password-toggle {
                    position: absolute;
                    right: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: transparent;
                    border: none;
                    padding: 4px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .login-eye-icon {
                    width: 20px;
                    height: 20px;
                    color: #999999;
                    transition: color 0.2s ease;
                }
                
                .login-password-toggle:hover .login-eye-icon {
                    color: #666666;
                }
                
                .login-submit-button {
                    width: 100%;
                    padding: 14px 24px;
                    background: #1a1a1a;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 0.95rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
                    margin-top: 8px;
                }
                
                .login-submit-button:hover:not(:disabled) {
                    background: #333333;
                    transform: translateY(-1px);
                }
                
                .login-submit-button:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
                
                .login-loading {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }
                
                .login-spinner {
                    width: 20px;
                    height: 20px;
                    animation: spin 1s linear infinite;
                }
                
                .login-spinner-circle {
                    stroke-dasharray: 60;
                    stroke-dashoffset: 45;
                }
                
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                
                .login-google-button {
                    width: 100%;
                    padding: 12px 24px;
                    background: white;
                    color: #444444;
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    font-size: 0.95rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }
                
                .login-google-button:hover:not(:disabled) {
                    background: #f9f9f9;
                    border-color: #d0d0d0;
                }
                
                .login-google-button:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
                
                .login-google-icon {
                    width: 20px;
                    height: 20px;
                }
                
                .login-forgot-password {
                    text-align: center;
                    font-size: 0.875rem;
                    color: #666666;
                    font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
                    margin-top: 8px;
                }
                
                .login-forgot-text {
                    margin-right: 4px;
                }
                
                .login-forgot-link {
                    color: #1a1a1a;
                    text-decoration: underline;
                    font-weight: 500;
                    transition: color 0.2s ease;
                }
                
                .login-forgot-link:hover {
                    color: #3b5de7;
                }
            `}</style>
        </>
    );
}