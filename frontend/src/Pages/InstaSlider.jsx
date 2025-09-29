
import React from 'react'
import '../assets/Css/Header.css'

import { SwiperSlide, Swiper } from 'swiper/react'

import post1 from "../assets/Image/bookmyshow/logo/dummyImg/leftimg.jpg"
import post2 from '../assets/Image/bookmyshow/logo/dummyImg/rightImg.jpg'


import insta1 from '../assets/Image/bookmyshow/insta/instapost1.jpg'
import insta2 from '../assets/Image/bookmyshow/insta/instapost2.jpg'
import insta3 from '../assets/Image/bookmyshow/insta/instapost3.jpg'
import insta4 from '../assets/Image/bookmyshow/insta/instapost4.jpg'

import 'swiper/css'

const InstaSlider = () => {
    return (
        <div className='instaslider_section'>

            <Swiper
                className='instaImg'
                slidesPerView={5}
                spaceBetween={30}
                breakpoints={{
                    320: {
                        slidesPerView: 2
                    },

                    600: {
                        slidesPerView: 3
                    },
                    767: {
                        slidesPerView: 4
                    },
                    992: {
                        slidesPerView: 5
                    }
                }}

            >
                <SwiperSlide  >
                    <div className="insta_img">
                        <img src={insta1} width="100%" alt="instaPost1" />
                    </div>

                </SwiperSlide>

                <SwiperSlide>
                    <div className="insta_img">
                        <img src={insta2} width="100%" alt="instaPost1" />
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="insta_img">
                        <img src={insta3} width="100%" alt="instaPost1" />
                    </div>

                </SwiperSlide>
                <SwiperSlide>
                    <div className="insta_img">
                        <img src={insta4} width="100%" alt="instaPost1" />
                    </div>

                </SwiperSlide>
                <SwiperSlide>
                    <div className="insta_img">
                        <img src={post1} width="100%" alt="instaPost1" />
                    </div>

                </SwiperSlide>
                <SwiperSlide>
                    <div className="insta_img">
                        <img src={post2} width="100%" alt="instaPost1" />
                    </div>

                </SwiperSlide>






            </Swiper>





        </div>
    )
}

export default InstaSlider;
