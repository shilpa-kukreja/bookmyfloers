
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';


import '../assets/Css/Header.css';



import { Pagination, Navigation, Autoplay, EffectFade } from 'swiper/modules'
// src/assets/Image/bookmyshow/logo/mainbanner/main1.jpg
// import banner1 from '../assets/Image/bookmyshow/logo/mainbanner/banner1.gif'
// import banner1 from '../assets/Image/bookmyshow/logo/mainbanner/main1.jpg'



// import banner1 from '../assets/Image/bookmyshow/logo/mainbanner/mainbanner1.jpg'
// import banner2 from '../assets/Image/bookmyshow/logo/mainbanner/mainbanner2.jpg'




import banner1 from '../assets/Image/bookmyshow/logo/mainbanner/banner1.jpg'
import banner2 from '../assets/Image/bookmyshow/logo/mainbanner/banner2.jpg'

// import banner2 from '../assets/Image/bookmyshow/logo/mainbanner/banner2.png'
// import banner2 from '../assets/Image/bookmyshow/logo/mainbanner/main2.jpg'

// import banner3 from '../assets/Image/bookmyshow/logo/mainbanner/banner3.jpg'
import banner3 from '../assets/Image/bookmyshow/logo/mainbanner/main3.jpg'

// import banner4 from '../assets/Image/bookmyshow/logo/mainbanner/banner4.gif'





const HomeSlider = () => {
    return (

        <div className="home_slider_section_here ">


            <div className=''>



                {/* <div className="home_video">
                                  <video src={incensevideo} autoPlay muted loop   width='100%'  ></video>
                             </div> */}


                <div className="slider-wrapper">

                    <Swiper className='mySwiper'
                        modules={[Navigation, Pagination, Autoplay, EffectFade]}
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        effect='fade'
                        loop
                        slidesPerView={1}
                        navigation={{
                            nextEl: '.custom-next',
                            prevEl: '.custom-prev',
                        }} >


                        <SwiperSlide >
                            <img src={banner1} width="100%"  alt="bmf-slider1" />
                        </SwiperSlide>
                        <SwiperSlide>
                            <img src={banner2} width="100%"  alt="bmf-slider2" />
                        </SwiperSlide>
                        <SwiperSlide>
                            <img src={banner3} width="100%"  alt="bmf-slider2" />
                        </SwiperSlide>
                        {/* <SwiperSlide>
                            <img src={banner4} width="100%" height='600px' alt="bmf-slider2" />
                        </SwiperSlide> */}



                    </Swiper>





                </div>




            </div>
        </div>
    )
}

export default HomeSlider