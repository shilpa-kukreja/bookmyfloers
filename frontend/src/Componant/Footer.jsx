import React from 'react'
import '../assets/Css/Footer.css'
import { Link } from 'react-router-dom'
import cardimg from '../assets/Image/dummyImg/creditcard.png'
import { FaMapMarkerAlt } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { IoMdCall } from "react-icons/io";
import { useEffect } from 'react';
import { FaInstagram } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { FaPinterestP } from "react-icons/fa";
import logo from '../assets/Image/bookmyshow/logo/Logo.png'
import { GoPlus } from "react-icons/go";
import { LuMinus } from "react-icons/lu";
import { useContext } from 'react';
import { ShopContext } from '../Context/ShopContext';

import { useState } from 'react';
import footerImg from '../assets/Image/bookmyshow/footerImg.jpg'



const Footer = () => {

   const { category } = useContext(ShopContext)



   const [isMobile, setIsMobile] = useState(window.innerWidth <= 600)

   const [openSection, setOpenSection] = useState({
      useful: false,
      category: false,
      contact: false,
   })



   const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
      if (window.innerWidth > 600) {
         setOpenSection({ useful: true, category: true, contact: true });
      }
   };

   useEffect(() => {
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
   }, []);

   const toggleSection = (key) => {
      if (!isMobile) return;
      setOpenSection((prev) => ({ ...prev, [key]: !prev[key] }));
   };









   return (
      <div className='footer_section' style={{
         backgroundImage: `url(${footerImg})`,
         backgroundSize: 'cover',
         backgroundPosition: 'center center',
         backgroundRepeat: 'no-repeat',
         backgroundAttachment: 'fixed',
         width: '100%',

      }}  >

         <div className="container">

            <div className="footer_content">

               <div className="footer_links">

                  <Link> <img src={logo} width='150px' alt=" Logo" /></Link>


                  <img style={{ padding: '10px 0' }} src={cardimg} alt="card Img" width='250px' />

                  <div className="social_icons">
                     <ul>
                        <li>
                           <Link to="https://www.instagram.com/bookmyflowers_"><FaInstagram className='icon' /> </Link>
                        </li>
                        <li>
                           <Link to=""><FaFacebookF className='icon' /> </Link>
                        </li>
                        <li>
                           <Link><FaPinterestP className='icon' /></Link>
                        </li>
                     </ul>
                  </div>

               </div>

               <div className="footer_links">
                  <h3 onClick={() => toggleSection('useful')} className="footer_title" >
                     Useful Liks    {isMobile && (
                        <span className="icon_toggle">
                           {openSection.useful ? <LuMinus /> : <GoPlus />}
                        </span>
                     )}
                  </h3>

                  <ul className={`footer_mobile_icon ${isMobile && !openSection.useful ? 'closed' : 'open'}`}>
                     <li>
                        <Link to="/">Home</Link>
                     </li>
                     <li><Link to='/about-us'>About</Link></li>
                     <li><Link to='/shop'>Shop Now</Link></li>
                     <li><Link to='/blogs'>Blog</Link></li>
                     <li><Link to='/privacy-policy'>Privacy Policy</Link></li>
                     <li><Link to='/terms-conditions'>Terms & Condition</Link></li>
                     <li><Link to='/login'>Login</Link></li>
                     <li><Link to='/contact-us'>Contact Us</Link></li>
                  </ul>

               </div>
               <div className="footer_links">
                  <h3 onClick={() => toggleSection('category')} className="footer_title">
                     Our Category  {isMobile && (
                        <span className="icon_toggle">
                           {openSection.category ? <LuMinus /> : <GoPlus />}
                        </span>
                     )}
                  </h3>

                  <ul className={`footer_mobile_icon ${isMobile && !openSection.category ? 'closed' : 'open'}`}>
                     {category?.slice(0, 8).map((cat, index) => (
                        <li key={index}>
                           <Link to={`/${cat.slug}`}>{cat.name}</Link>
                        </li>
                        ))}
                  </ul>

               </div>
               <div className="footer_links">

                  <h3 onClick={() => toggleSection('contact')} className="footer_title">
                     Contact Us
                     {isMobile && (
                        <span className="icon_toggle">
                           {openSection.contact ? <LuMinus /> : <GoPlus />}
                        </span>
                     )}
                  </h3>

                  <ul className={`footer_mobile_icon contact_icon ${isMobile && !openSection.contact ? 'closed' : 'open'}`}>

                     <li>
                        <FaMapMarkerAlt className='icon' />
                        <p className='address'>
                           B-27, Ground floor, Golden I, Greater Noida West
                        </p>
                     </li>

                     <li>
                        <IoIosMail className='icon' />
                        <div>

                           <a href="mailto:enquiry@bookmyflowers.shop"> enquiry@bookmyflowers.shop</a>
                        </div>


                     </li>
                     <li>
                        <IoMdCall className='icon' />
                        <div>

                           <a href="tel:+91 9811296262">+91 9811296262</a>
                        </div>


                     </li>
                  </ul>

               </div>




            </div>

            <div className="copyright">

               <p>
                  Built with passion by <strong><a href="https://recreatorsdesign.com/">Recreator Media Pvt. Ltd </a></strong> | © 2025 BookMyFlower
               </p>
            </div>





         </div>











      </div>
   )
}

export default Footer




