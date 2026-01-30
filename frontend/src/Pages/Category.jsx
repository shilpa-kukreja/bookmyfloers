
    import React, { useContext } from 'react'
    import '../assets/Css/Header.css'
    import { Navigate, useNavigate } from 'react-router-dom'
    import { Link } from 'react-router-dom'
    import { useState, useEffect } from 'react'
    import { useLocation } from 'react-router-dom'

    import { SwiperSlide, Swiper } from 'swiper/react'
    import { Autoplay } from 'swiper/modules';
    import 'swiper/css'

    import { ShopContext } from '../Context/ShopContext'
    import shopbanner from '../assets/Image/bookmyshow/logo/mainbanner/topbanner/Shoppagebanner.jpg'
    const Category = () => {

        const navigate = useNavigate()
        const location = useLocation()

        const { category, backend_url } = useContext(ShopContext)
        const [showCategory, setShowCategory] = useState(true)
        const [windowWidth, setWindowWidth] = useState(window.innerWidth);
       


        const handleCategoryClick = (slug) => {
            navigate(`/${slug}`);
            setShowCategory(false)
        };


        useEffect(() => {
            setShowCategory(true);
        }, [location]);

        return (
            <>
             <img src={shopbanner} width="100%" alt="Shop Banner" />
            <div className='category_section'>
               
                <div className="container" >
                   
                   
              <div className='category_slides mobile_category-slides'>
                        
                             {category.map((item, _id) => (
                            <SwiperSlide key={_id} className="category_slide ">
                                <div className="category_card" onClick={() => handleCategoryClick(item.slug)}>
                                    <img src={`${backend_url}${item.image}`} alt={item.name} />
                                    <div className="category_name">{item.name}</div>
                                </div>
                            </SwiperSlide>
                        ))}
                        
                        </div> 
            






                </div>
            </div>
            </>
        )
    }

    export default Category;