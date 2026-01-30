import React, { useState, useMemo, useEffect } from 'react';
import { FiSearch, FiChevronLeft, FiChevronRight, FiDownload, FiUpload, FiEdit2, FiTrash2, FiPlus, FiX, FiCheck, FiAlertCircle, FiInfo } from 'react-icons/fi';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { toast } from 'react-toastify';

const ManagePincodes = () => {
  const [pincodes, setPincodes] = useState([]);
  const backend_url = import.meta.env.VITE_BACKEND_URL;

  // Table state
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [selectedPincodes, setSelectedPincodes] = useState([]);

  // Popup states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [pincodeToDelete, setPincodeToDelete] = useState(null);
  const [pincodeToEdit, setPincodeToEdit] = useState(null);
  
  // Form states
  const [singleFormData, setSingleFormData] = useState({
    pincode: '',
    isActive: true
  });
  
  const [bulkFormData, setBulkFormData] = useState({
    pincodes: [{ pincode: '', isActive: true }]
  });
  
  const [bulkFile, setBulkFile] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPincodes();
  }, []);

  const fetchPincodes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backend_url}/api/pincode/all`);
      if (response.data.status === 'success') {
        setPincodes(response.data.data || []);
      } else {
        setPincodes([]);
      }
    } catch (error) {
      console.error('Error fetching pincodes:', error);
      setPincodes([]);
      setError('Failed to fetch pincodes');
    } finally {
      setLoading(false);
    }
  };

  // Filter pincodes based on search term
  const filteredData = useMemo(() => {
    if (!Array.isArray(pincodes)) return [];
    if (!searchTerm) return pincodes;
    return pincodes.filter((pincode) =>
      pincode.pincode.toString().includes(searchTerm) ||
      pincode._id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [pincodes, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // Table columns configuration - MOVED AFTER filteredData declaration
  const columns = useMemo(() => [
    {
      header: (
        <input
          type="checkbox"
          checked={selectedPincodes.length === filteredData.length && filteredData.length > 0}
          onChange={(e) => {
            if (e.target.checked) {
              // Select all filtered pincodes (not just paginated)
              setSelectedPincodes(filteredData.map(p => p._id));
            } else {
              setSelectedPincodes([]);
            }
          }}
          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
        />
      ),
      id: 'checkbox',
      render: (_, pincode) => (
        <input
          type="checkbox"
          checked={selectedPincodes.includes(pincode._id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedPincodes([...selectedPincodes, pincode._id]);
            } else {
              setSelectedPincodes(selectedPincodes.filter(id => id !== pincode._id));
            }
          }}
          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
        />
      )
    },
    { 
      header: 'S No.', 
      accessor: (row, index) => (currentPage - 1) * itemsPerPage + index + 1,
      id: 'sno'
    },
    { 
      header: 'Pincode', 
      accessor: 'pincode',
      render: (value) => (
        <span className="font-mono font-medium text-gray-900">
          {value}
        </span>
      )
    },
    { 
      header: 'Status', 
      accessor: 'isActive',
      render: (value, pincode) => (
        <button
          onClick={() => togglePincodeStatus(pincode._id, value)}
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            value 
              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
              : 'bg-red-100 text-red-800 hover:bg-red-200'
          }`}
        >
          <div className={`w-2 h-2 rounded-full mr-2 ${value ? 'bg-green-500' : 'bg-red-500'}`} />
          {value ? 'Active' : 'Inactive'}
        </button>
      )
    },
    { 
      header: 'Created At', 
      accessor: 'createdAt',
      render: (value) => new Date(value).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    { 
      header: 'Updated At', 
      accessor: 'updatedAt',
      render: (value) => new Date(value).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    {
      header: 'Actions',
      id: 'actions',
      render: (_, pincode) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(pincode)}
            className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50 transition-colors"
            title="Edit"
          >
            <FiEdit2 className="h-5 w-5" />
          </button>
          <button
            onClick={() => {
              setPincodeToDelete(pincode);
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
  ], [filteredData, selectedPincodes, currentPage, itemsPerPage]);

  // Handle export to Excel
  const handleExport = () => {
    const exportData = filteredData.map(pincode => ({
      'Pincode': pincode.pincode,
      'Status': pincode.isActive ? 'Active' : 'Inactive',
      'Created At': new Date(pincode.createdAt).toLocaleDateString(),
      'Updated At': new Date(pincode.updatedAt).toLocaleDateString()
    }));
    
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pincodes');
    XLSX.writeFile(wb, `pincodes_export_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Handle bulk status update
  const handleBulkStatusUpdate = async (status) => {
    if (selectedPincodes.length === 0) {
      toast.warning('Please select pincodes to update');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(`${backend_url}/api/pincode/bulk-update`, {
        pincodeIds: selectedPincodes,
        isActive: status
      });
      
      if (response.data.status === 'success') {
        setPincodes(pincodes.map(pincode => 
          selectedPincodes.includes(pincode._id) 
            ? { ...pincode, isActive: status }
            : pincode
        ));
        setSelectedPincodes([]);
        toast.success(`${selectedPincodes.length} pincode(s) updated successfully`);
      }
    } catch (error) {
      console.error('Error updating pincodes:', error);
      toast.error(error.response?.data?.message || 'Failed to update pincodes');
    } finally {
      setLoading(false);
    }
  };

  // Handle bulk delete button click
  const handleBulkDeleteClick = () => {
    if (selectedPincodes.length === 0) {
      toast.warning('Please select pincodes to delete');
      return;
    }
    setIsBulkDeleteModalOpen(true);
  };

  // Handle bulk delete confirmation
  const handleBulkDeleteConfirm = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${backend_url}/api/pincode/bulk-delete`, {
        pincodeIds: selectedPincodes
      });
      
      if (response.data.status === 'success') {
        setPincodes(pincodes.filter(pincode => !selectedPincodes.includes(pincode._id)));
        setSelectedPincodes([]);
        setIsBulkDeleteModalOpen(false);
        toast.success(`${selectedPincodes.length} pincode(s) deleted successfully`);
      }
    } catch (error) {
      console.error('Error deleting pincodes:', error);
      toast.error(error.response?.data?.message || 'Failed to delete pincodes');
    } finally {
      setLoading(false);
    }
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Handle delete pincode confirmation
  const confirmDelete = async () => {
    if (pincodeToDelete) {
      try {
        const response = await axios.delete(`${backend_url}/api/pincode/delete/${pincodeToDelete._id}`);
        if (response.data.status === 'success') {
          setPincodes(pincodes.filter((p) => p._id !== pincodeToDelete._id));
          setIsDeleteModalOpen(false);
          setPincodeToDelete(null);
          toast.success('Pincode deleted successfully');
        }
      } catch (error) {
        console.error('Error deleting pincode:', error);
        toast.error(error.response?.data?.message || 'Failed to delete pincode');
      }
    }
  };

  // Toggle pincode status
  const togglePincodeStatus = async (pincodeId, currentStatus) => {
    try {
      const response = await axios.put(`${backend_url}/api/pincode/update/${pincodeId}`, {
        isActive: !currentStatus
      });
      
      if (response.data.status === 'success') {
        setPincodes(pincodes.map(pincode => 
          pincode._id === pincodeId 
            ? { ...pincode, isActive: !currentStatus }
            : pincode
        ));
        toast.success('Pincode status updated successfully');
      }
    } catch (error) {
      console.error('Error updating pincode status:', error);
      toast.error('Failed to update pincode status');
    }
  };

  // Handle single pincode form submission
  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    
    if (!singleFormData.pincode) {
      setError('Please enter a pincode');
      return;
    }

    if (!/^\d{6}$/.test(singleFormData.pincode)) {
      setError('Pincode must be a 6-digit number');
      return;
    }

    setFormLoading(true);

    try {
      const response = await axios.post(`${backend_url}/api/pincode/add`, {
        pincode: Number(singleFormData.pincode),
        isActive: singleFormData.isActive
      });
      
      if (response.data.status === 'success') {
        resetSingleForm();
        fetchPincodes();
        toast.success('Pincode added successfully');
      }
    } catch (error) {
      console.error('Error adding pincode:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add pincode';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  // Handle bulk pincode form submission
  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    
    const validPincodes = bulkFormData.pincodes.filter(item => 
      item.pincode && /^\d{6}$/.test(item.pincode)
    );
    
    if (validPincodes.length === 0) {
      setError('Please add at least one valid 6-digit pincode');
      return;
    }

    setFormLoading(true);

    try {
      const response = await axios.post(`${backend_url}/api/pincode/add-multiple`, {
        pincodes: validPincodes.map(item => ({
          pincode: Number(item.pincode),
          isActive: item.isActive
        }))
      });
      
      if (response.data.status === 'success') {
        resetBulkForm();
        setIsBulkUploadOpen(false);
        fetchPincodes();
        toast.success(`${validPincodes.length} pincode(s) added successfully`);
      }
    } catch (error) {
      console.error('Error adding pincodes:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add pincodes';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  // Handle file upload for bulk pincodes
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setBulkFile(file);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        const parsedPincodes = jsonData.map(row => ({
          pincode: row['Pincode'] ? String(row['Pincode']).replace(/\D/g, '').slice(0, 6) : '',
          isActive: row['Status'] === 'Active' || row['Status'] === true || row['isActive'] === true
        })).filter(item => item.pincode.length === 6);
        
        if (parsedPincodes.length > 0) {
          setBulkFormData({ pincodes: parsedPincodes });
          toast.info(`Loaded ${parsedPincodes.length} pincode(s) from file`);
        } else {
          toast.error('No valid pincodes found in the file');
        }
      } catch (error) {
        console.error('Error parsing file:', error);
        toast.error('Error reading file. Please check the format.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Handle edit pincode
  const handleEdit = (pincode) => {
    setPincodeToEdit(pincode);
    setSingleFormData({
      pincode: pincode.pincode.toString(),
      isActive: pincode.isActive
    });
    setIsEditModalOpen(true);
  };

  // Handle update pincode
  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!singleFormData.pincode) {
      setError('Please enter a pincode');
      return;
    }

    if (!/^\d{6}$/.test(singleFormData.pincode)) {
      setError('Pincode must be a 6-digit number');
      return;
    }

    setFormLoading(true);

    try {
      const response = await axios.put(`${backend_url}/api/pincode/update/${pincodeToEdit._id}`, {
        pincode: Number(singleFormData.pincode),
        isActive: singleFormData.isActive
      });
      
      if (response.data.status === 'success') {
        resetSingleForm();
        setIsEditModalOpen(false);
        setPincodeToEdit(null);
        fetchPincodes();
        toast.success('Pincode updated successfully');
      }
    } catch (error) {
      console.error('Error updating pincode:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update pincode';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  // Add new pincode field in bulk form
  const addPincodeField = () => {
    setBulkFormData({
      pincodes: [...bulkFormData.pincodes, { pincode: '', isActive: true }]
    });
  };

  // Remove pincode field from bulk form
  const removePincodeField = (index) => {
    if (bulkFormData.pincodes.length > 1) {
      const newPincodes = [...bulkFormData.pincodes];
      newPincodes.splice(index, 1);
      setBulkFormData({ pincodes: newPincodes });
    }
  };

  // Update bulk form field
  const updateBulkField = (index, field, value) => {
    const newPincodes = [...bulkFormData.pincodes];
    newPincodes[index][field] = value;
    setBulkFormData({ pincodes: newPincodes });
  };

  // Reset forms
  const resetSingleForm = () => {
    setSingleFormData({
      pincode: '',
      isActive: true
    });
    setError('');
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
  };

  const resetBulkForm = () => {
    setBulkFormData({
      pincodes: [{ pincode: '', isActive: true }]
    });
    setBulkFile(null);
    setError('');
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
        <h1 className="text-2xl font-bold text-gray-900">Pincode Management</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsBulkUploadOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            <FiUpload className="text-sm" />
            <span>Bulk Upload</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <FiPlus className="text-sm" />
            <span>Add Pincode</span>
          </button>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedPincodes.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FiAlertCircle className="h-5 w-5 text-blue-600" />
              <span className="text-blue-800 font-medium">
                {selectedPincodes.length} pincode(s) selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkStatusUpdate(true)}
                className="px-3 py-1.5 bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors text-sm font-medium"
              >
                Activate Selected
              </button>
              <button
                onClick={() => handleBulkStatusUpdate(false)}
                className="px-3 py-1.5 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors text-sm font-medium"
              >
                Deactivate Selected
              </button>
              <button
                onClick={handleBulkDeleteClick}
                className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium flex items-center gap-1"
              >
                <FiTrash2 className="h-4 w-4" />
                Delete Selected
              </button>
              <button
                onClick={() => setSelectedPincodes([])}
                className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}
     
      {/* Pincode Table */}
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
              placeholder="Search pincodes..."
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
                {[5, 10, 20, 50, 100].map((size) => (
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
                paginatedData.map((pincode, index) => (
                  <tr key={pincode._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-50'}>
                    {columns.map((column) => (
                      <td
                        key={`${pincode._id}-${column.id || column.accessor}`}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {column.id === 'checkbox' || column.id === 'actions' ? (
                          column.render(null, pincode, index)
                        ) : typeof column.accessor === 'function' ? (
                          column.accessor(pincode, index)
                        ) : column.render ? (
                          column.render(pincode[column.accessor], pincode, index)
                        ) : (
                          pincode[column.accessor]
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <FiAlertCircle className="h-12 w-12 mb-2 opacity-50" />
                      <p className="text-lg font-medium">No pincodes found</p>
                      <p className="text-sm mt-1">
                        {pincodes.length === 0 
                          ? 'Start by adding your first pincode' 
                          : 'No matching pincodes for your search'}
                      </p>
                    </div>
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
                  of <span className="font-medium">{filteredData.length}</span> pincodes
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
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNum
                            ? 'z-10 bg-blue-600 border-blue-600 text-white'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
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

      {/* Add/Edit Pincode Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {isEditModalOpen ? 'Edit Pincode' : 'Add New Pincode'}
              </h2>
              <button
                onClick={resetSingleForm}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={isEditModalOpen ? handleUpdate : handleSingleSubmit} className="p-6 space-y-4">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              {/* Pincode Input */}
              <div>
                <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode *
                </label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  value={singleFormData.pincode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setSingleFormData({...singleFormData, pincode: value});
                    setError('');
                  }}
                  placeholder="Enter 6-digit pincode"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Enter a 6-digit pincode (numbers only)</p>
              </div>

              {/* Status Toggle */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={singleFormData.isActive}
                  onChange={(e) => setSingleFormData({...singleFormData, isActive: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                  Active Pincode
                </label>
              </div>
            </form>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                type="button"
                onClick={resetSingleForm}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={isEditModalOpen ? handleUpdate : handleSingleSubmit}
                disabled={formLoading || !singleFormData.pincode || singleFormData.pincode.length !== 6}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {formLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {isEditModalOpen ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  isEditModalOpen ? 'Update Pincode' : 'Add Pincode'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {isBulkUploadOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Bulk Upload Pincodes
              </h2>
              <button
                onClick={() => {
                  setIsBulkUploadOpen(false);
                  resetBulkForm();
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleBulkSubmit} className="p-6 space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              {/* File Upload Section */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-blue-600 hover:text-blue-500">
                        Upload Excel/CSV File
                      </span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        className="sr-only"
                        onChange={handleFileUpload}
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      Upload an Excel/CSV file with columns: "Pincode" (6-digit) and optionally "Status" (Active/Inactive)
                    </p>
                    {bulkFile && (
                      <div className="mt-3 p-3 bg-green-50 rounded-md">
                        <p className="text-sm text-green-800 flex items-center gap-2">
                          <FiCheck className="h-4 w-4" />
                          File loaded: {bulkFile.name} ({bulkFormData.pincodes.length} pincode(s))
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Manual Entry Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Manual Entry</h3>
                  <button
                    type="button"
                    onClick={addPincodeField}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors"
                  >
                    <FiPlus className="h-4 w-4" />
                    Add Row
                  </button>
                </div>
                
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {bulkFormData.pincodes.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-md">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Pincode {index + 1} *
                        </label>
                        <input
                          type="text"
                          value={item.pincode}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                            updateBulkField(index, 'pincode', value);
                          }}
                          placeholder="6-digit pincode"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm font-mono"
                        />
                      </div>
                      <div className="w-32">
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Status
                        </label>
                        <select
                          value={item.isActive}
                          onChange={(e) => updateBulkField(index, 'isActive', e.target.value === 'true')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        >
                          <option value="true">Active</option>
                          <option value="false">Inactive</option>
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={() => removePincodeField(index)}
                        disabled={bulkFormData.pincodes.length === 1}
                        className="mt-6 p-2 text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FiX className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </form>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setIsBulkUploadOpen(false);
                  resetBulkForm();
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkSubmit}
                disabled={formLoading || bulkFormData.pincodes.filter(item => item.pincode.length === 6).length === 0}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {formLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <FiUpload className="h-4 w-4" />
                    Upload {bulkFormData.pincodes.filter(item => item.pincode.length === 6).length} Pincode(s)
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Single Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
            {/* Modal Header */}
            <div className="p-8 text-center">
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6">
                <FiTrash2 className="h-10 w-10 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Delete Pincode</h2>
              <p className="text-gray-600 mb-6">This action cannot be undone. Are you sure you want to delete this pincode?</p>
            </div>
            
            {/* Pincode Details */}
            {pincodeToDelete && (
              <div className="mx-8 mb-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">#</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Pincode Details</h3>
                      <p className="text-xs text-gray-500">ID: {pincodeToDelete._id.substring(0, 8)}...</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    pincodeToDelete.isActive 
                      ? 'bg-green-100 text-green-800 border border-green-200' 
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                    {pincodeToDelete.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-gray-500 text-xs">Pincode</p>
                    <p className="font-mono font-bold text-gray-900 text-lg">{pincodeToDelete.pincode}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500 text-xs">Created</p>
                    <p className="font-medium text-gray-900">
                      {new Date(pincodeToDelete.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Warning Message */}
            <div className="mx-8 mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <FiAlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Warning</p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Deleting this pincode will remove it permanently from the database. This may affect service delivery in this area.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-8 pt-0 flex justify-center space-x-4">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setPincodeToDelete(null);
                }}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium hover:shadow-lg hover:border-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-2">
                  <FiTrash2 className="h-5 w-5" />
                  Delete Pincode
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {isBulkDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full transform transition-all duration-300 scale-100">
            {/* Modal Header */}
            <div className="p-8 text-center">
              <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100 mb-6">
                <div className="relative">
                  <FiTrash2 className="h-12 w-12 text-red-600" />
                  <div className="absolute -top-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                    <span className="text-red-600 font-bold text-lg">{selectedPincodes.length}</span>
                  </div>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Delete Multiple Pincodes</h2>
              <p className="text-gray-600 mb-6">
                You are about to delete <span className="font-bold text-red-600">{selectedPincodes.length} pincode(s)</span>. This action cannot be undone.
              </p>
            </div>
            
            {/* Selected Pincodes Preview */}
            <div className="mx-8 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Selected Pincodes</h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                  {selectedPincodes.length} selected
                </span>
              </div>
              <div className="max-h-40 overflow-y-auto pr-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {pincodes
                    .filter(p => selectedPincodes.includes(p._id))
                    .slice(0, 12)
                    .map((pincode, index) => (
                      <div key={pincode._id} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-medium text-gray-900">{pincode.pincode}</span>
                          <span className={`h-2 w-2 rounded-full ${pincode.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(pincode.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    ))}
                  {selectedPincodes.length > 12 && (
                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 rounded-lg p-3 flex items-center justify-center">
                      <span className="text-gray-700 font-medium">
                        +{selectedPincodes.length - 12} more
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mx-8 mb-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Active</p>
                  <p className="text-2xl font-bold text-green-600">
                    {pincodes.filter(p => selectedPincodes.includes(p._id) && p.isActive).length}
                  </p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Inactive</p>
                  <p className="text-2xl font-bold text-red-600">
                    {pincodes.filter(p => selectedPincodes.includes(p._id) && !p.isActive).length}
                  </p>
                </div>
              </div>
            </div>

            {/* Warning Message */}
            <div className="mx-8 mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <FiAlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">Critical Action</p>
                  <p className="text-xs text-red-700 mt-1">
                    Deleting these pincodes will affect service delivery in multiple areas. Please ensure this is intentional.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-8 pt-0 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => {
                  setIsBulkDeleteModalOpen(false);
                }}
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium hover:shadow-lg hover:border-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDeleteConfirm}
                className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-center gap-2">
                  <FiTrash2 className="h-5 w-5" />
                  Delete {selectedPincodes.length} Pincode(s)
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePincodes;