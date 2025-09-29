import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiPrinter, FiMail, FiRefreshCw } from 'react-icons/fi';
import { FaBoxOpen, FaShippingFast, FaCheckCircle, FaTimesCircle, FaMoneyBillWave } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const backend_url = import.meta.env.VITE_BACKEND_URL;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backend_url}/api/order/get/${id}`);
        setOrder(response.data.data);
      } catch (error) {
        console.error('Error fetching order:', error);
        toast.error('Failed to load order details');
        navigate('/orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, backend_url, navigate]);


  

  // Update order status
const updateOrderStatus = async (newStatus) => {
  try {
    setUpdatingStatus(true);
    await axios.put(`${backend_url}/api/order/updatestatus/${id}`, {
      status: newStatus
    });
    
    // Update the local state to reflect the change
    setOrder(prevOrder => ({
      ...prevOrder,
      order_status: newStatus,
      // Add any other fields that might change with status update
    }));
    
    toast.success('Order status updated successfully');
  } catch (error) {
    console.error('Error updating status:', error);
    toast.error('Failed to update order status');
  } finally {
    setUpdatingStatus(false);
  }
};

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: <FiRefreshCw className="mr-1" /> },
      processing: { color: 'bg-blue-100 text-blue-800', icon: <FaBoxOpen className="mr-1" /> },
      shipped: { color: 'bg-purple-100 text-purple-800', icon: <FaShippingFast className="mr-1" /> },
      delivered: { color: 'bg-green-100 text-green-800', icon: <FaCheckCircle className="mr-1" /> },
      cancelled: { color: 'bg-red-100 text-red-800', icon: <FaTimesCircle className="mr-1" /> }
    };
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig[status]?.color || 'bg-gray-100 text-gray-800'}`}>
        {statusConfig[status]?.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-gray-600">Order not found</p>
        <button 
          onClick={() => navigate('/admin/orders')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/orders')}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <FiChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-semibold text-gray-800">
            Order : #<span className="text-blue-600">{order.order_id}</span>
          </h2>
        </div>
        <div className="flex items-center gap-3 hidden">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
            <FiPrinter className="text-sm" />
            <span>Print</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <FiMail className="text-sm" />
            <span>Email Customer</span>
          </button>
        </div>
      </div>

      {/* Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Left Column - Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Card */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Status</h3>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <StatusBadge status={order.order_status} />
              <div className="flex items-center gap-3">
                <select
                  value={order.order_status}
                  onChange={(e) => updateOrderStatus(e.target.value)}
                  disabled={updatingStatus}
                  className="block w-full pl-3 pr-8 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                {updatingStatus && (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                )}
              </div>
            </div>
          </div>

          {/* Items Card */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <h3 className="px-6 py-4 border-b border-gray-200 text-lg font-medium text-gray-900">
              Order Items ({order.order_items.length})
            </h3>
            <div className="divide-y divide-gray-200">
              {order.order_items.map((item, index) => (
                <div key={index} className="p-6 flex flex-col sm:flex-row gap-4">
                  <div className="flex-shrink-0">
                    <img
                      src={`${backend_url}${item.image}`}
                      alt={item.name}
                      className="h-20 w-20 rounded-md object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">
                      {item.name}
                      {item.variantName && (
                        <span className="text-gray-500 ml-1">({item.variantName})</span>
                      )}
                    </h4>
                    <p className="mt-1 text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">₹{item.price.toFixed(2)} each</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between text-sm font-medium text-gray-900">
                <span>Subtotal</span>
                <span>₹{(order.order_total + order.discount).toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>Discount ({order.coupon_code})</span>
                  <span>-₹{order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-gray-900 mt-2 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>₹{order.order_total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Customer and Shipping */}
        <div className="space-y-6">
          {/* Customer Card */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Customer</h3>
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  {order.customerDetails.firstName} {order.customerDetails.lastName}
                </h4>
                <p className="text-sm text-gray-500">{order.customerDetails.email}</p>
                <p className="text-sm text-gray-500">{order.customerDetails.phone}</p>
              </div>
              {order.customerDetails.userId && (
                <button
                  onClick={() => navigate(`/admin/customers/${order.customerDetails.userId}`)}
                  className="text-sm text-blue-600 hover:text-blue-800 hidden"
                >
                  View Customer Profile
                </button>
              )}
            </div>
          </div>

          {/* Shipping Card */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Information</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>{order.customerDetails.address}</p>
              <p>
                {order.customerDetails.city}, {order.customerDetails.state} {order.customerDetails.pincode}
              </p>
              <p>{order.customerDetails.country}</p>
            </div>
          </div>

          {/* Payment Card */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h3>
            <div className="flex items-center gap-2 mb-2">
              {order.payment_method === 'cod' ? (
                <FaMoneyBillWave className="text-gray-500" />
              ) : (
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                  {order.payment_method === 'razorpay' ? 'R' : 'O'}
                </div>
              )}
              <span className="text-sm font-medium">
                {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-block w-3 h-3 rounded-full ${
                order.payment_status === 'paid' ? 'bg-green-500' : 'bg-yellow-500'
              }`}></span>
              <span className="text-sm capitalize">
                {order.payment_status}
              </span>
            </div>
          </div>

          {/* Timeline Card */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hidden">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Timeline</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-800">
                    <FiRefreshCw className="h-4 w-4" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Order Placed</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.order_date).toLocaleString()}
                  </p>
                </div>
              </div>
              {order.order_status !== 'pending' && (
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-800">
                      <FaBoxOpen className="h-4 w-4" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Status Updated</p>
                    <p className="text-sm text-gray-500">
                      {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;