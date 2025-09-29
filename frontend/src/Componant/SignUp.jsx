import React, { useState } from 'react';
import '../assets/Css/Privacy.css';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { IoIosEyeOff, IoIosEye } from "react-icons/io";
import logo from '../assets/Image/bookmyshow/logo/Logo.png';
import googleImg from "../assets/Image/dummyImg/google.webp";
import loginbanner from '../assets/Image/bookmyshow/logo/mainbanner/topbanner/loginbanner.jpg';

const SignUp = () => {
    const navigate = useNavigate();
    const [showPass, setShowPass] = useState(false);
    const [showCpass, setShowCpass] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const backend_url = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        // Clear error when user types
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        
        if (!formData.mobile.trim()) {
            newErrors.mobile = 'Mobile number is required';
        } else if (!/^[6-9][0-9]{9}$/.test(formData.mobile)) {
            newErrors.mobile = 'Please enter a valid 10-digit Indian mobile number';
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/.test(formData.password)) {
            newErrors.password = 'Password must contain uppercase, lowercase, number and special character';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }
        
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            const { confirmPassword, ...userData } = formData;
            const response = await axios.post(`${backend_url}/api/auth/register`, userData);
            
            // Store token in localStorage
            localStorage.setItem('token', response.data.token);
            
            toast.success('Registration successful!');
            navigate('/'); // Redirect to home page after successful registration
        } catch (error) {
            console.error('Registration error:', error);
            const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
            toast.error(errorMessage);
            
            // Handle specific errors
            if (error.response?.data?.message?.includes('already in use')) {
                setErrors({
                    ...errors,
                    email: 'Email already in use'
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <div className="login_container">
                <div className="container">
                    <div className="login_wrapper signin_wrapper">
                        <div className="col-half">
                            <div className="loginImg">
                                <img src={loginbanner} width='100%' alt="loginImg" />
                            </div>
                        </div>
                        <div className="col-half">
                            <div className="login_right_content">
                                <div className="logo">
                                    <Link to="/"><img src={logo} width='150px' alt="Logo" /></Link>
                                </div>

                                {/* <div className="login_with_google">
                                    <div className='googleImg'>
                                        <img src={googleImg} width='20px' alt="googleImg" />  
                                        <Link>Continue with Google</Link>
                                    </div>
                                </div> */}
                                
                                {/* <div className="login_border"></div> */}

                                <div className="login_form">
                                    <form onSubmit={handleSubmit}>
                                        <div className="form_group w-100">
                                            <input 
                                                type="text" 
                                                name="name"
                                                className={`form_control ${errors.name ? 'error' : ''}`} 
                                                placeholder='Enter Name' 
                                                value={formData.name}
                                                onChange={handleChange}
                                            />
                                            {errors.name && <span className="error-message">{errors.name}</span>}
                                        </div>

                                        <div className="form_group w-100">
                                            <input 
                                                type="tel" 
                                                name="mobile"
                                                className={`form_control ${errors.mobile ? 'error' : ''}`} 
                                                placeholder='Enter Mobile Number'
                                                value={formData.mobile}
                                                onChange={handleChange}
                                            />
                                            {errors.mobile && <span className="error-message">{errors.mobile}</span>}
                                        </div>

                                        <div className="form_group w-100">
                                            <input 
                                                type="email" 
                                                name="email"
                                                className={`form_control ${errors.email ? 'error' : ''}`} 
                                                placeholder='Enter Email'
                                                value={formData.email}
                                                onChange={handleChange}
                                            />
                                            {errors.email && <span className="error-message">{errors.email}</span>}
                                        </div>

                                        <div className="form_group w-100 show_password">
                                            <input 
                                                type={showPass ? 'text' : 'password'} 
                                                name="password"
                                                className={`form_control ${errors.password ? 'error' : ''}`} 
                                                placeholder='Enter Password'
                                                value={formData.password}
                                                onChange={handleChange}
                                            />
                                            <div className="eyeicon" onClick={() => setShowPass(!showPass)}>
                                                {showPass ? <IoIosEye /> : <IoIosEyeOff />}
                                            </div>
                                            {errors.password && <span className="error-message">{errors.password}</span>}
                                        </div>

                                        <div className="form_group w-100 show_password">
                                            <input 
                                                type={showCpass ? 'text' : 'password'} 
                                                name="confirmPassword"
                                                className={`form_control ${errors.confirmPassword ? 'error' : ''}`} 
                                                placeholder='Confirm Password'
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                            />
                                            <div className="eyeicon" onClick={() => setShowCpass(!showCpass)}>
                                                {showCpass ? <IoIosEye /> : <IoIosEyeOff />}
                                            </div>
                                            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                                        </div>

                                        <div>
                                            <button 
                                                type='submit' 
                                                className='login_btn' 
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? 'Signing Up...' : 'Sign Up'}
                                            </button>
                                        </div>

                                        <div className="remember">
                                            Already a member? <Link className='login' to='/login'>Login</Link>
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

export default SignUp;