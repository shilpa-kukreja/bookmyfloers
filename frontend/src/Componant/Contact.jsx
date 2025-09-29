import React, { useState } from 'react';
import '../assets/Css/Contact.css';
import { GiThreeLeaves } from "react-icons/gi";
import { FaTruck, FaHandHoldingHeart, FaMapMarkedAlt, FaPhoneAlt } from "react-icons/fa";
import { IoMailUnread } from "react-icons/io5";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

import contactbanner from '../assets/Image/bookmyshow/logo/mainbanner/topbanner/contacts.jpg'



const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
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
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.length > 50) {
      newErrors.firstName = 'First name cannot exceed 50 characters';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.length > 50) {
      newErrors.lastName = 'Last name cannot exceed 50 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (formData.phone && !/^[0-9\-\+]{8,15}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length > 1000) {
      newErrors.message = 'Message cannot exceed 1000 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill all field correctly');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await axios.post(`${backend_url}/api/contact/add`, formData);
        
      if(response.data.success){
        toast.success('Your message has been sent successfully!');
      }else {
        toast.error('Failed to send message. Try again later');
      }
      
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      const errorMessage = error.response?.data?.message || 'Failed to send message. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (

    

    <div className='contact_section'>
        
      <img src={contactbanner} width='100%' alt="contactus banner" />

      <div className="">
        <div className='box_wrapper'>
          <div className='icon_box'>
            <div className="box-icon">
              <GiThreeLeaves className='icon' />
            </div>
            <h5>Made With Love And Care</h5>
            <p>High quality ingredients, with safe & hygienic conditions</p>
          </div>
          <div className='icon_box'>
            <div className="box-icon">
              <FaHandHoldingHeart className='icon' />
            </div>
            <h5>Shop with your Heart</h5>
            <p>Few indulgences nourish your heart like ours do</p>
          </div>
          <div className='icon_box'>
            <div className="box-icon">
              <FaTruck className='icon' />
            </div>
            <h5>Home Delivery</h5>
            <p>Doorstep delivery to save you the extra effort</p>
          </div>
        </div>

        <div className="contact_form_section">
          <div className="container">
            <div className="contact_wrapper">
              <div className="add_information">
                <div className="address add-icons">
                  <h3><FaMapMarkedAlt className='icon' /> Address</h3>
                  <p className='para'>B-27, Ground floor, Golden I, Greater Noida West</p>
                </div>
                <div className="contact add-icons">
                  <h3><FaPhoneAlt className='icon' />Phone</h3>
                  <p className='para'><a href="tel:9811296262">+91 9811296262</a></p>
                </div>
                <div className="email add-icons">
                  <h3><IoMailUnread className='icon' /> Email</h3>
                  <p className='para'><a href="mailto:enquiry@bookmyflowers.co">enquiry@bookmyflowers.co</a></p>
                </div>
              </div>

              <div className="form_wrapper">
                <span>Inquiry Form</span>
                <h2>Reach Out to Us</h2>
                <form className='contact_form' onSubmit={handleSubmit}>
                  <div className="form_group w-50">
                    <label htmlFor="firstName">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      className={`form_control  ${errors.firstName ? 'error' : ''}`}
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder='First Name'
                    />
                    {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                  </div>
                  <div className="form_group w-50">
                    <label htmlFor="lastName">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      className={`form_control ${errors.lastName ? 'error' : ''}`}
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder='Lirst Name'
                    />
                    {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                  </div>
                  <div className="form_group w-50">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      name="email"
                      className={`form_control ${errors.email ? 'error' : ''}`}
                      value={formData.email}
                      onChange={handleChange}
                      placeholder='Email Id'
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>
                  <div className="form_group w-50">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      className={`form_control ${errors.phone ? 'error' : ''}`}
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. +1234567890"
                    />
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                  </div>
                  <div className="form_group w-100">
                    <label htmlFor="message">Drop a Message *</label>
                    <textarea
                      name="message"
                      rows={10}
                      className={errors.message ? 'error' : ''}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder='Drop a Message'
                    ></textarea>
                    {errors.message && <span className="error-message">{errors.message}</span>}
                  </div>

                  <button type='submit' disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Now'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
