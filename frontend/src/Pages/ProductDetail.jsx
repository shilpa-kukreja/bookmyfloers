import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import topbanner from '../assets/Image/bookmyshow/logo/mainbanner/topbanner.jpg'
import { useContext } from 'react'
import { ShopContext } from '../Context/ShopContext'
import { MdOutlineStarPurple500 } from "react-icons/md";
import { SwiperSlide, Swiper } from 'swiper/react'
import { Thumbs } from 'swiper/modules'
import Modal from 'react-modal';
import 'swiper/css'
import 'swiper/css/thumbs'
import { IoShareSocial } from "react-icons/io5";
import { LuMinus } from "react-icons/lu";
import { GoPlus } from "react-icons/go";
import IncenseProcess from './IncenseProcess'

import productdetailbanner from '../assets/Image/bookmyshow/logo/mainbanner/topbanner/products detailsbanner.jpg'
import { IoMdHeartEmpty } from "react-icons/io";
import icons from '../assets/Image/icon/Dhoop_Sticks.png'
import RelatedProduct from './RelatedProduct'
import { useNavigate } from 'react-router-dom'
import '../assets/Css/ProductSlider.css'

const ProductDetail = () => {

    const { slug } = useParams()

    const { product, addToCart, wishlist, addToWishlist, increseQuantity, decreaseQuantity, backend_url } = useContext(ShopContext)

    const [fetchProduct, setFetchProduct] = useState(null)
    const [selectVariant, setSelectVariant] = useState({})
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    const navigate = useNavigate()

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


    const handleWishlist = (item) => {
        const selected = item.productType === 'variable' ? selectVariant : null;

        if (item.productType === 'variable' && !selected?.variantName) {
            alert("Please select a variant");
            return;
        }

        
        addToWishlist(item, selected);
    };

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

    useEffect(() => {
        const findProduct = product.find((p) => String(p.slug) === slug)
        setFetchProduct(findProduct)

        if (findProduct?.productType === 'variable' && findProduct.variant?.length) {
            setSelectVariant(findProduct.variant[0])

        }

    }, [slug, product])



    const handleAddToCart = (item, isBuyNow = false) => {


        if (item.productType === 'variable' && !selectVariant?.variantName) {
            alert("Please select a variant");
            return;
        }
        const selectedVariant = item.productType === 'variable' ? selectVariant : null;
        addToCart(item, selectedVariant, quantity);

        if (isBuyNow) {
            navigate('/checkout');
        }
    };


    // product share 

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Check out this product!',
                text: 'Take a look at this awesome product:',
                url: window.location.href,
            })
                .then(() => console.log('Product shared successfully'))
                .catch((error) => console.error('Sharing failed', error));
        } else {
            // Fallback for browsers that don't support Web Share API
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };





    if (!fetchProduct) {
        return <div>Loading...</div>;
    }

    const handleVariantSelect = (variant) => {
        setSelectVariant(variant)
    }

    const images = [fetchProduct.image, ...(fetchProduct.galleryImage || [])];

    // console.log("fetch Product", fetchProduct);

    return (
        <>

            <div className='productDetail_wrapper'>
                <img src={productdetailbanner} width='100%' alt="aboutus banner" />


                <div className="container">
                    <div className="productDetail_section">
                        <div className="col-half">
                            <div className="productImg_wrapper">




                                <div className="thumbnail_img">
                                    <Swiper
                                        onSwiper={setThumbsSwiper}
                                        spaceBetween={10}
                                        direction="vertical"
                                        slidesPerView={4}
                                        watchSlidesProgress={true}
                                        slideToClickedSlide={true}
                                        className="thumbSwiper"
                                        breakpoints={{
                                            0: {
                                                direction: 'horizontal', // Mobile (under 768px)
                                            },
                                            768: {
                                                direction: 'vertical',   // Tablet & Desktop (768px and up)
                                            }
                                        }}
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
                                                right: 15,
                                                fontSize: 32,
                                                color: 'black',
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
                                            src={`${backend_url}${modalImg}`}
                                            alt="Zoomed product"
                                            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 4 }}
                                        />
                                    </Modal>
                                </div>

                                <div className="mainproductImg">
                                    <Swiper
                                        spaceBetween={10}
                                        thumbs={{ swiper: thumbsSwiper }}
                                        modules={[Thumbs]}
                                        className='mainSwiper'
                                    >

                                        {images.map((img, idx) => (
                                            <SwiperSlide key={idx}>
                                                <img src={`${backend_url}${img}`} alt={`Product ${idx}`} style={{ cursor: 'zoom-in' }} onClick={() => openModal(img)} className="mainImg" width="100%" />

                                                <div className="wishlist_icon" onClick={() => handleWishlist(fetchProduct)} >
                                                    <IoMdHeartEmpty className='icon' />
                                                </div>

                                            </SwiperSlide>
                                        ))}

                                    </Swiper>
                                </div>




                            </div>

                        </div>
                        <div className="col-half">

                            <div className="product_detailpage_contant">



                                <div className='rating_review'>
                                    <MdOutlineStarPurple500 color='#ffa51f' />
                                    <MdOutlineStarPurple500 color='#ffa51f' />
                                    <MdOutlineStarPurple500 color='#ffa51f' />
                                    <MdOutlineStarPurple500 color='#ffa51f' />
                                </div>

                                <h2>{fetchProduct.name}</h2>
                                     <div className=''  dangerouslySetInnerHTML={{ __html: fetchProduct.description }} 
                                        />
                                
                                {/* <p className='subtitle'>{fetchProduct.description}</p> */}


                                {
                                    fetchProduct.productType === 'simple' && (

                                        <>
                                            <div className="mrp">

                                                MRP <span>(inclusive of all taxes)</span>
                                            </div>
                                            <div className="price_section">
                                                <p className='actualPrice'>₹{fetchProduct.discountedPrice}</p>
                                                <span className='discount_price'>₹{fetchProduct.mrp}</span>

                                            </div>
                                        </>
                                    )
                                }


                                {
                                    fetchProduct.productType === 'variable' && (

                                        <div className="select_fragnance">
                                            <h3>Select Fragnance </h3>

                                            <div className="variant_tabs">
                                                {fetchProduct.variant?.map((variant, index) => (
                                                    <button
                                                        key={index}
                                                        className={`variant_btn ${selectVariant?.variantName === variant.variantName ? 'active' : ''}`}
                                                        onClick={() => handleVariantSelect(variant)}
                                                    >
                                                        {variant.variantName}
                                                    </button>
                                                ))}


                                            </div>
                                            {selectVariant && (
                                                <div className="price_section">
                                                    <p><strong>Selected Price:</strong> ₹{selectVariant.discountPrice}</p> <span className='discount_price'>₹{selectVariant.actualPrice}</span>
                                                </div>
                                            )}
                                        </div>
                                    )
                                }

                                <div className='categotyName'>
                                    <b>   Product Type : </b>{fetchProduct.categoryId.map((category) => category.name).join(', ')}
                                
                         
                                </div>
                                <div className='categotyName'>
                                    <b>  SKU : </b>{fetchProduct.sku}
                                </div>

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

                                {/* <div className='details_icons'>
                                    <img src={icons} width='300px' alt="icons" />
                                </div> */}



                                <div className="add_to_cart">
                                    <button className='add_to_cart_btn ' onClick={() => handleAddToCart(fetchProduct, false)} >
                                        ADD TO CART
                                    </button>

                                    <button className='buy_name_btn' onClick={() => handleAddToCart(fetchProduct, true)}   >
                                        BUY NOW
                                    </button>

                                </div>
                                <div className="shareNow" onClick={handleShare} style={{ cursor: 'pointer' }}>
                                    Share This Product : <IoShareSocial className='icon' />
                                </div>


                            </div>



                        </div>



                    </div>



                </div>

                <div className="product_desription">
                    <div className='container'>

                        <div>
                            <div className='agarbatti_img'>
                               
                                <h2>  Product Description </h2>
                            </div>

                        </div>

                         <div  dangerouslySetInnerHTML={{ __html: fetchProduct.description }} 
                                         />

                        {/* <p>
                            {fetchProduct.description}
                        </p> */}
                    </div>


                </div>

            </div>

            {/*  incense process */}

            {/* <IncenseProcess /> */}

            <RelatedProduct />





        </>
    )
}

export default ProductDetail
