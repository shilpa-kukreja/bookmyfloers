import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const EditCoupon = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState(null);
  const [expiryDate, setExpiryDate] = useState(null);

  const backend_url = import.meta.env.VITE_BACKEND_URL;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm();

  const discountType = watch('discounttype');

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backend_url}/api/coupons/get/${id}`);
        setCoupon(response.data.data);
        setValue('couponCode', response.data.data.couponCode);
        setValue('discount', response.data.data.discount);
        setValue('discounttype', response.data.data.discounttype);
        setValue('minPurchaseAmount', response.data.data.minPurchaseAmount);
        setValue('maxDiscountAmount', response.data.data.maxDiscountAmount);
        setValue('isActive', response.data.data.isActive.toString());
        setExpiryDate(new Date(response.data.data.expiryDate));
      } catch (error) {
        console.error('Error fetching coupon:', error);
        toast.error('Failed to load coupon data');
        navigate('/coupons');
      } finally {
        setLoading(false);
      }
    };

    fetchCoupon();
  }, [id, backend_url, navigate, setValue]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      const couponData = {
        ...data,
        expiryDate,
        isActive: data.isActive === 'true',
        minPurchaseAmount: Number(data.minPurchaseAmount),
        maxDiscountAmount: data.maxDiscountAmount ? Number(data.maxDiscountAmount) : undefined
      };

      await axios.put(`${backend_url}/api/coupons/edit/${id}`, couponData);

      toast.success('Coupon updated successfully!');
      navigate('/coupons');
    } catch (error) {
      console.error('Error updating coupon:', error);
      toast.error(error.response?.data?.message || 'Failed to update coupon');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !coupon) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!coupon) {
    return null;
  }

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-800">Edit Coupon</h1>
        <button
          onClick={() => navigate('/coupons')}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          Back to Coupons
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Coupon Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Coupon Code <span className="text-red-500">*</span>
            </label>
            <input
              {...register('couponCode', { 
                required: 'Coupon code is required',
                pattern: {
                  value: /^[A-Z0-9]+$/,
                  message: 'Only uppercase letters and numbers allowed'
                }
              })}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.couponCode ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
              }`}
              placeholder="e.g. SUMMER20"
            />
            {errors.couponCode && (
              <p className="mt-1 text-sm text-red-600">{errors.couponCode.message}</p>
            )}
          </div>

          {/* Discount Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount Type <span className="text-red-500">*</span>
            </label>
            <select
              {...register('discounttype', { required: 'Discount type is required' })}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.discounttype ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
              }`}
            >
              <option value="">Select type</option>
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
            {errors.discounttype && (
              <p className="mt-1 text-sm text-red-600">{errors.discounttype.message}</p>
            )}
          </div>

          {/* Discount Value */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount {discountType === 'percentage' ? '(%)' : 'Amount'} <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              {...register('discount', { 
                required: 'Discount is required',
                min: {
                  value: discountType === 'percentage' ? 1 : 0,
                  message: discountType === 'percentage' ? 'Must be at least 1%' : 'Must be positive'
                },
                max: discountType === 'percentage' ? 100 : undefined
              })}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.discount ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
              }`}
              placeholder={discountType === 'percentage' ? 'e.g. 20' : 'e.g. 50'}
            />
            {errors.discount && (
              <p className="mt-1 text-sm text-red-600">{errors.discount.message}</p>
            )}
          </div>

          {/* Max Discount Amount */}
          {discountType === 'percentage' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Discount Amount
              </label>
              <input
                type="number"
                {...register('maxDiscountAmount', { 
                  min: {
                    value: 0,
                    message: 'Must be positive'
                  }
                })}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.maxDiscountAmount ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                }`}
                placeholder="e.g. 100 (optional)"
              />
              {errors.maxDiscountAmount && (
                <p className="mt-1 text-sm text-red-600">{errors.maxDiscountAmount.message}</p>
              )}
            </div>
          )}

          {/* Minimum Purchase */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Purchase <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              {...register('minPurchaseAmount', { 
                required: 'Minimum purchase amount is required',
                min: {
                  value: 0,
                  message: 'Must be zero or positive'
                },
                valueAsNumber: true
              })}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.minPurchaseAmount ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
              }`}
              placeholder="e.g. 100"
            />
            {errors.minPurchaseAmount && (
              <p className="mt-1 text-sm text-red-600">{errors.minPurchaseAmount.message}</p>
            )}
          </div>

          {/* Expiry Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date <span className="text-red-500">*</span>
            </label>
            <DatePicker
              selected={expiryDate}
              onChange={(date) => {
                setExpiryDate(date);
                setValue('expiryDate', date);
              }}
              minDate={new Date()}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.expiryDate ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
              }`}
              required
            />
          </div>

          {/* Active Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              {...register('isActive')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/coupons')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Updating...' : 'Update Coupon'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCoupon;