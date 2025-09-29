import React from 'react'
import '../assets/Css/Checkout.css'
import { useContext } from 'react'
import { ShopContext } from '../Context/ShopContext'
import { RxCross2 } from "react-icons/rx";
import { useState } from 'react';
import rasorpay from '../assets/Image/icon/raserpay_icon.png'
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
    const navigate = useNavigate();
    const [showCoupon, setShowCoupon] = useState(false)
    const [selectedPayment, setSelectedPayment] = useState('cod')
    const [appliedCoupon, setAppliedCoupon] = useState(null)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        pincode: '',
        phone: '',
        city: '',
        state: '',
        country: '',
        address: ''
    })

    const { cart, removeCart, coupons, user, backend_url } = useContext(ShopContext)

   

    const formatCouponDescription = (coupon) => {
        if (coupon.discounttype === 'percentage') {
            return `${coupon.discount}% off`;
        } else {
            return `₹${coupon.discount} off`;
        }
    };

    const applyCoupon = (coupon) => {
        setAppliedCoupon(coupon);
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
    };

    const calculateDiscount = () => {
        if (!appliedCoupon) return 0;
        
        const subtotal = cart.reduce((acc, item) => acc + item.quantity * item.discountPrice, 0);
        
        if (appliedCoupon.discounttype === 'percentage') {
            return (subtotal * appliedCoupon.discount) / 100;
        } else {
            return appliedCoupon.discount;
        }
    };

    const Subtotal = cart.reduce((acc, item) => acc + item.quantity * item.discountPrice, 0)
    const discount = calculateDiscount();
    const totalPrice = Subtotal - discount;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (cart.length === 0) {
            alert('Your cart is empty');
            return;
        }

        // Validate form
        for (const key in formData) {
            if (formData[key].trim() === '') {
                alert(`Please fill in ${key}`);
                return;
            }
        }

        const orderData = {
            order_id: `ORD-${Date.now()}`,
            order_date: new Date(),
            order_status: 'pending',
            order_total: totalPrice,
            discount: discount,
            coupon_applied: appliedCoupon ? 'yes' : 'no',
            coupon_code: appliedCoupon ? appliedCoupon.couponCode : '',
            order_items: cart.map(item => ({
                productId: item.id,
                name: item.name,
                variantName: item.variantName ? item.variantName : '',
                quantity: item.quantity,
                price: item.discountPrice,
                image: item.thumbImg
            })),
            customerDetails: {
                ...formData,
                userId: user ? user._id : null  // Include user ID if logged in, otherwise null
            },
            payment_method: selectedPayment,
            payment_status: selectedPayment === 'cod' ? 'pending' : 'pending'
        };

        try {
            const response = await fetch(`${backend_url}/api/order/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });

            const data = await response.json();
            
            if (response.ok) {
                // Handle successful order
                localStorage.removeItem('cartData');
                navigate('/order-confirmation', { 
                    state: { 
                        orderData: orderData,
                        orderId: data.order_id 
                    } 
                });
            } else {
                throw new Error(data.message || 'Failed to place order');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order. Please try again.');
        }
    };

    return (
        <div className='checkout_container'>
            <div className="container">
                <div className="checkout_wrapper">
                    <div className="col-half">
                        <div className="order_summery">
                            <h3>Order Summery</h3>
                            <div className="all_order">
                                {cart.map((item, id) => (
                                    <div key={id} className='cart_overflow'>
                                        <div className="cart_item">
                                            <img src={`${backend_url}${item.thumbImg}`} width="70px" height="75px" alt={item.name} />
                                            <div className='remove_icon' onClick={() => removeCart(item.id, item.variantName)}> 
                                                <RxCross2 size={12} /> 
                                            </div>
                                            <div className="cart_details">
                                                <p className='cart_name'> {item.name}</p>
                                                <p className='variantName '>
                                                    {item.variantName}
                                                </p>
                                                <div className="quantity_number">
                                                    <p>Qty -{item.quantity}</p>
                                                    <p className='price'>
                                                        ₹ {item.discountPrice * item.quantity}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="discount_coupon">
                                <div className='main_heading' onClick={() => setShowCoupon(!showCoupon)}>
                                    <div>
                                        <h4>
                                            {appliedCoupon ? 'Applied Coupon' : 'Get Discount Code'}
                                        </h4>
                                        {appliedCoupon && (
                                            <p>
                                                {appliedCoupon.couponCode} - {formatCouponDescription(appliedCoupon)}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <IoIosArrowDropdownCircle className='icon' />
                                    </div>
                                </div>
                                <ul>
                                    {showCoupon && (
                                        appliedCoupon ? (
                                            <li className='coupon_item'>
                                                <div className="coupon_details">
                                                    <div>
                                                        <strong>{appliedCoupon.couponCode}</strong> – {formatCouponDescription(appliedCoupon)}
                                                    </div>
                                                </div>
                                                <button onClick={removeCoupon} className='apply_btn'>
                                                    Remove
                                                </button>
                                            </li>
                                        ) : (
                                            coupons.map((coupon, _id) => (
                                                <li key={_id} className='coupon_item'>
                                                    <div className="coupon_details">
                                                        <div>
                                                            <strong>{coupon.couponCode}</strong> – {formatCouponDescription(coupon)}
                                                        </div>
                                                    </div>
                                                    <button onClick={() => applyCoupon(coupon)} className='apply_btn'>
                                                        Apply now
                                                    </button>
                                                </li>
                                            ))
                                        )
                                    )}
                                </ul>
                            </div>

                            <div className="total_amount">
                                <div className="price_show">
                                    <ul>
                                        <li>Subtotal</li>
                                        <li>₹{Subtotal}</li>
                                    </ul>
                                    <ul>
                                        <li>Shipping</li>
                                        <li>Free</li>
                                    </ul>
                                    {discount > 0 && (
                                        <ul>
                                            <li>Discount</li>
                                            <li>₹{discount}</li>
                                        </ul>
                                    )}
                                </div>

                                <div className="actual_total_amount">
                                    <ul>
                                        <li>Total</li>
                                        <li>₹{totalPrice}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-half">
                        <div className="checkout_form">
                            <h3>Billing Address</h3>
                            <form id='form' onSubmit={handleSubmit}>
                                <div className="form_group w-50">
                                    <input 
                                        type="text" 
                                        className='form_control' 
                                        placeholder='First Name' 
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        required 
                                    />
                                </div>
                                <div className="form_group w-50">
                                    <input 
                                        type="text" 
                                        className='form_control' 
                                        placeholder='Last Name' 
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        required 
                                    />
                                </div>
                                <div className="form_group w-50">
                                    <input 
                                        type="email" 
                                        className='form_control' 
                                        placeholder='Enter Email' 
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required 
                                    />
                                </div>
                                <div className="form_group w-50">
                                    <input 
                                        type="tel" 
                                        className='form_control' 
                                        required 
                                        placeholder='Enter Pin Code'
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form_group w-50">
                                    <input 
                                        type="tel" 
                                        className='form_control' 
                                        required 
                                        placeholder='Enter Number'
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form_group w-50">
                                    <input 
                                        type="text" 
                                        className='form_control' 
                                        required 
                                        placeholder='City Name'
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form_group w-50">
                                    <input 
                                        type="text" 
                                        className='form_control' 
                                        required 
                                        placeholder='State Name'
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form_group w-50">
                                    <input 
                                        type="text" 
                                        className='form_control' 
                                        required 
                                        placeholder='Country Name'
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form_group w-100">
                                    <input 
                                        type="text" 
                                        className='form_control' 
                                        required 
                                        placeholder='Enter Address'
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </form>
                        </div>

                        <div className="payment_method">
                            <h3>Payment Method</h3>
                            <div 
                                className={`radio_btn ${selectedPayment === 'cod' ? 'select' : ''}`} 
                                onClick={() => setSelectedPayment('cod')}
                            >
                                <input 
                                    type="radio" 
                                    value="cod" 
                                    name='chkpayment'  
                                    checked={selectedPayment === 'cod'} 
                                    readOnly 
                                />
                                Cash On Delivery
                            </div>
{/* 
                            <div 
                                className={`radio_btn ${selectedPayment === 'razorpay' ? 'select' : ''}`} 
                                onClick={() => setSelectedPayment('razorpay')}
                            >
                                <input 
                                    type="radio" 
                                    value="razorpay" 
                                    name='chkpayment' 
                                    readOnly 
                                    checked={selectedPayment === 'razorpay'} 
                                />
                                <img src={rasorpay} width="120px" alt="razorpay" />
                            </div> */}

                            <button type='submit' form='form' className='place_order_btn'>
                                Place Order
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout