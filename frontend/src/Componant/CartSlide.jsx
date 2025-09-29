import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../Context/ShopContext';
import '../assets/Css/Cart.css';
import { RxCross2 } from "react-icons/rx";
import { BsCartPlus } from "react-icons/bs";
import { RiCouponFill } from "react-icons/ri";
import cartgif from '../assets/Image/icon/empty-cart-new.svg';
import { Link } from 'react-router-dom';
import { MdOutlineContentCopy } from "react-icons/md";
import { toast } from 'react-toastify';

const CartSlide = () => {
    const { 
        cart, 
        increseQuantity, 
        decreaseQuantity, 
        toggleCart, 
        showCart, 
        removeCart,
        coupons,
        loadingCoupons,
        backend_url
    } = useContext(ShopContext);
    
    const [activeTab, setActiveTab] = useState('cart');
    const [copiedCode, setCopiedCode] = useState('');

    useEffect(() => {
        document.body.style.overflow = showCart ? 'hidden' : 'auto';
    }, [showCart]);

    const totalPrice = cart.reduce((acc, item) => acc + item.quantity * item.discountPrice, 0);

    const handleCopy = async (code) => {
        try {
            await navigator.clipboard.writeText(code);
            setCopiedCode(code);
            setTimeout(() => setCopiedCode(''), 3500);
            toast.success('Coupon code copied!');
        } catch (err) {
            console.error('Failed to copy:', err);
            toast.error('Failed to copy coupon code');
        }
    };

    const formatCouponDescription = (coupon) => {
        if (coupon.discounttype === 'percentage') {
            return `${coupon.discount}% off`;
        } else {
            return `₹${coupon.discount} off`;
        }
    };

    return (
        <div className='cart_container'>
            {showCart && <div className='cart_overlay' onClick={toggleCart}> </div>}

            <div className={`cart_sidebar ${showCart ? 'active' : ''}`}>
                <div className="title">
                    <h2>Shopping Cart</h2>
                    <div className='removeCart' onClick={toggleCart}> 
                        <RxCross2 color='red' size={12} /> close 
                    </div>
                </div>

                <div className="cart_tabs">
                    <button
                        className={activeTab === 'cart' ? 'active' : ''}
                        onClick={() => setActiveTab('cart')}
                    >
                        <BsCartPlus /> Cart Items
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
                    {activeTab === 'cart' ? (
                        cart.length === 0 ? (
                            <div className="empty_message">
                                <div>
                                    <img src={cartgif} width="300px" alt="" />
                                    <p>Your shopping cart is empty.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="cart_items_scroll">
                                {cart.map((item) => (
                                    <div key={`${item.id}-${item.variantName}`} className="cart_item">
                                        <img src={`${backend_url}${item.thumbImg}`} width="80px" height="auto" alt={item.name} />
                                        <div className="cart_details">
                                            <div className="cartProductName">
                                                <h4>{item.name}</h4>
                                                <div onClick={() => removeCart(item.id, item.variantName)}> 
                                                    <RxCross2 color='red' size={12} /> 
                                                </div>
                                            </div>

                                            <p className='variantName'>
                                                {item.variantName}
                                            </p>

                                            <div className="disc_price">
                                                <div className="qty_buttons">
                                                    <button onClick={() => decreaseQuantity(item.id, item.variantName)}>-</button>
                                                    <div className="quantity_number">
                                                        <p>{item.quantity}</p>
                                                    </div>
                                                    <button onClick={() => increseQuantity(item.id, item.variantName)}>+</button>
                                                </div>
                                                <div className="price">
                                                    <p>₹{(item.discountPrice * item.quantity).toLocaleString('en-IN')}</p>
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
                        Total : ₹{totalPrice.toLocaleString('en-IN')}
                    </div>
                    <div className="checkout_button">
                        <Link to='/checkout' onClick={toggleCart}>CheckOut</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartSlide;