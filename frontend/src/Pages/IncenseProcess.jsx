import React from 'react'
import '../assets/Css/IncenseProcess.css'




import { Swiper, SwiperSlide } from 'swiper/react';

import { Pagination, Navigation, Autoplay, EffectFade } from 'swiper/modules'


import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css';
import 'swiper/css/pagination';



import banner from  "../assets/Image/bookmyshow/logo/dummyImg/leftimg.jpg"

const images = [{
  id: "1",
  img: banner,
  title: " Birthdays to Love"
},
{
  id: "2",
  img: banner,
  title: "Celebrate Every Feeling"
},
{
  id: "3",
  img: banner,
  title: "Office colleagues"
},
{
  id: "4",
  img: banner,
  title: "Gifts for Every Emotion"
},
]


const IncenseProcess = () => {
  return (
    <div className='incenseProcess_section'>

      {/* <div className="container">
        <div className="process_icon_wrapper">
          <div className='common_headline'>
            <div className='agarbatti_img'>
             
              <h2>  The Process of bouquet Making </h2>
            </div>
          </div>
          <div className="icon_grid">

            <div className='process_cont'>
              <img src={icon1} width='75px' alt="icon1" />
              <p>
                Flowers are collected from temples.
              </p>

            </div>
            <div className='process_cont'>
              <img src={icon2} width='75px' alt="icon1" />
              <p>
                The flowers are taken for sorting.
              </p>

            </div>
            <div className='process_cont'>
              <img src={icon3} width='75px' alt="icon1" />
              <p>
                They are handpicked and separated carefully.
              </p>

            </div>
            <div className='process_cont'>
              <img src={icon4} width='75px' alt="icon1" />
              <p>
                The dried flowers are turned into powder.
              </p>

            </div>
            <div className='process_cont'>
              <img src={icon5} width='75px' alt="icon1" />
              <p>
                A paste is made to prepare dhoop and incense sticks.
              </p>

            </div>
            <div className='process_cont'>
              <img src={icon6} width='75px' alt="icon1" />
              <p>
                The incense is blended and dipped in pure essential oils.
              </p>

            </div>


          </div>
        </div>

      </div> */}

      {/* <div className="where_to_use">

        <div className='common_headline'>
          <div>
            <div className='agarbatti_img'>
           
              <h2> Best Suited For </h2>
            </div>
           <p>Brighten birthdays, celebrate love, or simply say ‘I care’ with our handcrafted bouquets.</p>

          </div>
        </div>


        <Swiper

          spaceBetween={10}
          slidesPerView={3}
          centeredSlides={true}
          loop={true}
          modules={[Autoplay, EffectFade]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}


        >
          {images.map((image) => (
            <SwiperSlide key={image.id}>
              <div className="image-wrapper">
                <img src={image.img} alt={image.title} className="image" />

                <p className='img_title'>
                  {image.title}
                </p>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>



      </div> */}







    </div>
  )
}

export default IncenseProcess
