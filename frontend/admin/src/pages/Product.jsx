import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiChevronLeft, FiChevronRight, FiDownload, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    limit: 20
  });
  const [loading, setLoading] = useState(false);
  const backend_url = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [pagination.currentPage, pagination.limit]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${backend_url}/api/product/all`, {
        page: pagination.currentPage,
        limit: pagination.limit
      });
      
      // Make sure the response contains the expected data structure
      if (response.data && response.data.products) {
        setProducts(response.data.products);
        setPagination(prev => ({
          ...prev,
          totalPages: response.data.totalPages || 1,
          totalProducts: response.data.totalProducts || 0
        }));
      } else {
        console.error('Unexpected API response structure:', response.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Table state
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    const newLimit = Number(e.target.value);
    setPagination(prev => ({
      ...prev,
      limit: newLimit,
      currentPage: 1 // Reset to first page when changing items per page
    }));
  };

  // Handle edit product
  const handleEdit = (product) => {
    navigate(`/product/edit/${product._id}`);
  };

  // Handle delete product
  const handleDelete = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        await axios.get(`${backend_url}/api/product/delete/${productToDelete._id}`);
        // Refresh the product list
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      } finally { 
        setIsDeleteModalOpen(false);
      }
    }
  };

  // Table columns configuration
  const columns = [
    { 
      header: 'S No.', 
      accessor: (row, index) => (pagination.currentPage - 1) * pagination.limit + index + 1,
      id: 'sno'
    },
    { 
      header: 'Image', 
      accessor: 'image',
      render: (value) => (
        <img src={`${backend_url}${value}`} alt="Product" className="w-10 h-10 rounded-full object-cover" />
      )
    },
    { header: 'Name', accessor: 'name' },
    { header: 'SKU', accessor: 'sku' },
    {
      header: 'Price', 
      accessor: 'discountedPrice',
      render: (value, row) => {
        if (row.productType === 'variable' && row.variant?.length > 0) {
          const firstVariant = row.variant[0];
          return (
            <div>
              <span className="text-gray-500 line-through mr-2">₹{firstVariant.actualPrice}</span>
              <span className="text-green-600">₹{firstVariant.discountPrice}</span>
              <span className="text-xs text-gray-500 ml-1">(Variable)</span> 
            </div>
          );
        }
        return (
          <div>
            <span className="text-gray-500 line-through mr-2">₹{row.mrp}</span>
            <span className="text-green-600">₹{value}</span>
          </div>
        );
      }
    },
    { 
      header: 'Stock', 
      accessor: 'stock',
      render: (value) => (
        <span className={value > 0 ? 'text-green-600' : 'text-red-600'}>
          {value > 0 ? `${value} in stock` : 'Out of stock'}
        </span>
      )
    },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      )
    },
  ];

  // Filter products based on search term (client-side filtering)
  const filteredData = products.filter((product) =>
    Object.values(product).some(
      (value) => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="">
      <div className='flex justify-between items-center mb-3'>
        <h1 className="text-2xl font-bold text-gray-900">Products Management</h1>
        <Link
          to="/product/add"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <FiPlus className="text-sm" />
          <span>Add Product</span>
        </Link>
      </div>
     
      {/* Product Table */}
      <div className="bg-white border border-gray-300 overflow-hidden">
        {/* Table Header with Search, Export and Add button */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="rowsPerPage" className="text-sm text-gray-600">Rows:</label>
              <select
                id="rowsPerPage"
                value={pagination.limit}
                onChange={handleItemsPerPageChange}
                className="block w-20 pl-3 pr-8 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                {[10, 20, 50, 100].map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
            
            <button
              onClick={() => {
                const ws = XLSX.utils.json_to_sheet(products);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Products');
                XLSX.writeFile(wb, 'products_export.xlsx');
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              <FiDownload className="text-sm" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.id || column.accessor}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.header}
                  </th>
                ))}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-6 py-4 text-center text-sm text-gray-500">
                    Loading products...
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((product, index) => (
                  <tr key={product._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {columns.map((column) => (
                      <td
                        key={`${product._id}-${column.id || column.accessor}`}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {typeof column.accessor === 'function'
                          ? column.accessor(product, index)
                          : column.render
                            ? column.render(product[column.accessor], product, index)
                            : product[column.accessor]}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                          title="Edit"
                        >
                          <FiEdit2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                          title="Delete"
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + 1} className="px-6 py-4 text-center text-sm text-gray-500">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalProducts > 0 && (
          <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(pagination.currentPage - 1) * pagination.limit + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.currentPage * pagination.limit, pagination.totalProducts)}
                  </span>{' '}
                  of <span className="font-medium">{pagination.totalProducts}</span> products
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: Math.max(prev.currentPage - 1, 1) }))}
                    disabled={pagination.currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      pagination.currentPage === 1
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.currentPage >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPagination(prev => ({ ...prev, currentPage: pageNum }))}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          pagination.currentPage === pageNum
                            ? 'z-10 bg-blue-600 border-blue-600 text-white'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: Math.min(prev.currentPage + 1, prev.totalPages) }))}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      pagination.currentPage === pagination.totalPages
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <FiChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-6">Are you sure you want to delete the product "{productToDelete?.name}"?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;