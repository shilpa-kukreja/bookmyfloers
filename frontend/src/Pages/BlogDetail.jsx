
import React, { useState } from 'react'
import { useParams, } from 'react-router-dom'
import { useContext } from 'react'
import { ShopContext } from '../Context/ShopContext'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaUser } from "react-icons/fa";
import { FaCalendarDays } from "react-icons/fa6";

import '../assets/Css/Blog.css'








const BlogDetail = () => {

    const { blog, backend_url } = useContext(ShopContext);
    const { slug } = useParams();

    // useEffect(() => {

    //     const findBlog = blog.find((item) => item.id === id)
    //     setFetchBlog(findBlog)
    // }, [id])


    const currentBlog = blog.find((item) => item.slug === slug)
    const relatedBlogs = blog.filter((item) => item.slug !== slug)
    console.log("relatedBlog", relatedBlogs)

    if (!currentBlog) {
        return <div>Blog not found</div>;
    }

        const formatDate = (isoString) => {
  const date = new Date(isoString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`; // "08-08-2025"
};



    return (
        <div className='main_blogDetailpage'>
            <div className="container">
                <div className='breadcrumbs'>
                    <ul>
                        <li>
                            Home / <Link to="/blog-page" >Blog</Link> / {currentBlog.name}
                        </li>
                    </ul>
                </div>

                <div className="blog_detail_wrapper">


                    <div className='blog_details'>

                        <div className="img_wrapper">

                            <img src={`${backend_url}${currentBlog.image}`} width="100%" alt={currentBlog.name} />

                        </div>


                        <div className="blog_content_details">
                            <div className="admin">
                                <div class='user'> <FaUser /> {currentBlog.author}</div>
                                <div class='calender'><FaCalendarDays /> {formatDate(currentBlog.created_at)}</div>
                            </div>
                            <h3>{currentBlog.name}</h3>

                            
                                    <div 
                                        className='para'
                                        dangerouslySetInnerHTML={{ __html: currentBlog.description }} 
                                        />

                        </div>

                    </div>



                    <div className="asidebarBlog">

                        <h2>Latest Blogs</h2>

                        <ul>
                            {relatedBlogs.map(item => (
                                <li key={item._id} className='related_blogs '>
                                    <Link to={`/blog/${item.slug}`} className='related_blog_box'>

                                        <img src={`${backend_url}${item.image}`} alt={item.name} width="70px" />

                                        <div className='related_product_name'>
                                            <p className='related_blog_title'>{item.name}</p>
                                            <p className="blog_date"><FaCalendarDays /> &nbsp; {formatDate(item.created_at)} </p>
                                            
                                        </div>

                                    </Link>
                                </li>
                            ))}

                        </ul>



                    </div>






                </div>
            </div>
        </div>
    )
}

export default BlogDetail
