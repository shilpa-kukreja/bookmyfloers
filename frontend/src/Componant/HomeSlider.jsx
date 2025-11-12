import React, { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import { Pagination, Navigation, Autoplay, EffectFade } from 'swiper/modules'
import axios from 'axios';
import '../assets/Css/Header.css';

// Fallback images in case API fails or no banners
import banner1 from '../assets/Image/bookmyshow/logo/mainbanner/banner1.jpg'
import banner2 from '../assets/Image/bookmyshow/logo/mainbanner/banner2.jpg'
import banner3 from '../assets/Image/bookmyshow/logo/mainbanner/main3.jpg'

const HomeSlider = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const backend_url = import.meta.env.VITE_BACKEND_URL;

    // Fallback banners in case API fails
    const fallbackBanners = [
        { image: banner1, link: '', status: true, position: 1 },
        { image: banner2, link: '', status: true, position: 2 },
        { image: banner3, link: '', status: true, position: 3 }
    ];

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.post(`${backend_url}/api/banner/all`);
            
            if (response.data.status === 'success' && Array.isArray(response.data.data)) {
                // Filter only active banners and sort by position
                const activeBanners = response.data.data
                    .filter(banner => banner.status === true)
                    .sort((a, b) => (a.position || 100) - (b.position || 100));
                
                setBanners(activeBanners);
            } else {
                setBanners(fallbackBanners);
            }
        } catch (error) {
            console.error('Error fetching banners:', error);
            setError('Failed to load banners');
            setBanners(fallbackBanners);
        } finally {
            setLoading(false);
        }
    };

    const handleBannerClick = (link) => {
        if (link) {
            window.open(link, '_blank');
        }
    };

    if (loading) {
        return (
            <div className="home_slider_section_here">
                <div className="slider-wrapper">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="home_slider_section_here">
            <div className="slider-wrapper">
                <Swiper 
                    className='mySwiper'
                    modules={[Navigation, Pagination, Autoplay, EffectFade]}
                    pagination={{ 
                        clickable: true,
                        dynamicBullets: true
                    }}
                    autoplay={{ 
                        delay: 3000, 
                        disableOnInteraction: false 
                    }}
                    effect='fade'
                    loop={banners.length > 1}
                    slidesPerView={1}
                    // navigation={{
                    //     nextEl: '.custom-next',
                    //     prevEl: '.custom-prev',
                    // }}
                >
                    {banners.length > 0 ? (
                        banners.map((banner, index) => (
                            <SwiperSlide key={banner._id || index}>
                                <div 
                                    className={`banner-slide ${banner.link ? 'cursor-pointer' : ''}`}
                                    onClick={() => handleBannerClick(banner.link)}
                                >
                                    <img 
                                        src={banner.image ? `${backend_url}${banner.image}` : banner.image}
                                        alt={`banner-${index + 1}`}
                                        width="100%"
                                        style={{ 
                                            display: 'block',
                                            objectFit: 'cover'
                                        }}
                                        onError={(e) => {
                                            // Fallback to local image if remote image fails to load
                                            if (banner.image && banner.image.startsWith('/uploads')) {
                                                e.target.src = fallbackBanners[index % fallbackBanners.length].image;
                                            }
                                        }}
                                    />
                                </div>
                            </SwiperSlide>
                        ))
                    ) : (
                        // Show fallback banners if no banners from API
                        fallbackBanners.map((banner, index) => (
                            <SwiperSlide key={index}>
                                <img 
                                    src={banner.image} 
                                    alt={`fallback-banner-${index + 1}`}
                                    width="100%"
                                    style={{ 
                                        display: 'block',
                                        objectFit: 'cover'
                                    }}
                                />
                            </SwiperSlide>
                        ))
                    )}
                </Swiper>

                {/* Custom navigation arrows */}
                {/* <div className="custom-navigation">
                    <div className="custom-prev">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <div className="custom-next">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </div> */}
            </div>

            {/* Error message */}
            {error && (
                <div className="error-message">
                    <p>{error}</p>
                </div>
            )}
        </div>
    )
}

export default HomeSlider