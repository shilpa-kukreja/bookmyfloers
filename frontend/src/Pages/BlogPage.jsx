
import React, { useEffect } from 'react'
import topbanner from '../assets/Image/bookmyshow/logo/mainbanner/topbanner.jpg'


import { useContext } from 'react'
import { ShopContext } from '../Context/ShopContext'
import { FaUser } from "react-icons/fa";
import { FaCalendarDays } from "react-icons/fa6";
import { Link } from 'react-router-dom'
import { useState } from 'react'

import blogbanner from '../assets/Image/bookmyshow/logo/mainbanner/topbanner/blogbanner.jpg'


import '../assets/Css/Blog.css'

const BlogPage = () => {



    const { blog, backend_url } = useContext(ShopContext)

        const formatDate = (isoString) => {
  const date = new Date(isoString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`; // "08-08-2025"
};


    return (
        <>
            <img src={blogbanner} width='100%' alt="blog page banner" />

            <div className='blogpage_section'>
                <div className="container">
                    <div className='common_headline'>
                        <div>
                            <div className='agarbatti_img'>
                                
                                <h2> Our Floral Stories </h2>
                            </div>
                            <p>
                                Discover bouquet inspirations, gifting tips, and the beautiful language of flowers in every post.
                            </p>
                        </div>
                    </div>


                    <div className="blogpage_grid">
                        {
                            blog.map((item, id) => (
                                <div key={id}>
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





                                </div>
                            ))
                        }


                    </div>

                </div>

            </div>
        </>
    )
}

export default BlogPage
