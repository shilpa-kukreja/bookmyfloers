

import { SwiperSlide, Swiper } from 'swiper/react'
import '../assets/Css/ProductSlider.css'

import { useContext, useEffect } from 'react'
import { ShopContext } from '../Context/ShopContext'
import { useState } from 'react'
import { Tooltip } from 'react-tooltip';
import { toast } from 'react-toastify';


import QuickView from './QuickView'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

import { IoEyeOutline } from "react-icons/io5";
import { Link } from 'react-router-dom'
import { MdOutlineStarPurple500 } from "react-icons/md";
import { IoMdHeartEmpty } from "react-icons/io";

const ProductSlider = () => {

    const { product, addToCart, addToWishlist, toggleWishlist, wishlist, handleQuickView, closeQuickView, backend_url } = useContext(ShopContext)
    const [showProduct, setShowProduct] = useState([])
    const [selectVariant, setSelectVariant] = useState({})
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);


    useEffect(() => {
        if (Array.isArray(product)) {
            // ✅ Filter using categoryId
            const flowerTypeProduct = product
                // .filter(p => p.categoryId.includes("2"))
              .slice(0, 6);            

            setShowProduct(flowerTypeProduct);

            const initialVariants = {};
            flowerTypeProduct.forEach(p => {
                if (p.productType === 'variable' && p.variant?.length > 0) {
                    initialVariants[p._id] = p.variant[0];
                }
            });
            setSelectVariant(initialVariants);
        }
    }, [product]);



    const handleVariantClick = (productId, variant) => {
        setSelectVariant(prev => ({ ...prev, [productId]: variant }));
    };


    const handleAddToCart = (item) => {
        const selected = selectVariant[item._id];

        if (item.productType === 'variable' && !selected) {
            alert("Please select a variant");
            return;
        }
        addToCart(item, selected);
    };

    const handleWishlist = (item) => {
        const selected = selectVariant[item._id]
        if (item.productType === 'variable' && !selected) {
            alert("Please select a variant");
            return;
        }
        addToWishlist(item, selected);
    }

    return (

        <div className='productSlider_section'>
            <div className="container">
                <div className='common_headline'>

                    <div>
                        <div className='agarbatti_img'>

                            <h2> Our Featured Bouquet </h2>
                        </div>
                        <p>
                            From morning rituals to evening wind-downs—see how bouquet  brings balance and beauty to daily life.
                        </p>
                    </div>
                </div>


                <div className="product_grid">

                    {(windowWidth < 576) ?  
                        <div className='mobile_product_grid'>
                            {showProduct.map(item => {

                                const currentPrice = selectVariant[item._id]?.discountPrice || item.discountedPrice;
                                const actualPrice = selectVariant[item._id]?.actualPrice || item.mrp;


                                return (
                                    
                                        <div className='product_card' key={item._id}>
                                            <div className="product_card_img">

                                                <Link to={`product/${item.slug}`}>
                                                    <img src={`${backend_url}${item.image}`} className='w-100 product_img'  alt={item.name} />
                                                </Link>

                                                <div className='icons'>

                                                    <div data-tooltip-id='view-details' data-tooltip-content="View Details">
                                                        <IoEyeOutline className='icon' onClick={() => handleQuickView(item)} />
                                                    </div>
                                                    <div data-tooltip-id='add-to-wishlist' data-tooltip-content="Add To Wishlist">
                                                        <IoMdHeartEmpty className='icon' onClick={() => handleWishlist(item)} />
                                                    </div>

                                                    <Tooltip id="view-details"
                                                        place="top"
                                                        style={{ backgroundColor: '#000', color: '#fff', borderRadius: '0px', width: '90px', height: '30px', fontSize: '11px',cursor:'pointer'  }} />
                                                    <Tooltip id="add-to-wishlist"
                                                        place="top"
                                                        style={{ backgroundColor: '#000', color: '#fff', borderRadius: '0px', width: '90px', height: '30px', fontSize: '11px',cursor:'pointer' }} />

                                                </div>
                                            </div>

                                            <div className='about_product_detail'>
                                                <div className='productslide_detail'>

                                                    <Link to={`product/${item.slug}`}>
                                                        <h4>{item.name}</h4>

                                                    </Link>
                                                    <div className="price_section">
                                                        <p>₹{currentPrice}</p>
                                                        <span className='discount_price'>₹{actualPrice}</span>
                                                    </div>

                                                    {item.productType === 'variable' && (
                                                        <div className="variant_tabs">
                                                            {item.variant?.map((variant, index) => (
                                                                <button
                                                                    key={index}
                                                                    className={`variant_btn ${selectVariant[item._id]?.variantName === variant.variantName ? 'active' : ''}`}
                                                                    onClick={() => handleVariantClick(item._id, variant)}
                                                                >
                                                                    {variant.variantName}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}

                                                    <div className='rating_review'>
                                                        <MdOutlineStarPurple500 color='#ffa51f' />
                                                        <MdOutlineStarPurple500 color='#ffa51f' />
                                                        <MdOutlineStarPurple500 color='#ffa51f' />
                                                        <MdOutlineStarPurple500 color='#ffa51f' />
                                                    </div>
                                                </div>

                                                <div className="cart_btn">
                                                    <Link onClick={() => handleAddToCart(item)}>Add To Cart</Link>
                                                </div>

                                            </div>
                                        </div>
                                 
                                );
                            })}
                        </div>
                        :
                    <Swiper
                        className="my-swiper"
                        modules={[Pagination]}
                        slidesPerView={4}
                        pagination={{ clickable: true }}
                        spaceBetween={30}
                        breakpoints={{
                            992: {
                                slidesPerView: 4,
                                spaceBetween: 20,
                            },
                            767: {
                                slidesPerView: 3,
                                spaceBetween: 15,
                            },
                            600: {
                                slidesPerView: 2,
                                spaceBetween: 10,
                            },
                              0: {
                                slidesPerView: 1,
                                spaceBetween: 10,
                            },
                        }}
                    >
                        {
                            showProduct.map(item => {

                                const currentPrice = selectVariant[item._id]?.discountPrice || item.discountedPrice;
                                const actualPrice = selectVariant[item._id]?.actualPrice || item.mrp;


                                return (
                                    <SwiperSlide key={item._id}>
                                        <div className='product_card'>
                                            <div className="product_card_img">

                                                <Link to={`product/${item.slug}`}>
                                                    <img src={`${backend_url}${item.image}`} className='w-100 product_img'  alt={item.name} />
                                                </Link>

                                                <div className='icons'>

                                                    <div data-tooltip-id='view-details' data-tooltip-content="View Details">
                                                        <IoEyeOutline className='icon' onClick={() => handleQuickView(item)} />
                                                    </div>
                                                    <div data-tooltip-id='add-to-wishlist' data-tooltip-content="Add To Wishlist">
                                                        <IoMdHeartEmpty className='icon' onClick={() => handleWishlist(item)} />
                                                    </div>

                                                    <Tooltip id="view-details"
                                                        place="top"
                                                        style={{ backgroundColor: '#000', color: '#fff', borderRadius: '0px', width: '90px', height: '30px', fontSize: '11px',cursor:'pointer'  }} />
                                                    <Tooltip id="add-to-wishlist"
                                                        place="top"
                                                        style={{ backgroundColor: '#000', color: '#fff', borderRadius: '0px', width: '90px', height: '30px', fontSize: '11px',cursor:'pointer' }} />

                                                </div>
                                            </div>

                                            <div className='about_product_detail'>
                                                <div className='productslide_detail'>

                                                    <Link to={`product/${item.slug}`}>
                                                        <h4>{item.name}</h4>

                                                    </Link>
                                                    <div className="price_section">
                                                        <p>₹{currentPrice}</p>
                                                        <span className='discount_price'>₹{actualPrice}</span>
                                                    </div>

                                                    {item.productType === 'variable' && (
                                                        <div className="variant_tabs">
                                                            {item.variant?.map((variant, index) => (
                                                                <button
                                                                    key={index}
                                                                    className={`variant_btn ${selectVariant[item._id]?.variantName === variant.variantName ? 'active' : ''}`}
                                                                    onClick={() => handleVariantClick(item._id, variant)}
                                                                >
                                                                    {variant.variantName}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}

                                                    <div className='rating_review'>
                                                        <MdOutlineStarPurple500 color='#ffa51f' />
                                                        <MdOutlineStarPurple500 color='#ffa51f' />
                                                        <MdOutlineStarPurple500 color='#ffa51f' />
                                                        <MdOutlineStarPurple500 color='#ffa51f' />
                                                    </div>
                                                </div>

                                                <div className="cart_btn">
                                                    <Link onClick={() => handleAddToCart(item)}>Add To Cart</Link>
                                                </div>

                                            </div>
                                        </div>
                                    </SwiperSlide>
                                );
                            })
                        }
                    </Swiper>
                    }
                </div>
            </div>
        </div>
    )
}

export default ProductSlider