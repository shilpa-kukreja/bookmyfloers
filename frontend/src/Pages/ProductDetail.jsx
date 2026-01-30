import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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
import { IoMdHeartEmpty } from "react-icons/io";
import RelatedProduct from './RelatedProduct'
import '../assets/Css/ProductSlider.css'
import axios from 'axios';

// Import your images
import productdetailbanner from '../assets/Image/bookmyshow/logo/mainbanner/topbanner/products detailsbanner.jpg'

const ProductDetail = () => {
    const { slug } = useParams()
    const { product, addToCart, wishlist, addToWishlist, increseQuantity, decreaseQuantity, backend_url } = useContext(ShopContext)
    const navigate = useNavigate()
    
    const [fetchProduct, setFetchProduct] = useState(null)
    const [selectVariant, setSelectVariant] = useState({})
    const [thumbsSwiper, setThumbsSwiper] = useState(null)
    const [serviceablePincode, setServiceablePincode] = useState('')
    const [pincodeMessage, setPincodeMessage] = useState('')
    const [pincodeMessageType, setPincodeMessageType] = useState('') // 'success' or 'error'
    const [quantity, setQuantity] = useState(1)
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [modalImg, setModalImg] = useState('')
    const [isCheckingPincode, setIsCheckingPincode] = useState(false)

    const handleIncrease = () => {
        setQuantity(quantity + 1);
        increseQuantity(fetchProduct?._id, selectVariant?.variantName)
    };

    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
            decreaseQuantity(fetchProduct?._id, selectVariant?.variantName)
        }
    };

    const handleQuantity = (value) => {
        if (value >= 1) {
            setQuantity(value);
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

    // For zoomed img 
    const openModal = (img) => {
        setModalImg(img)
        setModalIsOpen(true)
    }

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

    // Product share 
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: fetchProduct?.name || 'Check out this product!',
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

    const handleVariantSelect = (variant) => {
        setSelectVariant(variant)
    }

    // Pincode check function
    const handleCheckServiceablePincode = async () => {
        const pincode = serviceablePincode.trim();
        
        if (!pincode) {
            setPincodeMessage('Please enter a pincode');
            setPincodeMessageType('error');
            return;
        }
        
        if (!/^\d{6}$/.test(pincode)) {
            setPincodeMessage('Please enter a valid 6-digit pincode');
            setPincodeMessageType('error');
            return;
        }
        
        try {
            setIsCheckingPincode(true);
            setPincodeMessage('Checking pincode...');
            setPincodeMessageType('info');
            
            const response = await axios.post(`${backend_url}/api/pincode/check-pincode`, { 
                pincode: parseInt(pincode) 
            });
            
            console.log('Pincode check response:', response.data);
            
            if (response.data.status === 'success') {
                setPincodeMessage(`✅ ${response.data.message}`);
                setPincodeMessageType('success');
            } else {
                setPincodeMessage(`❌ ${response.data.message}`);
                setPincodeMessageType('error');
            }
            
            // Clear message after 5 seconds
            setTimeout(() => {
                setPincodeMessage('');
                setPincodeMessageType('');
            }, 5000);
            
        } catch (error) {
            console.error('Error checking pincode:', error);
            setPincodeMessage('❌ Error checking pincode. Please try again.');
            setPincodeMessageType('error');
            
            // Clear message after 5 seconds
            setTimeout(() => {
                setPincodeMessage('');
                setPincodeMessageType('');
            }, 5000);
        } finally {
            setIsCheckingPincode(false);
        }
    };

    if (!fetchProduct) {
        return <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>;
    }

    const images = [fetchProduct.image, ...(fetchProduct.galleryImage || [])];

    return (
        <>
            <div className='productDetail_wrapper'>
                <img src={productdetailbanner} width='100%' alt="product detail banner" />
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
                                        className="thumbSwiper "
                                        breakpoints={{
                                            0: {
                                                direction: 'horizontal',
                                            },
                                            768: {
                                                direction: 'vertical',
                                            }
                                        }}
                                    >
                                        {images.map((img, idx) => (
                                            <SwiperSlide key={idx}>
                                                <img 
                                                    src={`${backend_url}${img}`} 
                                                    alt={`Thumb ${idx}`} 
                                                    className="thumbImg" 
                                                    width="100%" 
                                                />
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
                                                <img 
                                                    src={`${backend_url}${img}`} 
                                                    alt={`Product ${idx}`} 
                                                    style={{ cursor: 'zoom-in' }} 
                                                    onClick={() => openModal(img)} 
                                                    className="mainImg" 
                                                    width="100%" 
                                                />
                                                <div className="wishlist_icon" onClick={() => handleWishlist(fetchProduct)}>
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
                                    <MdOutlineStarPurple500 color='#ffa51f' />
                                    <span className='review_count'>(25 reviews)</span>
                                </div>

                                <h2 className='product_name'>{fetchProduct.name}</h2>
                                
                                {fetchProduct.shortDescription && (
                                    <div className='short-description' 
                                         dangerouslySetInnerHTML={{ __html: fetchProduct.shortDescription }} 
                                    />
                                )}

                                {fetchProduct.productType === 'simple' && (
                                    <>
                                        <div className="mrp">
                                            MRP <span>(inclusive of all taxes)</span>
                                        </div>
                                        <div className="price_section">
                                            <p className='actualPrice'>₹{fetchProduct.discountedPrice}</p>
                                            <span className='discount_price'>₹{fetchProduct.mrp}</span>
                                        </div>
                                    </>
                                )}

                                {fetchProduct.productType === 'variable' && (
                                    <div className="select_fragnance">
                                        <h3>Select Fragrance</h3>
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
                                                <p className='actualPrice'><strong>Price:</strong> ₹{selectVariant.discountPrice}</p>
                                                <span className='discount_price'>₹{selectVariant.actualPrice}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className='categotyName'>
                                    <b>Product Type:</b> {fetchProduct.categoryId?.map((category) => category.name).join(', ') || 'N/A'}
                                </div>
                                <div className='categotyName'>
                                    <b>SKU:</b> {fetchProduct.sku}
                                </div>

                                <div className='quantity_counter'>
                                    <span>Quantity:</span>
                                    <div className="quantity">
                                        <div className="minus buttons" onClick={handleDecrease}>
                                            <LuMinus className='icon' />
                                        </div>
                                        <div className="quantity_number buttons">
                                            <input 
                                                type="number" 
                                                value={quantity} 
                                                onChange={(e) => handleQuantity(Number(e.target.value))} 
                                                min='1' 
                                            />
                                        </div>
                                        <div className="Plus buttons" onClick={handleIncrease}>
                                            <GoPlus className='icon' />
                                        </div>
                                    </div>
                                </div>

                                <div className="add_to_cart">
                                    <button className='add_to_cart_btn' onClick={() => handleAddToCart(fetchProduct, false)}>
                                        ADD TO CART
                                    </button>
                                    <button className='buy_now_btn' onClick={() => handleAddToCart(fetchProduct, true)}>
                                        BUY NOW
                                    </button>
                                </div>
                                
                                <div className="shareNow" onClick={handleShare} style={{ cursor: 'pointer' }}>
                                    Share This Product: <IoShareSocial className='icon' />
                                </div>
                                
                                <div className='serviablepincode'>
                                    <h4>Check Serviceable Pincode</h4>
                                    <div className='serviable_pincode_box'>
                                        <input 
                                            type="text" 
                                            className='serviceable_pincode' 
                                            placeholder='Enter 6-digit pincode' 
                                            value={serviceablePincode}
                                            onChange={(e) => setServiceablePincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                            maxLength={6}
                                        />
                                        <button 
                                            onClick={handleCheckServiceablePincode}
                                            disabled={isCheckingPincode || !serviceablePincode || serviceablePincode.length !== 6}
                                            className={isCheckingPincode ? 'checking' : ''}
                                        >
                                            {isCheckingPincode ? 'Checking...' : 'Check'}
                                        </button>
                                    </div>
                                    
                                    {pincodeMessage && (
                                        <div className={`pincode-message ${pincodeMessageType}`}>
                                            {pincodeMessage}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="product_desription">
                    <div className='container'>
                        <div className='agarbatti_img'>
                            <h2>Product Description</h2>
                        </div>
                        {fetchProduct.description && (
                            <div className='description-content' 
                                 dangerouslySetInnerHTML={{ __html: fetchProduct.description }} 
                            />
                        )}
                    </div>
                </div>
            </div>

            <RelatedProduct />
        </>
    )
}

export default ProductDetail