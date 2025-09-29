
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



        const handleCategoryClick = (slug) => {
            navigate(`/${slug}`);
            setShowCategory(false)
        };


        useEffect(() => {
            setShowCategory(true);
        }, [location]);


        console.log("all category", category)


        return (
            <div className='category_section'>
                <div className="container" >
                    <h2 className='about_bmf '> About Book My Flowers </h2>
                    <p className='category_para '>
                        Love is a universal language, and throughout history, flowers have spoken it beautifully. At BMF, we believe that emotions come first — and there's no better way to express them than with nature’s most elegant creations.

                        Welcome to our online flower boutique, where each bouquet is thoughtfully crafted to help you say what words sometimes can’t. Whether you're celebrating love, gratitude, or simply making someone’s day, we’re here to help your gestures bloom.

                        Because memories last forever — fill them with fragrance, color, and flowers curated just for you, with you, by us.
                    </p>



                    <Swiper
                        className="category_slides"
                        slidesPerView={5}
                        loop={true}
                        
                        initialSlide={2}
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






                </div>
            </div>
        )
    }

    export default ShowCategory