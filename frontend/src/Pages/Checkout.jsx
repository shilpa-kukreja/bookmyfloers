import React, { useState, useContext, useEffect } from 'react'
import '../assets/Css/Checkout.css'
import { ShopContext } from '../Context/ShopContext'
import { RxCross2 } from "react-icons/rx";
import rasorpay from '../assets/Image/icon/raserpay_icon.png'
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiXCircle, FiLoader } from "react-icons/fi";

const Checkout = () => {
    const navigate = useNavigate();
    const { cart, removeCart, coupons, user, backend_url } = useContext(ShopContext)
    
    // State variables
    const [showCoupon, setShowCoupon] = useState(false)
    const [selectedPayment, setSelectedPayment] = useState('cod')
    const [appliedCoupon, setAppliedCoupon] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isCheckingPincode, setIsCheckingPincode] = useState(false)
    const [pincodeStatus, setPincodeStatus] = useState(null) // null, 'valid', 'invalid'
    const [pincodeMessage, setPincodeMessage] = useState('')
    const [pincodeChecked, setPincodeChecked] = useState(false)
    
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        pincode: '',
        phone: '',
        city: '',
        state: '',
        country: 'India',
        address: ''
    })

    // Calculate totals
    const Subtotal = cart.reduce((acc, item) => acc + item.quantity * item.discountPrice, 0)
    
    const formatCouponDescription = (coupon) => {
        if (coupon.discounttype === 'percentage') {
            return `${coupon.discount}% off`;
        } else {
            return `₹${coupon.discount} off`;
        }
    };

    const calculateDiscount = () => {
        if (!appliedCoupon) return 0;
        
        if (appliedCoupon.discounttype === 'percentage') {
            return (Subtotal * appliedCoupon.discount) / 100;
        } else {
            return appliedCoupon.discount;
        }
    };

    const discount = calculateDiscount();
    const totalPrice = Subtotal - discount;

    // Apply/Remove coupon functions
    const applyCoupon = (coupon) => {
        setAppliedCoupon(coupon);
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Special handling for pincode
        if (name === 'pincode') {
            const numericValue = value.replace(/\D/g, '').slice(0, 6);
            setFormData(prev => ({
                ...prev,
                [name]: numericValue
            }));
            
            // Reset pincode validation if pincode changes
            if (numericValue.length === 6 && numericValue !== formData.pincode) {
                setPincodeStatus(null);
                setPincodeMessage('');
                setPincodeChecked(false);
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // Check pincode validity
    const checkPincodeValidity = async () => {
        const pincode = formData.pincode.trim();
        
        if (!pincode || pincode.length !== 6) {
            setPincodeMessage('Please enter a valid 6-digit pincode');
            setPincodeStatus('invalid');
            setPincodeChecked(true);
            return;
        }
        
        try {
            setIsCheckingPincode(true);
            setPincodeMessage('Checking pincode...');
            setPincodeStatus(null);
            
            const response = await fetch(`${backend_url}/api/pincode/check-pincode`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ pincode: parseInt(pincode) })
            });
            
            const data = await response.json();
            
            if (data.status === 'success') {
                setPincodeStatus('valid');
                setPincodeMessage(' Pincode is serviceable');
                setPincodeChecked(true);
            } else {
                setPincodeStatus('invalid');
                setPincodeMessage(data.message || ' Pincode is not serviceable');
                setPincodeChecked(true);
            }
        } catch (error) {
            console.error('Error checking pincode:', error);
            setPincodeStatus('invalid');
            setPincodeMessage(' Error checking pincode');
            setPincodeChecked(true);
        } finally {
            setIsCheckingPincode(false);
        }
    };

    // Auto-check pincode when it reaches 6 digits
    useEffect(() => {
        if (formData.pincode.length === 6 && !pincodeChecked) {
            const timer = setTimeout(() => {
                checkPincodeValidity();
            }, 500);
            
            return () => clearTimeout(timer);
        }
    }, [formData.pincode]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation checks
        if (cart.length === 0) {
            alert('Your cart is empty');
            return;
        }

        // Check if pincode is valid
        if (!pincodeChecked) {
            alert('Please wait while we check your pincode');
            return;
        }

        if (pincodeStatus !== 'valid') {
            alert('Please enter a serviceable pincode to place your order');
            return;
        }

        // Validate required fields
        const requiredFields = ['firstName', 'lastName', 'email', 'pincode', 'phone', 'city', 'state', 'country', 'address'];
        for (const field of requiredFields) {
            if (!formData[field]?.trim()) {
                alert(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
                return;
            }
        }

        setIsLoading(true);

        // Prepare order data
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
                userId: user ? user._id : null
            },
            payment_method: selectedPayment,
            payment_status: selectedPayment === 'cod' ? 'pending' : 'pending',
            pincode_validated: true,
            pincode_validation_date: new Date()
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
                // Clear cart and navigate to confirmation
                setTimeout(() => {
                    localStorage.removeItem('cartData');
                    navigate('/order-confirmation', { 
                        state: { 
                            orderData: orderData,
                            orderId: data.order_id 
                        } 
                    });
                    setIsLoading(false);
                }, 1000);
            } else {
                throw new Error(data.message || 'Failed to place order');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order. Please try again.');
            setIsLoading(false);
        }
    };

    // Loader Component
    const Loader = () => (
        <div className="loader-overlay">
            <div className="loader-container">
                <div className="loader-spinner"></div>
                <div className="loader-content">
                    <h3>Processing Your Order</h3>
                    <p>Please wait while we confirm your order details...</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className='checkout_container'>
            {isLoading && <Loader />}
            
            <div className="container">
                <div className="checkout_wrapper">
                    {/* Order Summary Section */}
                    <div className="col-half">
                        <div className="order_summery">
                            <h3>Order Summary</h3>
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

                            {/* Coupon Section */}
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
                                        <IoIosArrowDropdownCircle className={`icon ${showCoupon ? 'rotate' : ''}`} />
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
                                                <button onClick={removeCoupon} className='apply_btn remove'>
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

                            {/* Price Summary */}
                            <div className="total_amount">
                                <div className="price_show">
                                    <ul>
                                        <li>Subtotal</li>
                                        <li>₹{Subtotal.toFixed(2)}</li>
                                    </ul>
                                    <ul>
                                        <li>Shipping</li>
                                        <li>Free</li>
                                    </ul>
                                    {discount > 0 && (
                                        <ul>
                                            <li>Discount</li>
                                            <li>-₹{discount.toFixed(2)}</li>
                                        </ul>
                                    )}
                                </div>

                                <div className="actual_total_amount">
                                    <ul>
                                        <li>Total</li>
                                        <li>₹{totalPrice.toFixed(2)}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Billing & Payment Section */}
                    <div className="col-half">
                        <div className="checkout_form">
                            <h3>Billing Address</h3>
                            <form id='form' onSubmit={handleSubmit}>
                                {/* Name Fields */}
                                <div className="form_group w-50">
                                    <input 
                                        type="text" 
                                        className='form_control' 
                                        placeholder='First Name *' 
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
                                        placeholder='Last Name *' 
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        required 
                                    />
                                </div>
                                
                                {/* Contact Fields */}
                                <div className="form_group w-50">
                                    <input 
                                        type="email" 
                                        className='form_control' 
                                        placeholder='Email Address *' 
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
                                        placeholder='Phone Number *'
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        pattern="[0-9]{10}"
                                        maxLength="10"
                                        required 
                                    />
                                </div>
                                
                                {/* Pincode Field with Validation */}
                                <div className="form_group w-50">
                                    <div className="pincode-input-wrapper">
                                        <input 
                                            type="text" 
                                            className={`form_control ${pincodeStatus ? `pincode-${pincodeStatus}` : ''}`}
                                            placeholder='Pincode *'
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleInputChange}
                                            maxLength="6"
                                            required 
                                        />
                                    <div className="pincode-icon" style={{display : 'flex', alignItems : 'center'}}>
                                        {isCheckingPincode && (
                               
                                                <FiLoader className="spin" style={{marginTop : '5px'}} />
                                          
                                        )}
                                        {pincodeStatus === 'valid' && (
                                        
                                                <FiCheckCircle style={{marginTop : '5px'}} />
                           
                                        )}
                                        {pincodeStatus === 'invalid' && (
                                          
                                                <FiXCircle style={{marginTop : '5px'}} />
                                         
                                        )}
                                        {pincodeMessage && (
                                             <div className={`pincode-message ${pincodeStatus === 'invalid' ? 'error' : 'valid'}`}>
                                                {pincodeMessage}
                                                {pincodeStatus === 'invalid' && !isCheckingPincode && (
                                                    <></>
                                                )}
                                            </div>
                                        )}
                                        </div>
                                    </div>
                                    
                                </div>
                                
                                {/* Location Fields */}
                                <div className="form_group w-50">
                                    <input 
                                        type="text" 
                                        className='form_control' 
                                        placeholder='City *'
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        required 
                                    />
                                </div>
                                <div className="form_group w-50">
                                    <input 
                                        type="text" 
                                        className='form_control' 
                                        placeholder='State *'
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        required 
                                    />
                                </div>
                                <div className="form_group w-50">
                                    <input 
                                        type="text" 
                                        className='form_control' 
                                        placeholder='Country *'
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        required 
                                    />
                                </div>
                                <div className="form_group w-100">
                                    <textarea 
                                        className='form_control address-textarea' 
                                        placeholder='Complete Address *'
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        rows="3"
                                        required 
                                    />
                                </div>
                            </form>
                        </div>
                          {/* Pincode Warning */}
                            {pincodeChecked && pincodeStatus !== 'valid' && (
                                <div className="pincode-warning " style={{color:'red'}}>
                                    <FiXCircle />
                                    <span>Please enter a serviceable pincode to place your order</span>
                                </div>
                            )}
                        {/* Payment Method Section */}
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

                            {/* Order Button with Validation */}
                            <button 
                                type='submit' 
                                form='form' 
                                className={`place_order_btn ${pincodeStatus !== 'valid' ? 'disabled' : ''}`}
                                disabled={isLoading || pincodeStatus !== 'valid'}
                                title={pincodeStatus !== 'valid' ? 'Please enter a valid serviceable pincode' : ''}
                            >
                                {isLoading ? (
                                    <>
                                        <FiLoader className="spin" /> Processing...
                                    </>
                                ) : (
                                    'Place Order'
                                )}
                            </button>
                            
                          
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout