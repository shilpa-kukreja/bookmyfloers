import React, { useState } from 'react';
import {Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../assets/Css/Privacy.css';
import loginbanner from '../assets/Image/bookmyshow/logo/mainbanner/topbanner/loginbanner.jpg';
import logo from '../assets/Image/bookmyshow/logo/Logo.png';

const ResetPassword = () => {
    const { token } = useParams();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({ 
        newPassword: '', 
        confirmPassword: '' 
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const backend_url = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

    const validatePassword = (password) => {
        const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
        return strongRegex.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate inputs
        let valid = true;
        const newErrors = { newPassword: '', confirmPassword: '' };

        if (!newPassword) {
            newErrors.newPassword = 'New password is required';
            valid = false;
        } else if (!validatePassword(newPassword)) {
            newErrors.newPassword = 'Password must be at least 8 characters with uppercase, lowercase, number, and symbol';
            valid = false;
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
            valid = false;
        } else if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            valid = false;
        }

        setErrors(newErrors);
        if (!valid) return;

        setLoading(true);

        try {
            const response = await fetch(`${backend_url}/api/auth/resetpassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    token, 
                    newPassword,
                    confirmPassword
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to reset password');
            }

            if (data.success) {
                toast.success('Password reset successfully!');
                navigate('/login');
            } else {
                toast.error(data.message);
            }

        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="login_container">
                <div className="container">
                    <div className="login_wrapper">
                        <div className="col-half">
                            <div className="loginImg">
                                <img src={loginbanner} width='100%' alt="loginImg" />
                            </div>
                        </div>
                        <div className="col-half">
                            <div className="login_right_content">
                                <div className="logo">
                                    <Link to="/"><img src={logo} width='150px' alt="Logo" /></Link>
                                    <p>
                                        Set your new password
                                    </p>
                                </div>

                                <div className="login_form">
                                    <form onSubmit={handleSubmit}>
                                        <div className="form_group w-100">
                                            <input 
                                                type="password" 
                                                className={`form_control ${errors.newPassword ? 'error-border' : ''}`}
                                                placeholder='New Password' 
                                                value={newPassword}
                                                onChange={(e) => {
                                                    setNewPassword(e.target.value);
                                                    if (errors.newPassword) setErrors({...errors, newPassword: ''});
                                                }}
                                                required 
                                            />
                                            {errors.newPassword && (
                                                <span className="error-text">{errors.newPassword}</span>
                                            )}
                                        </div>

                                        <div className="form_group w-100">
                                            <input 
                                                type="password" 
                                                className={`form_control ${errors.confirmPassword ? 'error-border' : ''}`}
                                                placeholder='Confirm New Password' 
                                                value={confirmPassword}
                                                onChange={(e) => {
                                                    setConfirmPassword(e.target.value);
                                                    if (errors.confirmPassword) setErrors({...errors, confirmPassword: ''});
                                                }}
                                                required 
                                            />
                                            {errors.confirmPassword && (
                                                <span className="error-text">{errors.confirmPassword}</span>
                                            )}
                                        </div>

                                        <div>
                                            <button 
                                                type='submit' 
                                                className='login_btn'
                                                disabled={loading}
                                            >
                                                {loading ? 'Resetting...' : 'Reset Password'}
                                            </button>
                                        </div>

                                        <div className="remember">
                                            Remember your password? <Link className='singup' to='/login'>Login</Link> 
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;