// src/pages/OrderHistory.jsx
import { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../Context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

import '../assets/Css/OrderHistory.css';

const OrderHistory = () => {
  const { user, backend_url } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.email){ 
          navigate('/login');
        return};
      
      try {
        setLoading(true);
        const response = await axios.get(`${backend_url}/api/order/user-order/${user.email}`);
        
        if (response.data.success) {
          setOrders(response.data.orders);
        } else {
          toast.error(response.data.message || 'Failed to fetch orders');
        }
      } catch (error) {
        toast.error('Error fetching orders');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, backend_url]);

  if (loading) {
    return (
      <div className="order-history-loading">
        <div className="spinner"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="order-history-container">
      <div className="order-history-header">
        <h1>Your Order History</h1>
        <p>Review your past purchases and order details</p>
      </div>
      
      {orders.length === 0 ? (
        <div className="empty-orders">
          <div className="empty-icon">🛒</div>
          <h3>No Orders Yet</h3>
          <p>You haven't placed any orders with us yet.</p>
          <Link to="/" className="continue-shopping-btn">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-card-header">
                <div>
                  <span className="order-id">Order #{order.order_id}</span><br></br>
                  <span className={`order-status ${order.order_status}`}>
                    {order.order_status}
                  </span>
                </div>
                <span className="order-date">
                  {new Date(order.order_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              
              <div className="order-card-body">
                {order.order_items.slice(0, 2).map((item, index) => (
                  <div key={index} className="order-item-preview">
                    <img 
                      src={`${backend_url}${item.image}`} 
                      alt={item.name} 
                      className="item-image"
                    />
                    <div className="item-details">
                      <p className="item-name">{item.name}</p>
                      <p className="item-quantity">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
                {order.order_items.length > 2 && (
                  <div className="more-items">
                    +{order.order_items.length - 2} more items
                  </div>
                )}
              </div>
              
              <div className="order-card-footer">
                <div className="order-total">
                  Total: <span>₹{order.order_total.toFixed(2)}</span>
                </div>
                <button 
                  onClick={() => setSelectedOrder(order)}
                  className="view-details-btn"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="order-details-modal">
          <div className="modal-overlay" onClick={() => setSelectedOrder(null)}></div>
          <div className="modal-content">
            <div className="modal-header">
              <h2>Order Details</h2>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="close-modal"
              >
                &times;
              </button>
            </div>
            
            <div className="order-summary">
              <div className="summary-section">
                <h3>Order Information</h3>
                <div className="summary-grid">
                  <div>
                    <p className="summary-label">Order Number</p>
                    <p className="summary-value">{selectedOrder.order_id}</p>
                  </div>
                  <div>
                    <p className="summary-label">Order Date</p>
                    <p className="summary-value">
                      {new Date(selectedOrder.order_date).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="summary-label">Order Status</p>
                    <p className={`summary-value status ${selectedOrder.order_status}`}>
                      {selectedOrder.order_status}
                    </p>
                  </div>
                  <div>
                    <p className="summary-label">Payment Method</p>
                    <p className="summary-value">
                      {selectedOrder.payment_method.toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="summary-section">
                <h3>Delivery Information</h3>
                <div className="delivery-info">
                  <p>{selectedOrder.customerDetails.firstName} {selectedOrder.customerDetails.lastName}</p>
                  <p>{selectedOrder.customerDetails.address}</p>
                  <p>{selectedOrder.customerDetails.city}, {selectedOrder.customerDetails.state} {selectedOrder.customerDetails.pincode}</p>
                  <p>{selectedOrder.customerDetails.country}</p>
                  <p>Phone: {selectedOrder.customerDetails.phone}</p>
                  <p>Email: {selectedOrder.customerDetails.email}</p>
                </div>
              </div>
            </div>
            
            <div className="order-items">
              <h3>Order Items ({selectedOrder.order_items.length})</h3>
              <div className="items-list">
                {selectedOrder.order_items.map((item, index) => (
                  <div key={index} className="item-card">
                    <img 
                      src={`${backend_url}${item.image}`} 
                      alt={item.name} 
                      className="item-image"
                    />
                    <div className="item-info">
                      <h4>{item.name}</h4>
                      {item.variantName && (
                        <p className="item-variant">Variant: {item.variantName}</p>
                      )}
                      <p className="item-price">₹{item.price.toFixed(2)} × {item.quantity}</p>
                    </div>
                    <div className="item-total">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="order-totals">
              <div className="totals-row">
                <span>Subtotal</span>
                <span>₹{selectedOrder.order_total.toFixed(2)}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="totals-row discount">
                  <span>Discount</span>
                  <span>-₹{selectedOrder.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="totals-row grand-total">
                <span>Total</span>
                <span>₹{selectedOrder.order_total.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                onClick={() => setSelectedOrder(null)}
                className="close-btn"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;