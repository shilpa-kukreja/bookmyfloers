
import React, { useContext, useEffect } from 'react';
import { ShopContext } from '../Context/ShopContext';
import '../assets/Css/ProductSlider.css';





import Modal from 'react-modal';
import { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/thumbs';
import { useNavigate } from 'react-router-dom';

import { RxCross2 } from "react-icons/rx";

import { IoShareSocial } from "react-icons/io5";
import { LuMinus } from "react-icons/lu";
import { GoPlus } from "react-icons/go";



import icons from '../assets/Image/icon/Dhoop_Sticks.png'






const QuickView = () => {

    const { handleQuickView, quickViewOpen, quickViewProduct, addToCart, increseQuantity, decreaseQuantity, closeQuickView, backend_url} = useContext(ShopContext);
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const navigate = useNavigate()
    const mainSwiperRef = useRef(null);
    const [selectVariant, setSelectVariant] = useState(null);



    useEffect(() => {
        if (
            quickViewProduct?.productType === 'variable' &&
            Array.isArray(quickViewProduct.variant) &&
            quickViewProduct.variant.length > 0
        ) {
            setSelectVariant(quickViewProduct.variant[0]);
        }
    }, [quickViewProduct]);




    const handleVariantClick = (variant) => {
        setSelectVariant(variant);
    };

    // const handleVariantSelect = (variant) => {
    //   setSelectVariant(variant);
    // };







    // console.log("Quickviewproduct", quickViewProduct)

    const images = [
        ...(quickViewProduct?.image ? [quickViewProduct.image] : []),
        ...(quickViewProduct?.galleryImage || [])
    ];


    //  for zoomed img 

    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [modalImg, setModalImg] = useState('')


    // Open modal with clicked image
    const openModal = (img) => {
        setModalImg(img)
        setModalIsOpen(true)
    }

    // Close modal
    const closeModal = () => setModalIsOpen(false)

    const [quantity, setQuantity] = useState(1)

    const handleIncrease = () => {
        setQuantity(quantity + 1);
        increseQuantity(id, selectVariant?.variantName)
    };

    const handleDecrease = () => {
        if (quantity > 1) {

            setQuantity(quantity - 1);
            decreaseQuantity(id, selectVariant?.variantName)
        }
    };

    const handleAddToCart = (item, isBuyNow = false) => {
        if (item.productType === 'variable' && !selectVariant) {
            alert("Please select a variant");
            return;
        }


        const variant = item.productType === 'variable' ? selectVariant : null;

        addToCart(item, variant, quantity);

        if (isBuyNow) {
            navigate('/checkout');
        }

        closeQuickView();
    };


    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Check out this product!',
                text: 'Take a look at this awesome product:',
                url: window.location.href, // current product URL
            })
                .then(() => console.log('Product shared successfully'))
                .catch((error) => console.error('Sharing failed', error));
        } else {
            // Fallback for browsers that don't support Web Share API
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };

    let currentPrice = quickViewProduct?.discountPrice || quickViewProduct?.price || 0;
    let actualPrice = quickViewProduct?.actualPrice || 0;

    if (quickViewProduct?.productType === 'variable' && selectVariant) {
        currentPrice = selectVariant.discountPrice || currentPrice;
        actualPrice = selectVariant.actualPrice || actualPrice;
    }



    useEffect(() => {
        document.body.style.overflow = quickViewOpen ? 'hidden' : 'auto';
    }, [quickViewOpen]);

    if (!quickViewOpen) return null;

    // console.log("QuickViewProduct:", quickViewProduct);


    return (
        <>
            <div className="cart_overlay" onClick={closeQuickView} ></div>

            <div className="quick_view_overlay quick_view_container active" onClick={() => handleQuickView(null)}>
                <div className="quickview-modal" onClick={e => e.stopPropagation()}>
                    <button className="close-btn" onClick={closeQuickView} > <RxCross2 className='icon' />   </button>



                    {/* detail comp */}

                    <div className="productDetail_section">
                        <div className="col-half">
                            <div className="">


                                <div className="mainproductImg w-100">
                                    <Swiper
                                        ref={mainSwiperRef}
                                        spaceBetween={10}

                                        modules={[Thumbs]}
                                        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                                        className='mainSwiper'
                                    >

                                        {images.map((img, idx) => (
                                            <SwiperSlide key={idx}>
                                                <img src={`${backend_url}${img}`} alt={`Product ${idx}`} style={{ cursor: 'zoom-in' }} onClick={() => openModal(img)} className="mainImg" width="100%" />
                                            </SwiperSlide>
                                        ))}

                                    </Swiper>


                                    <Swiper
                                        onSwiper={setThumbsSwiper}
                                        spaceBetween={10}
                                        slidesPerView={4}
                                        watchSlidesProgress={true}
                                        slideToClickedSlide={true}
                                        className="thumbSwiper"
                                    >

                                        {images.map((img, idx) => (
                                            <SwiperSlide key={idx}>
                                                <img src={`${backend_url}${img}`} alt={`Thumb ${idx}`} className="thumbImg" width="100%" />
                                            </SwiperSlide>
                                        ))}

                                    </Swiper>

                                    <Modal
                                        isOpen={modalIsOpen}
                                        onRequestClose={closeModal}
                                        contentLabel="Zoomed Image"
                                        style={{
                                            overlay: {
                                                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                                                zIndex: 1000,
                                            },
                                            content: {
                                                top: '50%',
                                                left: '50%',
                                                right: 'auto',
                                                bottom: 'auto',
                                                marginRight: '-50%',
                                                transform: 'translate(-50%, -50%)',
                                                maxWidth: '90vw',
                                                maxHeight: '90vh',
                                                padding: 0,
                                                border: 'none',
                                                background: 'transparent',
                                                overflow: 'hidden',
                                            },
                                        }}
                                    >
                                        <button
                                            onClick={closeModal}
                                            style={{
                                                position: 'absolute',
                                                top: 10,
                                                right: 10,
                                                fontSize: 30,
                                                color: 'white',
                                                background: 'transparent',
                                                border: 'none',
                                                cursor: 'pointer',
                                                zIndex: 10,
                                                fontWeight: 'bold',
                                                lineHeight: 1,
                                            }}
                                            aria-label="Close zoomed image"
                                        >
                                            &times;
                                        </button>
                                        <img
                                            src={modalImg}
                                            alt="Zoomed product"
                                            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 4 }}
                                        />
                                    </Modal>
                                </div>


                            </div>

                        </div>
                        <div className="col-half">



                            <div className="quick_view_product_details">

                                <h2>{quickViewProduct.name}</h2>
                                              <hr style={{
                                                margin: '15px 0'
                                              }} />
                                 <div 
                                    className='para'
                                    dangerouslySetInnerHTML={{ __html: quickViewProduct.description }} 
                                    />

                                     <hr style={{
                                                margin : '15px 0'
                                              }} />
                                                        
                                {
                                    quickViewProduct.productType === 'simple' && (

                                        <>


                                            <div className="mrp">

                                                MRP <span>(inclusive of all taxes)</span>
                                            </div>
                                            <div className="price_section">
                                                <p className='actualPrice'>₹{quickViewProduct.discountedPrice}</p>
                                                <span className='discount_price'>₹{quickViewProduct.mrp}</span>

                                            </div>
                                        </>
                                    )
                                }

                                {quickViewProduct.productType === 'variable' && (
                                    <div className="select_fragnance">
                                        <h3>Select Fragrance</h3>
                                        <div className="variant_tabs">
                                            {quickViewProduct.variant?.map((variant, index) => (
                                                <button
                                                    key={index}
                                                    className={`variant_btn ${selectVariant?.variantName === variant.variantName ? 'active' : ''}`}
                                                    onClick={() => handleVariantClick(variant)}
                                                >
                                                    {variant.variantName}
                                                </button>
                                            ))}
                                        </div>

                                        {selectVariant && (
                                            <div className="price_section">
                                                <p><strong>Selected Price:</strong> ₹{selectVariant.discountPrice}</p>
                                                <span className='discount_price'>₹{selectVariant.actualPrice}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className='quantity_counter '>
                                    <span>Quantity :</span>


                                    <div className="quantity">


                                        <div className="minus buttons" onClick={handleDecrease} >
                                            <LuMinus className='icon ' />
                                        </div>

                                        <div className="quantity_number buttons">
                                            <input type="number" value={quantity} onChange={(e) => handleQuantity(Number(e.target.value))} min='1' required />
                                        </div>

                                        <div className="Plus buttons" onClick={handleIncrease}>
                                            <GoPlus className='icon' />
                                        </div>


                                    </div>
                                </div>

                                <div className='details_icons'>
                                    <img src={icons} width='300px' alt="icons" />
                                </div>

                                <div className="add_to_cart">
                                    <button className='add_to_cart_btn ' onClick={() => handleAddToCart(quickViewProduct, false)}>
                                        ADD TO CART
                                    </button>

                                    <button onClick={() => handleAddToCart(quickViewProduct, true)}    >
                                        BUY NOW
                                    </button>

                                </div>
                                <div className='categotyName'>
                                    Product Type:{quickViewProduct.category}
                                </div>
                                <div className='categotyName'>
                                    SKU:{quickViewProduct.sku}
                                </div>
                                <div className="shareNow" onClick={handleShare} style={{ cursor: 'pointer' }}>
                                    Share This Product : <IoShareSocial className='icon' />
                                </div>
                            </div>





                        </div>



                    </div>






                    {/*  detail comp */}
                </div>
            </div>
        </>
    );
};

export default QuickView;
