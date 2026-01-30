
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
    const ShowCategory = () => {

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
            <div className='category_section'>
                <div className="container" >
                 

                    {windowWidth < 576 ? <div className='category_slides mobile_category-slides'>
                        
                             {category.map((item, _id) => (
                            <SwiperSlide key={_id} className="category_slide ">
                                <div className="category_card" onClick={() => handleCategoryClick(item.slug)}>
                                    <img src={`${backend_url}${item.image}`} alt={item.name} />
                                    <div className="category_name">{item.name}</div>
                                </div>
                            </SwiperSlide>
                        ))}
                        
                        </div> : 
                    <Swiper
                        className="category_slides"
                        slidesPerView={5}
                        loop={true}
                        
                        initialSlide={0}
                        grabCursor={true}
                        // centeredSlides={true}
                        //      autoplay={{
                        //     delay: 2500,
                        //     disableOnInteraction: false, 
                        //   }}
                        breakpoints={{
                            0: {
                                slidesPerView: 2,
                                spaceBetween: 20,
                            },
                            576: {
                                slidesPerView: 2,
                                spaceBetween: 15,
                            },
                            768: {
                                slidesPerView: 3,
                                spaceBetween: 15,
                            },
                            992: {
                                slidesPerView: 5,
                                spaceBetween: 20,
                            },
                        }}

                    >


                        {category.map((item, _id) => (
                            <SwiperSlide key={_id} className="category_slide">
                                <div className="category_card" onClick={() => handleCategoryClick(item.slug)}>
                                    <img src={`${backend_url}${item.image}`} alt={item.name} />
                                    <div className="category_name">{item.name}</div>
                                </div>
                            </SwiperSlide>
                        ))}


                    </Swiper>
                    }






                </div>
            </div>
        )
    }

    export default ShowCategory