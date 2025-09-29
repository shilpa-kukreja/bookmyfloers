
import React from 'react'

import { Swiper, SwiperSlide } from 'swiper/react';

import { Pagination, Navigation, Autoplay, EffectFade } from 'swiper/modules'


import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css';
import 'swiper/css/pagination';



import slider1 from '../assets/Image/bookmyshow/logo/mainbanner/decor-1.jpg'
import slider2 from '../assets/Image/bookmyshow/logo/mainbanner/decor-2.jpg'
import slider3 from '../assets/Image/bookmyshow/logo/mainbanner/docor-3.jpg'
import slider4 from '../assets/Image/bookmyshow/logo/mainbanner/decor-4.jpg'

import decorbanner from '../assets/Image/bookmyshow/logo/mainbanner/decor1.jpg'
import '../assets/Css/About.css'
import { Link } from 'react-router-dom'
const Decor = () => {
    return (
        <div className='decor_section'>
            <div className="decor_banner">
                <img src={decorbanner} width='100%'  alt="decor  banner" />
                <div className=" decor_banner_text">
                    <div>
                        <h2>Decor </h2>
                        <p className='headline'>
                            Where celebrations come alive!
                        </p>

                        <p className='decor_text'>
                            From intimate dinners to big fat Indian weddings and stage flower decorations, birthdays to baby showers, we personalise every last detail to create an event that will have you smiling for ages.
                        </p>
                        <p className='headline'>
                            Collaborative Theme Planning
                        </p>
                        <p className='decor_text'>
                            With our team by your side, there’s no limit to what we can bring to life. No matter how extravagant or daunting your ideas may seem, we make it happen for you.

                            Contact Us
                        </p>


                        <button>
                            <Link to="/contact-us">  Contact Us</Link>
                        </button>






                    </div>
                </div>
            </div>





            <div className="decor_slider">
                <div className="container">


                    <Swiper
                        spaceBetween={20}
                        slidesPerView={3}
                        loop={true}
                        modules={[Autoplay, EffectFade,Pagination, Navigation]}
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}

                     breakpoints={{
                          
                            992: {
                                slidesPerView: 3, 
                                spaceBetween: 15,
                            },
                            0: {
                                slidesPerView: 2, 
                                spaceBetween: 10,
                            },
                        }}





                    >

                        <SwiperSlide>
                            <img src={slider1} width='100%' alt="img" />

                        </SwiperSlide>
                       
                        <SwiperSlide>
                            <img src={slider3} width='100%' alt="img" />

                        </SwiperSlide>
                         <SwiperSlide>
                            <img src={slider2} width='100%' alt="img" />

                        </SwiperSlide>
                        <SwiperSlide>
                            <img src={slider4} width='100%' alt="img" />

                        </SwiperSlide>
                       

                    </Swiper>














                </div>

            </div>

        </div>










    )
}

export default Decor
