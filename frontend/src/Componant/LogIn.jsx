import React, { useContext, useState } from 'react';
import '../assets/Css/Privacy.css';
import LoginImg from '../assets/Image/bookmyshow/logo/dummyImg/bestsellerleft.jpg';
import logo from '../assets/Image/bookmyshow/logo/Logo.png';
import { Link, useNavigate } from 'react-router-dom';
import googleImg from "../assets/Image/dummyImg/google.webp";
import loginbanner from '../assets/Image/bookmyshow/logo/mainbanner/topbanner/loginbanner.jpg';
import { IoIosEyeOff } from "react-icons/io";
import { IoIosEye } from "react-icons/io";
import { toast } from 'react-toastify';
import { ShopContext } from '../Context/ShopContext';

const LogIn = () => {
    const { token , setToken } = useContext(ShopContext) ;
    const [showCpass, setShowCpass] = useState(false);
    const [checked, setChecked] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({
        email: '',
        password: '',
        general: ''
    });

    const backend_url = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const validatePassword = (password) => {
        return password.length >= 6;
    };

    const validateForm = () => {
        let valid = true;
        const newErrors = {
            email: '',
            password: '',
            general: ''
        };

        if (!formData.email) {
            newErrors.email = 'Email is required';
            valid = false;
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
            valid = false;
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
            valid = false;
        } else if (!validatePassword(formData.password)) {
            newErrors.password = 'Password must be at least 6 characters';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: '',
                general: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setErrors(prev => ({ ...prev, general: '' }));
        setLoading(true);

        try {
            const response = await fetch(`${backend_url}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed. Please check your credentials.');
            }

            // Store token in localStorage
            localStorage.setItem('token', data.token);
            setToken(data.token);
            // Store user data if needed (without password)
            if (data.user) {
                // localStorage.setItem('user', JSON.stringify(data.user));
            }

            toast.success('Login successful!');
            // Redirect to home or dashboard
            navigate('/');

        } catch (err) {
            toast.error(err.message);
            // setErrors(prev => ({ ...prev, general: err.message }));
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
                                <div className="logo ">
                                    <Link to="/"><img src={logo} width='150px' alt="Logo" /></Link>
                                    <p>
                                        Login to your account
                                    </p>
                                </div>

                                {errors.general && (
                                    <div className="error-message" style={{ color: 'red', marginBottom: '15px' }}>
                                        {errors.general}
                                    </div>
                                )}

                                {/* <div className="login_with_google">
                                    <div className='googleImg'>
                                        <img src={googleImg} width='20px' alt="googleImg" />  
                                        <Link>Continue with Google</Link>
                                    </div>
                                </div> */}
                                {/* <div className="login_border"></div> */}

                                <div className="login_form">
                                    <form onSubmit={handleSubmit} noValidate>
                                        <div className="form_group w-100">
                                            <input 
                                                type="email" 
                                                name="email"
                                                className={`form_control ${errors.email ? 'error-border' : ''}`}
                                                placeholder='Enter Email' 
                                                value={formData.email}
                                                onChange={handleChange}
                                                required 
                                            />
                                            {errors.email && (
                                                <span className="error-text">{errors.email}</span>
                                            )}
                                        </div>

                                        <div className="form_group w-100 show_password">
                                            <input 
                                                type={showCpass ? 'text' : 'password'} 
                                                name="password"
                                                className={`form_control ${errors.password ? 'error-border' : ''}`}
                                                placeholder='Enter Password' 
                                                value={formData.password}
                                                onChange={handleChange}
                                                required 
                                            />
                                            <div className="eyeicon" onClick={() => setShowCpass(!showCpass)}>
                                                {showCpass ? <IoIosEye /> : <IoIosEyeOff />}
                                            </div>
                                            {errors.password && (
                                                <span className="error-text">{errors.password}</span>
                                            )}
                                        </div>

                                        <div className="forgot_pass">
                                            <div className="animated-checkbox" onClick={() => setChecked(!checked)}>
                                                <svg viewBox="0 0 64 64" height="20px" width="20px" className={`checkbox-icon ${checked ? "checked" : ""}`}>
                                                    <path d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16" pathLength="575.0541381835938" className="path"></path>
                                                </svg>
                                                <p>Remember me</p>
                                            </div>
                                            <div className='forgot_link'>
                                                <Link to='/forgot-password'>Forgot Password?</Link>
                                            </div>
                                        </div>

                                        <div>
                                            <button 
                                                type='submit' 
                                                className='login_btn'
                                                disabled={loading}
                                            >
                                                {loading ? 'Logging in...' : 'Login'}
                                            </button>
                                        </div>

                                        <div className="remember">
                                            Not a member? <Link className='singup' to='/signup'>Register.</Link>
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
}

export default LogIn;