import React, { useState } from 'react';
import '../assets/Css/Privacy.css';
import { Link, useNavigate } from 'react-router-dom';
import loginbanner from '../assets/Image/bookmyshow/logo/mainbanner/topbanner/loginbanner.jpg';
import logo from '../assets/Image/bookmyshow/logo/Logo.png';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({ email: '' });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

     const backend_url = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        
        // Validate email
        if (!email) {
            setErrors({ email: 'Email is required' });
            return;
        } else if (!validateEmail(email)) {
            setErrors({ email: 'Please enter a valid email address' });
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${backend_url}/api/auth/forgotpassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to send reset link');
            }

            if(data.success) {
                toast.success('Reset link sent to your email'); 
            }else {
                toast.error(data.message);
            }
            
            
        
            setEmail('');
            setErrors({ email: '' });

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
                                        Enter your email address to receive a password reset link
                                    </p>
                                </div>

                                {message && (
                                    <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
                                        {message}
                                    </div>
                                )}

                                <div className="login_form">
                                    <form onSubmit={handleSubmit}>
                                        <div className="form_group w-100">
                                            <input 
                                                type="email" 
                                                className={`form_control ${errors.email ? 'error-border' : ''}`}
                                                placeholder='Enter Email' 
                                                value={email}
                                                onChange={(e) => {
                                                    setEmail(e.target.value);
                                                    if (errors.email) setErrors({ email: '' });
                                                }}
                                                required 
                                            />
                                            {errors.email && (
                                                <span className="error-text">{errors.email}</span>
                                            )}
                                        </div>

                                        <div>
                                            <button 
                                                type='submit' 
                                                className='login_btn'
                                                disabled={loading}
                                            >
                                                {loading ? 'Sending...' : 'Send Reset Link'}
                                            </button>
                                        </div>

                                        <div className="remember">
                                            Back to Login Page. <Link className='singup' to='/login'>Login</Link> 
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword;