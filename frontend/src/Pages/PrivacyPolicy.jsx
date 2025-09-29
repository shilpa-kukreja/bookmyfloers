import React from 'react'
import '../assets/Css/Privacy.css'
import { Link } from 'react-router-dom'

const PrivacyPolicy = () => {
    return (
        <div className='privacy_policy_container'>

            <div className="container">

                <div className="breadcrubms">
                    <ul>
                        <li>
                            <Link to='/'>Home</Link> / Privacy & Policy
                        </li>
                    </ul>
                </div>

                <div className="privacy_inner_content">

                    <div className="title">
                        <h4>BOOKMYFLOWER PRIVACY POLICY</h4>
                    </div>

                    <div className="common_para">
                        <p>This Privacy Policy describes how BookMyFlower (the "Site", "we", "us", or "our") collects, uses, and discloses your personal information when you visit, use our services, or make a purchase from https://bookmyflowers.shop/ (the "Site") or otherwise communicate with us (collectively, the "Services"). For purposes of this Privacy Policy, "you" and "your" mean you as the user of the Services, whether you are a customer, website visitor, or another individual whose information we have collected pursuant to this Privacy Policy.</p>

                        <p>Please read this privacy policy carefully. By using and accessing any of the services, you agree to the collection, use, and disclosure of your information as described in this privacy policy. If you do not agree to this privacy policy, please do not use or access any of the services.</p>
                    </div>

                    <div className="title">
                        <h4>CHANGES TO THIS PRIVACY POLICY</h4>
                    </div>
                    <div className="common_para">
                        <p>We may update this Privacy Policy from time to time, including to reflect changes to our practices or for other operational, legal, or regulatory reasons. We will post the revised privacy policy on the site, update the "Last updated" date, and take any other steps required by applicable law.</p>
                        <p>Last updated: August 14, 2025</p>
                    </div>

                    <div className="title">
                        <h4>HOW WE COLLECT AND USE YOUR PERSONAL INFORMATION</h4>
                    </div>
                    <div className="common_para">
                        <p>To provide the services, we collect and have collected over the past 12 months personal information about you from a variety of sources, as set out below. The information that we collect and use varies depending on how you interact with us.</p>
                        <p>In addition to the specific uses set out below, we may use information we collect about you to communicate with you, provide the Services, comply with any applicable legal obligations, enforce any applicable terms of service, and to protect or defend the Services, our rights, and the rights of our users or others.</p>
                    </div>

                    <div className="title">
                        <h4>WHAT PERSONAL INFORMATION WE COLLECT</h4>
                    </div>
                    <div className="common_para">
                        <p>The types of personal information we obtain about you depend on how you interact with our site and use our services. When we use the term "personal information," we are referring to information that identifies, relates to, describes, or can be associated with you. The following sections describe the categories and specific types of personal information we collect.</p>
                        
                        <p><strong>Information We Collect Directly from You</strong></p>
                        <p>Information that you directly submit to us through our services may include:</p>
                        <ul>
                            <li>Basic contact details, including your name, address, phone number, and email</li>
                            <li>Order information including your name, billing address, shipping address, payment confirmation, email address, and phone number</li>
                            <li>Account information, including your username, password, and security questions</li>
                            <li>Shopping information, including the items you view, put in your cart, or add to your wishlist</li>
                            <li>Customer support information, including the information you choose to include in communications with us</li>
                        </ul>
                        <p>Some features of the services may require you to directly provide us with certain information about yourself. You may elect not to provide this information, but doing so may prevent you from using or accessing these features.</p>
                    </div>

                    <div className="title">
                        <h4>INFORMATION WE COLLECT THROUGH COOKIES</h4>
                    </div>
                    <div className="common_para">
                        <p>We also automatically collect certain information about your interaction with the services ("Usage Data"). To do this, we may use cookies, pixels, and similar technologies ("Cookies"). Usage Data may include information about how you access and use our site and your account, including device information, browser information, information about your network connection, your IP address, and other information regarding your interaction with the services.</p>
                    </div>

                    <div className="title">
                        <h4>INFORMATION WE OBTAIN FROM THIRD PARTIES</h4>
                    </div>
                    <div className="common_para">
                        <p>Finally, we may obtain information about you from third parties, including from vendors and service providers who may collect information on our behalf, such as:</p>
                        <ul>
                            <li>Our payment processors, who collect payment information (e.g., bank account, credit or debit card information, billing address) to process your payment</li>
                            <li>Marketing and analytics partners who help us understand how customers use our services</li>
                            <li>Delivery partners who provide information about delivery status and recipient confirmation</li>
                        </ul>
                    </div>

                    <div className="title">
                        <h4>CONTACT US</h4>
                    </div>
                    <div className="common_para">
                        <p>Should you have any questions about our Privacy Policy, or if you would like to exercise any of your rights, please contact us:</p>
                        <p>
                            <Link to="mailto:enquiry@bookmyflowers.shop">Email us at enquiry@bookmyflowers.shop</Link> | 
                            <Link to="tel:+919811296262"> Call us at +91 9811296262</Link>
                        </p>
                        <p><strong>Visit us at:</strong> B-27, Ground floor, Golden I, Greater Noida West, Gautam Buddha Nagar, UP, 201301</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PrivacyPolicy