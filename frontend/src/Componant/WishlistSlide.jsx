import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../Context/ShopContext';
import '../assets/Css/Cart.css';
import { RxCross2 } from "react-icons/rx";
import { BsCartPlus } from "react-icons/bs";
import { RiCouponFill } from "react-icons/ri";
import cartgif from '../assets/Image/icon/empty-cart-new.svg';
import { MdOutlineContentCopy } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const WishlistSlide = () => {
    const navigate = useNavigate();
    const { wishlist, toggleWishlist, showWishlist, removeWishlist, addToCart, coupons, setCoupons, loadingCoupons, 
    setLoadingCoupons, backend_url } = useContext(ShopContext);
    const [activeTab, setActiveTab] = useState('wishlist');
    const [copiedCode, setCopiedCode] = useState('');
   
    console .log(wishlist);
    

    useEffect(() => {
        document.body.style.overflow = showWishlist ? 'hidden' : 'auto';
    }, [showWishlist]);

    const handleCopy = async (code) => {
        try {
            await navigator.clipboard.writeText(code);
            setCopiedCode(code);
            setTimeout(() => setCopiedCode(''), 3500);
            // toast.success('Coupon code copied!');
        } catch (err) {
            console.error('Failed to copy:', err);
            toast.error('Failed to copy coupon code');
        }
    };

    const handleAddToCart = (item) => {
        addToCart(item, item);        
        removeWishlist(item._id);
        toggleWishlist();          
    };

    const totalPrice = wishlist.reduce((acc, item) => acc + item.quantity * item.discountPrice, 0);

    const formatCouponDescription = (coupon) => {
        if (coupon.discounttype === 'percentage') {
            return `${coupon.discount}% off`;
        } else {
            return `₹${coupon.discount} off`;
        }
    };

    return (
        <div className='cart_container'>
            {showWishlist && <div className='cart_overlay' onClick={toggleWishlist}> </div>}

            <div className={`cart_sidebar ${showWishlist ? 'active' : ''}`}>
                <div className="title">
                    <h2>Shopping Wishlist</h2>
                    <div className='removeCart' onClick={toggleWishlist}> 
                        <RxCross2 color='red' size={12} /> close 
                    </div>
                </div>

                <div className="cart_tabs">
                    <button
                        className={activeTab === 'wishlist' ? 'active' : ''}
                        onClick={() => setActiveTab('wishlist')}
                    >
                        <BsCartPlus /> Wishlist Items
                    </button>
                    <button
                        className={activeTab === 'coupon' ? 'active' : ''}
                        onClick={() => setActiveTab('coupon')}
                    >
                        <RiCouponFill />
                        Coupons
                    </button>
                </div>

                <div className="cart_body">
                    {activeTab === 'wishlist' ? (
                        wishlist.length === 0 ? (
                            <div className="empty_message">
                                <div>
                                    <img src={cartgif} width="300px" alt="" />
                                    <p>Your shopping Wishlist is empty.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="cart_items_scroll">
                                {wishlist.map((item, id) => (
                                    <div key={id} className="cart_item">
                                        <img src={`${backend_url}${item.image}`} width="80px" height="auto" alt={item.name} />
                                        <div className="cart_details">
                                            <div className="cartProductName">
                                                <h4>{item.name}</h4>
                                                <div onClick={() => removeWishlist(item.id)}> 
                                                    <RxCross2 color='red' size={12} /> 
                                                </div>
                                            </div>

                                            <div className="">
                                                <p className="variantName">{item.variantName}</p>
                                            </div>

                                            <div className="disc_price">
                                                <button onClick={() => handleAddToCart(item)}>
                                                    Add To Cart 
                                                </button>
                                                <div className="price">
                                                    ₹{item.discountPrice}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    ) : (
                        <div className="coupon_list">
                            {loadingCoupons ? (
                                <div className="loading_message">Loading coupons...</div>
                            ) : coupons.length === 0 ? (
                                <div className="empty_message">
                                    <p>No active coupons available</p>
                                </div>
                            ) : (
                                coupons.map((coupon) => (
                                    <div key={coupon._id}>
                                        <div className="coupon_details">
                                            <div>
                                                <strong>{coupon.couponCode}</strong> – {formatCouponDescription(coupon)}
                                            </div>
                                            <span 
                                                className='coupon_copy' 
                                                onClick={() => handleCopy(coupon.couponCode)}
                                            >
                                                {copiedCode === coupon.couponCode ? ' ✔ Copied' : <MdOutlineContentCopy />}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                <div className="total_price">
                    <div className="price">
                        Total : ₹{totalPrice}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WishlistSlide;