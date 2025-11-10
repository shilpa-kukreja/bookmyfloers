import React, { useState, useMemo, useEffect } from 'react';
import { FiSearch, FiChevronLeft, FiChevronRight, FiDownload, FiEdit2, FiTrash2, FiPlus, FiEye, FiEyeOff, FiX, FiUpload } from 'react-icons/fi';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { toast } from 'react-toastify';

const ManageBanner = () => {
  const [banners, setBanners] = useState([]);
  const backend_url = import.meta.env.VITE_BACKEND_URL;

  // Table state
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);

  // Popup states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState(null);
  const [bannerToEdit, setBannerToEdit] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    image: null,
    link: '',
    position: '',
    status: true
  });
  const [preview, setPreview] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${backend_url}/api/banner/all`);
      if (response.data.status === 'success') {
        setBanners(response.data.data || []);
      } else {
        setBanners([]);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
      setBanners([]);
      setError('Failed to fetch banners');
    } finally {
      setLoading(false);
    }
  };

  // Table columns configuration
  const columns = [
    { 
      header: 'S No.', 
      accessor: (row, index) => (currentPage - 1) * itemsPerPage + index + 1,
      id: 'sno'
    },
    { 
      header: 'Image', 
      accessor: 'image',
      render: (value) => (
        value ? (
          <img src={`${backend_url}${value}`} alt="Banner" className="w-16 h-12 rounded-md object-cover" />
        ) : (
          <div className="w-16 h-12 rounded-md bg-gray-200 flex items-center justify-center">
            <span className="text-xs text-gray-500">No Image</span>
          </div>
        )
      )
    },
    { header: 'Position', accessor: 'position' },
    { 
      header: 'Link', 
      accessor: 'link',
      render: (value) => (
        value ? (
          <a 
            href={value} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 truncate max-w-xs block"
            title={value}
          >
            {value.length > 30 ? `${value.substring(0, 30)}...` : value}
          </a>
        ) : (
          <span className="text-gray-400">No link</span>
        )
      )
    },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (value, banner) => (
        <button
          onClick={() => toggleBannerStatus(banner._id, value)}
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            value 
              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
              : 'bg-red-100 text-red-800 hover:bg-red-200'
          }`}
        >
          {value ? (
            <>
              <FiEye className="w-3 h-3 mr-1" />
              Active
            </>
          ) : (
            <>
              <FiEyeOff className="w-3 h-3 mr-1" />
              Inactive
            </>
          )}
        </button>
      )
    },
    { 
      header: 'Created At', 
      accessor: 'created_at',
      render: (value) => new Date(value).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },
    {
      header: 'Actions',
      id: 'actions',
      render: (_, banner) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(banner)}
            className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50 transition-colors"
            title="Edit"
          >
            <FiEdit2 className="h-5 w-5" />
          </button>
          <button
            onClick={() => {
              setBannerToDelete(banner);
              setIsDeleteModalOpen(true);
            }}
            className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <FiTrash2 className="h-5 w-5" />
          </button>
        </div>
      )
    }
  ];

  // Filter banners based on search term
  const filteredData = useMemo(() => {
    if (!Array.isArray(banners)) return [];
    if (!searchTerm) return banners;
    return banners.filter((banner) =>
      Object.values(banner).some(
        (value) => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [banners, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // Handle export to Excel
  const handleExport = () => {
    const exportData = filteredData.map(banner => ({
      'Position': banner.position,
      'Link': banner.link,
      'Status': banner.status ? 'Active' : 'Inactive',
      'Created At': new Date(banner.created_at).toLocaleDateString()
    }));
    
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Banners');
    XLSX.writeFile(wb, 'banners_export.xlsx');
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Handle delete banner confirmation
  const confirmDelete = async () => {
    if (bannerToDelete) {
      try {
        const response = await axios.get(`${backend_url}/api/banner/delete/${bannerToDelete._id}`);
        if (response.data.status === 'success') {
          setBanners(banners.filter((b) => b._id !== bannerToDelete._id));
          setIsDeleteModalOpen(false);
          setBannerToDelete(null);
          toast.success('Banner deleted successfully');
        }
      } catch (error) {
        console.error('Error deleting banner:', error);
        alert(error.response?.data?.error || 'Failed to delete banner');
      }
    }
  };

  // Toggle banner status
  const toggleBannerStatus = async (bannerId, currentStatus) => {
    try {
      const response = await axios.put(`${backend_url}/api/banner/edit/${bannerId}`, {
        status: !currentStatus
      });
      
      if (response.data.status === 'success') {
        setBanners(banners.map(banner => 
          banner._id === bannerId 
            ? { ...banner, status: !currentStatus }
            : banner
        ));
      }
    } catch (error) {
      console.error('Error updating banner status:', error);
      alert('Failed to update banner status');
    }
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
      }
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, GIF)');
        return;
      }
      
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  // Handle add banner submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.image) {
      setError('Please select an image');
      return;
    }

    if (!formData.position) {
      setError('Please enter a position');
      return;
    }

    setFormLoading(true);

    const submitData = new FormData();
    submitData.append('image', formData.image);
    submitData.append('link', formData.link);
    submitData.append('position', formData.position);
    submitData.append('status', formData.status);

    try {
      const response = await axios.post(`${backend_url}/api/banner/add`, submitData, {
        headers: { 
          'Content-Type': 'multipart/form-data' 
        }
      });
      
      if (response.data.status === 'success') {
        // Reset form and close modal
        resetForm();
        
        // Refresh banners list
        fetchBanners();
        
        // Show success message
        toast.success('Banner added successfully');
      }
    } catch (error) {
      console.error('Error adding banner:', error);
      const errorMessage = error.response?.data?.error || 'Failed to add banner';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  // Handle edit banner
  const handleEdit = (banner) => {
    setBannerToEdit(banner);
    setFormData({
      image: null,
      link: banner.link || '',
      position: banner.position || '',
      status: banner.status
    });
    setPreview(banner.image ? `${backend_url}${banner.image}` : '');
    setIsEditModalOpen(true);
  };

  // Handle update banner
  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!formData.position) {
      setError('Please enter a position');
      return;
    }

    setFormLoading(true);

    const submitData = new FormData();
    if (formData.image && typeof formData.image !== 'string') {
      submitData.append('image', formData.image);
    }
    submitData.append('link', formData.link);
    submitData.append('position', formData.position);
    submitData.append('status', formData.status);

    try {
      const response = await axios.put(`${backend_url}/api/banner/edit/${bannerToEdit._id}`, submitData, {
        headers: { 
          'Content-Type': 'multipart/form-data' 
        }
      });
      
      if (response.data.status === 'success') {
        // Reset form and close modal
        resetForm();
        setIsEditModalOpen(false);
        setBannerToEdit(null);
        
        // Refresh banners list
        fetchBanners();
        
        // Show success message
        toast.success('Banner updated successfully!');
      }
    } catch (error) {
      console.error('Error updating banner:', error);
      const errorMessage = error.response?.data?.error || 'Failed to update banner';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  // Reset form when modal closes
  const resetForm = () => {
    setFormData({
      image: null,
      link: '',
      position: '',
      status: true
    });
    setPreview('');
    setError('');
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setBannerToEdit(null);
  };

  // Remove image preview
  const removeImage = () => {
    setPreview('');
    setFormData(prev => ({ ...prev, image: null }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="">
      <div className='flex justify-between items-center mb-6'>
        <h1 className="text-2xl font-bold text-gray-900">Banner Management</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <FiPlus className="text-sm" />
          <span>Add Banner</span>
        </button>
      </div>
     
      {/* Banner Table */}
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
        {/* Table Header with Search, Export and Add button */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search banners..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="rowsPerPage" className="text-sm text-gray-600">Rows:</label>
              <select
                id="rowsPerPage"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="block w-20 pl-3 pr-8 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                {[5, 10, 20, 50].map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
            
            <button
              onClick={handleExport}
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.length > 0 ? (
                paginatedData.map((banner, index) => (
                  <tr key={banner._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {columns.map((column) => (
                      <td
                        key={`${banner._id}-${column.id || column.accessor}`}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {column.id === 'actions' ? (
                          column.render(null, banner, index)
                        ) : typeof column.accessor === 'function' ? (
                          column.accessor(banner, index)
                        ) : column.render ? (
                          column.render(banner[column.accessor], banner, index)
                        ) : (
                          banner[column.accessor]
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-4 text-center text-sm text-gray-500">
                    {banners.length === 0 ? 'No banners available' : 'No matching banners found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredData.length > 0 && (
          <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, filteredData.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredData.length}</span> banners
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === page
                          ? 'z-10 bg-blue-600 border-blue-600 text-white'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages
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

      {/* Add Banner Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {isEditModalOpen ? 'Edit Banner' : 'Add New Banner'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={isEditModalOpen ? handleUpdate : handleSubmit} className="p-6 space-y-4">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Image {!isEditModalOpen && '*'}
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    {preview ? (
                      <div className="relative w-full h-full">
                        <img 
                          src={preview} 
                          alt="Preview" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <FiX className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FiUpload className="w-8 h-8 mb-2 text-gray-400" />
                        <p className="text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-400">PNG, JPG, GIF up to 2MB</p>
                      </div>
                    )}
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
                {isEditModalOpen && (
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty to keep current image
                  </p>
                )}
              </div>

              {/* Link Input */}
              <div>
                <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">
                  Banner Link (Optional)
                </label>
                <input
                  type="url"
                  id="link"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Position Input */}
              <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                  Position *
                </label>
                <input
                  type="number"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  placeholder="Enter position number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Status Toggle */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="status"
                  name="status"
                  checked={formData.status}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="status" className="ml-2 block text-sm text-gray-700">
                  Active Banner
                </label>
              </div>
            </form>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={isEditModalOpen ? handleUpdate : handleSubmit}
                disabled={formLoading || (!isEditModalOpen && !formData.image) || !formData.position}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {formLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {isEditModalOpen ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  isEditModalOpen ? 'Update Banner' : 'Add Banner'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <FiTrash2 className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Delete Banner</h2>
                <p className="text-gray-600">This action cannot be undone.</p>
              </div>
            </div>
            
            {bannerToDelete && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                {bannerToDelete.image && (
                  <div className="mb-3 flex justify-center">
                    <img 
                      src={`${backend_url}${bannerToDelete.image}`} 
                      alt="Banner to delete" 
                      className="w-32 h-20 object-cover rounded-md"
                    />
                  </div>
                )}
                <div className="text-sm text-gray-600">
                  <p><strong>Position:</strong> {bannerToDelete.position}</p>
                  {bannerToDelete.link && (
                    <p><strong>Link:</strong> {bannerToDelete.link}</p>
                  )}
                  <p><strong>Status:</strong> {bannerToDelete.status ? 'Active' : 'Inactive'}</p>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setBannerToDelete(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <FiTrash2 className="h-4 w-4" />
                Delete Banner
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBanner;