
import React, { useEffect, useState } from 'react'
import { ShopContext } from '../Context/ShopContext'
import { useContext } from 'react'

import { FaUser } from "react-icons/fa";
import { FaCalendarDays } from "react-icons/fa6";
import { SwiperSlide, Swiper } from 'swiper/react'
import '../assets/Css/Blog.css'
import { Pagination } from 'swiper/modules'
import 'swiper/css'

import 'swiper/css/pagination'
import { Link } from 'react-router-dom';



const Blog = () => {

    const { blog, backend_url } = useContext(ShopContext)



    const formatDate = (isoString) => {
  const date = new Date(isoString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`; // "08-08-2025"
};





    return (
        <div className='blog_section'>
            <div className="container">
                <div className='common_headline'>
                    <div>
                        <div className="agarbatti_img">
                            <h2> The Sacred Smoke Journal </h2>
                        </div>

                        <p>
                            A journey through ancient traditions, natural scents, and soulful rituals.
                        </p>
                    </div>
                </div>

                <div className="blog_grid">

                    <Swiper
                        className="my-swiper"
                        modules={[Pagination]}
                        slidesPerView={3}
                        pagination={{ clickable: true }}
                        spaceBetween={30}
                        breakpoints={{
                            320: {
                                slidesPerView: 1
                            },
                            600: {
                                slidesPerView: 2
                            },
                            767: {
                                slidesPerView: 3
                            },
                            992: {
                                slidesPerView: 3
                            }
                        }}
                    >
                        {blog.slice(0, 4).map((item, _id) => (
                            <SwiperSlide key={_id}  >
                                <div className='blog_details'>

                                    <div className="img_wrapper">
                                        <Link to={`/blog/${item.slug}`}>
                                            <img src={`${backend_url}${item.image}`} width="100%" alt={blog.name} />
                                        </Link>
                                    </div>


                                    <div className="blog_content_details">
                                        <div className="admin">
                                            <div className='user'> <FaUser /> {item.author}</div>
                                            <div className='calender'><FaCalendarDays />  {formatDate(item.created_at)}</div>
                                        </div>
                                        <Link to={`/blog/${item.slug}`}>

                                            <h3> {item.name}</h3>
                                        </Link> 

                                    <div 
                                        className='para'
                                        dangerouslySetInnerHTML={{ __html: item.description }} 
                                        />

                                    </div>

                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </div>
    )
}

export default Blog
