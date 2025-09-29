import React from 'react';
import { useLocation, Link, useNavigate,  } from 'react-router-dom';
import { FiCheckCircle, FiPackage, FiUser, FiCreditCard, FiMapPin, FiCalendar } from 'react-icons/fi';
import '../assets/Css/OrderConfirmation.css';
import { useContext } from 'react'
import { ShopContext } from '../Context/ShopContext';

const OrderConfirmation = () => {
    const {backend_url } = useContext(ShopContext);
    const { state } = useLocation();
    const order = state?.orderData || {};
    const customer = order.customerDetails || {};
    const navigate = useNavigate();
    if(!state){
        navigate('/');
    }

    if (!state) {
        return (
            <div className="order-confirmation-container">
                <div className="no-order-found">
                    <h2>No Order Found</h2>
                    <p>We couldn't find your order details. Please check your order history or contact support.</p>
                    <Link to="/" className="continue-shopping-btn">Continue Shopping</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="order-confirmation-container">
            <div className="confirmation-card">
                <div className="confirmation-header">
                    <FiCheckCircle className="success-icon" />
                    <h1>Order Confirmed!</h1>
                    <p className="order-number">Order #: {order.order_id}</p>
                    <p className="confirmation-message">Thank you for your purchase. We've sent a confirmation email to {customer.email}</p>
                </div>

                <div className="order-details-grid">
                 
                    {/* Customer Information */}
                    <div className="detail-section">
                        <h3><FiUser className="section-icon" /> Customer Information</h3>
                        <div >
                            <div  className=''>
                                <p className="info-label">Name</p>
                                <p className="info-value">{customer.firstName} {customer.lastName}</p>
                            </div>
                            <div>
                                <p className="info-label">Email</p>
                                <p className="info-value">{customer.email}</p>
                            </div>
                            <div>
                                <p className="info-label">Phone</p>
                                <p className="info-value">{customer.phone}</p>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="detail-section">
                        <h3><FiMapPin className="section-icon" /> Shipping Address</h3>
                        <div className="address-details">
                            <p>{customer.address}</p>
                            <p>{customer.city}, {customer.state}</p>
                            <p>{customer.country} - {customer.pincode}</p>
                        </div>
                    </div>

                    {/* Payment Information */}
                    <div className="detail-section">
                        <h3><FiCreditCard className="section-icon" /> Payment Information</h3>
                        <div className="payment-details">
                            <p className="payment-method">
                                Method: {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                            </p>
                            <p className="payment-status">
                                Status: <span className={`status-${order.payment_status}`}>
                                    {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                                </span>
                            </p>
                        </div>
                    </div>

                       {/* Order Summary */}
                    <div className="detail-section">
                        <h3><FiPackage className="section-icon" /> Order Summary</h3>
                        <div className="order-items">
                            {order.order_items?.map((item, index) => (
                                <div key={index} className="order-item">
                                    <div className="item-image">
                                        <img src={`${backend_url}${item.image}`} alt={item.name} />
                                    </div>
                                    <div className="item-details">
                                        <p className="item-name">{item.name}  {item.variantName ? `(${item.variantName})` : ''}</p>
                                        <p className="item-quantity">Qty: {item.quantity}</p>
                                        <p className="item-price">₹{item.price * item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="order-totals">
                            <div className="total-row">
                                <span>Subtotal:</span>
                                <span>₹{order.order_total + order.discount}</span>
                            </div>
                            {order.discount > 0 && (
                                <div className="total-row discount">
                                    <span>Discount ({order.coupon_code}):</span>
                                    <span>-₹{order.discount}</span>
                                </div>
                            )}
                            <div className="total-row grand-total">
                                <span>Total:</span>
                                <span>₹{order.order_total}</span>
                            </div>
                        </div>
                    </div>


                    {/* Order Timeline */}
                    {/* <div className="detail-section">
                        <h3><FiCalendar className="section-icon" /> Order Timeline</h3>
                        <div className="timeline">
                            <div className="timeline-item active">
                                <div className="timeline-dot"></div>
                                <div className="timeline-content">
                                    <p className="timeline-title">Order Placed</p>
                                    <p className="timeline-date">{new Date(order.order_date).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="timeline-item">
                                <div className="timeline-dot"></div>
                                <div className="timeline-content">
                                    <p className="timeline-title">Processing</p>
                                    <p className="timeline-date">Expected: Within 24 hours</p>
                                </div>
                            </div>
                            <div className="timeline-item">
                                <div className="timeline-dot"></div>
                                <div className="timeline-content">
                                    <p className="timeline-title">Shipped</p>
                                    <p className="timeline-date">--</p>
                                </div>
                            </div>
                            <div className="timeline-item">
                                <div className="timeline-dot"></div>
                                <div className="timeline-content">
                                    <p className="timeline-title">Delivered</p>
                                    <p className="timeline-date">--</p>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>

                <div className="action-buttons">
                    <Link to="/" className="continue-shopping-btn">Continue Shopping</Link>
                    {/* <Link to="/orders" className="view-orders-btn">View All Orders</Link> */}
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;