import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiChevronLeft, FiChevronRight, FiDownload, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const backend_url = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  // Table state
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    slug: '',
    image: 'https://via.placeholder.com/50'
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    setIsLoading(true);
    fetch(`${backend_url}/api/category/all`, { 
      method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
      // Ensure data is always an array
      const categoriesData = Array.isArray(data) ? data : (data.data || []);
      setCategories(categoriesData);
    })
    .catch(error => {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
      setCategories([]);
    })
    .finally(() => {
      setIsLoading(false);
    });
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
        <img 
          src={value?.startsWith('http') ? value : `${backend_url}${value}`}
          alt="Category" 
          className="w-10 h-10 rounded-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/50';
          }}
        />
      )
    },
    { header: 'Name', accessor: 'name' },
    { header: 'Slug', accessor: 'slug' },
    {
      header: 'Actions',
      id: 'actions',
      render: (_, category) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(category)}
            className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
            title="Edit"
          >
            <FiEdit2 className="h-5 w-5" />
          </button>
          <button
            onClick={() => {
              setCategoryToDelete(category);
              setIsDeleteModalOpen(true);
            }}
            className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
            title="Delete"
          >
            <FiTrash2 className="h-5 w-5" />
          </button>
        </div>
      )
    }
  ];

  // Filter categories based on search term
  const filteredData = useMemo(() => {
    if (!Array.isArray(categories)) return [];
    if (!searchTerm) return categories;
    
    return categories.filter((category) =>
      ['name', 'slug'].some(field => 
        category[field]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [categories, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    if (!Array.isArray(filteredData)) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // Handle export to Excel
  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Categories');
    XLSX.writeFile(wb, 'categories_export.xlsx');
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Handle edit category
  const handleEdit = (category) => {
      navigate(`/category/edit/${category._id}`);
  };

  // Handle delete category confirmation
  const confirmDelete = async () => {
    if (categoryToDelete) {
      try {
        await axios.get(`${backend_url}/api/category/delete/${categoryToDelete._id}`);
        setCategories(categories.filter((c) => c._id !== categoryToDelete._id));
        toast.success('Category deleted successfully');
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error('Failed to delete category');
      } finally {
        setIsDeleteModalOpen(false);
      }
    }
  };

  // Handle add new category
  const handleAdd = async () => {
    if (!newCategory.name || !newCategory.slug) {
      toast.error('Name and slug are required');
      return;
    }

    try {
      const response = await axios.post(`${backend_url}/api/category/add`, newCategory);
      setCategories([...categories, response.data]);
      setNewCategory({
        name: '',
        slug: '',
        image: 'https://via.placeholder.com/50'
      });
      setIsAddModalOpen(false);
      toast.success('Category added successfully');
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
    }
  };

  // Handle update category
  const handleUpdate = async () => {
    if (!currentCategory?.name || !currentCategory?.slug) {
      toast.error('Name and slug are required');
      return;
    }

    try {
      const response = await axios.put(
        `${backend_url}/api/category/update/${currentCategory._id}`,
        currentCategory
      );
      setCategories(categories.map(c => 
        c._id === currentCategory._id ? response.data : c
      ));
      setIsEditModalOpen(false);
      toast.success('Category updated successfully');
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading categories...</div>;
  }

  return (
    <div className="">
      <div className='flex justify-between items-center mb-3'>
        <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
        <Link
         to="/category/add"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <FiPlus className="text-sm" />
          <span>Add Category</span>
        </Link>
      </div>
     
      {/* Category Table */}
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
              placeholder="Search categories..."
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
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              disabled={filteredData.length === 0}
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
                paginatedData.map((category, index) => (
                  <tr key={category._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {columns.map((column) => (
                      <td
                        key={`${category._id}-${column.id || column.accessor}`}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {typeof column.accessor === 'function'
                          ? column.accessor(category, index)
                          : column.render
                            ? column.render(category[column.accessor], category, index)
                            : category[column.accessor]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-4 text-center text-sm text-gray-500">
                    {categories.length === 0 ? 'No categories found' : 'No matching categories found'}
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
                  of <span className="font-medium">{filteredData.length}</span> categories
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

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0  flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-6">Are you sure you want to delete the category "{categoryToDelete?.name}"?</p>
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

      {/* Add Category Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0  flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newCategory.slug}
                  onChange={(e) => setNewCategory({...newCategory, slug: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newCategory.image}
                  onChange={(e) => setNewCategory({...newCategory, image: e.target.value})}
                />
                {newCategory.image && (
                  <img src={newCategory.image} alt="Preview" className="mt-2 w-16 h-16 rounded-md object-cover" />
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {isEditModalOpen && currentCategory && (
        <div className="fixed inset-0  flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Edit Category</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={currentCategory.name}
                  onChange={(e) => setCurrentCategory({...currentCategory, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={currentCategory.slug}
                  onChange={(e) => setCurrentCategory({...currentCategory, slug: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={currentCategory.image}
                  onChange={(e) => setCurrentCategory({...currentCategory, image: e.target.value})}
                />
                {currentCategory.image && (
                  <img src={currentCategory.image} alt="Preview" className="mt-2 w-16 h-16 rounded-md object-cover" />
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Update Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;