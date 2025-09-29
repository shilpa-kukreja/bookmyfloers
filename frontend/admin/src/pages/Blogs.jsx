import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiChevronLeft, FiChevronRight, FiDownload, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const backend_url = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  // Table state
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${backend_url}/api/blog/all`);
      setBlogs(response.data.data || []); // Ensure we always have an array

    } catch (error) {
      console.error('Error fetching blogs:', error);
      setBlogs([]); // Set to empty array on error
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
          <img src={`${backend_url}${value}`} alt="Blog" className="w-10 h-10 rounded-md object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center">
            <span className="text-xs text-gray-500">No Image</span>
          </div>
        )
      )
    },
    { header: 'Title', accessor: 'name' },
    { header: 'Author', accessor: 'author' },
    { header: 'Slug', accessor: 'slug' },
    {
      header: 'Actions',
      id: 'actions',
      render: (_, blog) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/blogs/edit/${blog._id}`)}
            className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
            title="Edit"
          >
            <FiEdit2 className="h-5 w-5" />
          </button>
          <button
            onClick={() => {
              setBlogToDelete(blog);
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

  // Filter blogs based on search term
  const filteredData = useMemo(() => {
    if (!Array.isArray(blogs)) return []; // Return empty array if blogs is not an array
    if (!searchTerm) return blogs;
    return blogs.filter((blog) =>
      Object.values(blog).some(
        (value) => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [blogs, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // Handle export to Excel
  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Blogs');
    XLSX.writeFile(wb, 'blogs_export.xlsx');
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Handle delete blog confirmation
  const confirmDelete = async () => {
    if (blogToDelete) {
      try {
        await axios.get(`${backend_url}/api/blog/delete/${blogToDelete._id}`);
        setBlogs(blogs.filter((b) => b._id !== blogToDelete._id));
        setIsDeleteModalOpen(false);
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
    }
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
      <div className='flex justify-between items-center mb-3'>
        <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
        <Link
          to="/blogs/add"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <FiPlus className="text-sm" />
          <span>Add Blog</span>
        </Link>
      </div>
     
      {/* Blog Table */}
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
              placeholder="Search blogs..."
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
                paginatedData.map((blog, index) => (
                  <tr key={blog._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {columns.map((column) => (
                      <td
                        key={`${blog._id}-${column.id || column.accessor}`}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {typeof column.accessor === 'function'
                          ? column.accessor(blog, index)
                          : column.render
                            ? column.render(blog[column.accessor], blog, index)
                            : blog[column.accessor]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-4 text-center text-sm text-gray-500">
                    {blogs.length === 0 ? 'No blogs available' : 'No matching blogs found'}
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
                  of <span className="font-medium">{filteredData.length}</span> blogs
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
            <p className="mb-6">Are you sure you want to delete the blog "{blogToDelete?.name}"?</p>
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

export default Blogs;