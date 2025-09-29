import React from 'react';
import '../assets/Css/Privacy.css';
import { Link } from 'react-router-dom';

const TermCondition = () => {
    return (
        <div className='privacy_policy_container'>
            <div className="container">
                <div className="breadcrubms">
                    <ul>
                        <li>
                            <Link to='/'>Home</Link> / Terms & Conditions
                        </li>
                    </ul>
                </div>

                <div className="privacy_inner_content">
                    <div className="title">
                        <h4>BOOKMYFLOWER TERMS & CONDITIONS</h4>
                    </div>

                    <div className="common_para">
                        <p>Welcome to BookMyFlower! These Terms and Conditions ("Terms") govern your use of our website https://bookmyflowers.co/ ("Site") and all related services, including flower, cake, and gift deliveries ("Services"). By accessing or using our Site and Services, you agree to be bound by these Terms.</p>
                    </div>

                    <div className="title">
                        <h4>1. GENERAL TERMS</h4>
                    </div>
                    <div className="common_para">
                        <p><strong>1.1 Eligibility:</strong> You must be at least 18 years old to use our Services. By using our Site, you represent that you meet this requirement.</p>
                        <p><strong>1.2 Account Responsibility:</strong> You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>
                        <p><strong>1.3 Changes to Terms:</strong> We may modify these Terms at any time. Continued use after changes constitutes acceptance of the new Terms.</p>
                    </div>

                    <div className="title">
                        <h4>2. ORDERING AND PAYMENT</h4>
                    </div>
                    <div className="common_para">
                        <p><strong>2.1 Order Acceptance:</strong> All orders are subject to product availability. We reserve the right to refuse or cancel any order.</p>
                        <p><strong>2.2 Pricing:</strong> Prices are in INR and exclude taxes/delivery fees unless stated otherwise. We may correct pricing errors.</p>
                        <p><strong>2.3 Payment Methods:</strong> We accept credit/debit cards, UPI, net banking, and other payment methods displayed at checkout.</p>
                        <p><strong>2.4 Order Confirmation:</strong> You will receive email confirmation once payment is processed.</p>
                    </div>

                    <div className="title">
                        <h4>3. DELIVERY POLICY</h4>
                    </div>
                    <div className="common_para">
                        <p><strong>3.1 Delivery Areas:</strong> We deliver across India through our network of local florists.</p>
                        <p><strong>3.2 Delivery Times:</strong> Estimated delivery times are not guaranteed and may vary due to:</p>
                        <ul>
                            <li>Recipient location</li>
                            <li>Weather conditions</li>
                            <li>High demand periods</li>
                            <li>Recipient availability</li>
                        </ul>
                        <p><strong>3.3 Delivery Issues:</strong> Please inspect deliveries immediately. Report damages within 2 hours with photos.</p>
                    </div>

                    <div className="title">
                        <h4>4. RETURNS AND REFUNDS</h4>
                    </div>
                    <div className="common_para">
                        <p><strong>4.1 Perishable Items:</strong> Due to the nature of flowers and cakes, returns are generally not accepted unless:</p>
                        <ul>
                            <li>Item is damaged during delivery</li>
                            <li>Wrong item was delivered</li>
                            <li>Quality does not meet standards</li>
                        </ul>
                        <p><strong>4.2 Refund Processing:</strong> Approved refunds will be processed within 7-10 business days to the original payment method.</p>
                        <p><strong>4.3 Cancellations:</strong> Orders may be cancelled before processing. Processing fees may apply.</p>
                    </div>

                    <div className="title">
                        <h4>5. INTELLECTUAL PROPERTY</h4>
                    </div>
                    <div className="common_para">
                        <p>All content on our Site (images, text, logos, designs) is our property or licensed to us and protected by copyright laws. You may not reproduce, distribute, or create derivative works without our permission.</p>
                    </div>

                    <div className="title">
                        <h4>6. LIMITATION OF LIABILITY</h4>
                    </div>
                    <div className="common_para">
                        <p>To the fullest extent permitted by law, BookMyFlower shall not be liable for:</p>
                        <ul>
                            <li>Any indirect, incidental, or consequential damages</li>
                            <li>Delivery delays beyond our control</li>
                            <li>Natural variations in floral arrangements</li>
                            <li>Recipient unavailability</li>
                        </ul>
                        <p>Our total liability shall not exceed the amount paid for the relevant order.</p>
                    </div>

                    <div className="title">
                        <h4>7. GOVERNING LAW</h4>
                    </div>
                    <div className="common_para">
                        <p>These Terms shall be governed by Indian law. Any disputes shall be resolved in the courts of Gautam Buddha Nagar, Uttar Pradesh.</p>
                    </div>

                    <div className="title">
                        <h4>8. CONTACT US</h4>
                    </div>
                    <div className="common_para">
                        <p>For questions about these Terms:</p>
                        <p>
                            <Link to="mailto:enquiry@bookmyflowers.shop">Email: enquiry@bookmyflowers.shop</Link> | 
                            <Link to="tel:+919811296262"> Phone: +91 9811296262</Link>
                        </p>
                        <p><strong>Registered Office:</strong> B-27, Ground floor, Golden I, Greater Noida West, Gautam Buddha Nagar, UP, 201301</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TermCondition;