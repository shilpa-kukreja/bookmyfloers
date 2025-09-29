import { useState, useEffect } from 'react';
import { FiBox, FiDollarSign, FiShoppingCart, FiUsers, FiTrendingUp, FiClock } from 'react-icons/fi';
import { FaShippingFast, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    newCustomers: 0,
    conversionRate: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const backend_url = import.meta.env.VITE_BACKEND_URL;

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, ordersRes] = await Promise.all([
          axios.get(`${backend_url}/api/order/stats`),
          axios.get(`${backend_url}/api/order/recentOrders/10`)
        ]);
        
        setStats(statsRes.data);
        setRecentOrders(ordersRes.data.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [backend_url]);

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: <FiClock className="mr-1" /> },
      processing: { color: 'bg-blue-100 text-blue-800', icon: <FiBox className="mr-1" /> },
      shipped: { color: 'bg-purple-100 text-purple-800', icon: <FaShippingFast className="mr-1" /> },
      delivered: { color: 'bg-green-100 text-green-800', icon: <FaCheckCircle className="mr-1" /> },
      cancelled: { color: 'bg-red-100 text-red-800', icon: <FaTimesCircle className="mr-1" /> }
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusConfig[status]?.color || 'bg-gray-100 text-gray-800'}`}>
        {statusConfig[status]?.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        <span className="text-sm text-gray-500">Last updated: {new Date().toLocaleString()}</span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {/* Total Orders */}
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="p-3 rounded-full bg-blue-50 text-blue-600 mr-4">
            <FiShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Orders</p>
            <p className="text-2xl font-semibold text-gray-800">
              {loading ? '--' : stats.totalOrders.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">All time orders</p>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="p-3 rounded-full bg-green-50 text-green-600 mr-4">
            <FiDollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
            <p className="text-2xl font-semibold text-gray-800">
              {loading ? '--' : `₹${stats.totalRevenue.toLocaleString()}`}
            </p>
            <p className="text-xs text-gray-500 mt-1">All time revenue</p>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="p-3 rounded-full bg-yellow-50 text-yellow-600 mr-4">
            <FiClock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Orders</p>
            <p className="text-2xl font-semibold text-gray-800">
              {loading ? '--' : stats.pendingOrders.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">Require action</p>
          </div>
        </div>

        {/* Completed Orders */}
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="p-3 rounded-full bg-purple-50 text-purple-600 mr-4">
            <FaCheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Completed Orders</p>
            <p className="text-2xl font-semibold text-gray-800">
              {loading ? '--' : stats.completedOrders.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">Delivered successfully</p>
          </div>
        </div>

        {/* New Customers */}
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="p-3 rounded-full bg-indigo-50 text-indigo-600 mr-4">
            <FiUsers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">New Customers</p>
            <p className="text-2xl font-semibold text-gray-800">
              {loading ? '--' : stats.newCustomers.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white rounded-lg shadow p-6 flex items-center hidden">
          <div className="p-3 rounded-full bg-teal-50 text-teal-600 mr-4">
            <FiTrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
            <p className="text-2xl font-semibold text-gray-800">
              {loading ? '--' : `${stats.conversionRate}%`}
            </p>
            <p className="text-xs text-gray-500 mt-1">Visitor to customer</p>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
          <p className="text-sm text-gray-500">Latest 10 orders from your store</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  </td>
                </tr>
              ) : recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      #{order.order_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <p className="font-medium">{order.customerDetails?.firstName} {order.customerDetails?.lastName}</p>
                        <p className="text-gray-500 text-xs">{order.customerDetails?.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.order_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{order.order_total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <StatusBadge status={order.order_status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        order.payment_status === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.payment_method === 'cod' ? 'COD' : 'Online'} - {order.payment_status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No recent orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 text-right">
          <a 
            href="/orders" 
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            View all orders →
          </a>
        </div>
      </div>

      {/* Additional Dashboard Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 hidden">
        {/* Sales Chart (Placeholder) */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Sales Overview</h3>
            <select className="text-sm border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="h-64 bg-gray-50 rounded flex items-center justify-center text-gray-400">
            [Sales Chart Placeholder]
          </div>
        </div>

        {/* Top Products (Placeholder) */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Top Selling Products</h3>
            <select className="text-sm border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option>This Month</option>
              <option>Last Month</option>
              <option>All Time</option>
            </select>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded mr-4"></div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Product {item}</span>
                    <span className="text-sm text-gray-500">₹{item * 1000}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full" 
                      style={{ width: `${100 - (item * 15)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;