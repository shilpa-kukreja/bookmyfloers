import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const AddBlogs = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState('');
  const [editorData, setEditorData] = useState('');

  const backend_url = import.meta.env.VITE_BACKEND_URL;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm();

  const name = watch('name');

  // Generate slug from name
  const generateSlug = (name) => {
    return name
      ? name
          .toLowerCase()
          .replace(/[^\w\s]/gi, '')
          .replace(/\s+/g, '-')
      : '';
  };

  // Update slug when name changes
  useEffect(() => {
    const subscription = watch((value, { name: fieldName }) => {
      if (fieldName === 'name') {
        setValue('slug', generateSlug(value.name));
        // Also set meta title to the blog title by default
        if (!value.metaTitle || value.metaTitle === '') {
          setValue('metaTitle', value.name);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setImageError('Image size should be less than 2MB');
        return;
      }
      
      setImageFile(file);
      setImageError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove image
  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
    setImageError('Image upload is required');
    const fileInput = document.getElementById('image');
    if (fileInput) fileInput.value = '';
  };

  // Form submission
  const onSubmit = async (data) => {
    try {
      if (!imageFile) {
        setImageError('Image upload is required');
        return;
      }

      if (!editorData || editorData.length < 10) {
        toast.error('Blog content must be at least 10 characters');
        return;
      }

      setLoading(true);

      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('slug', data.slug);
      formData.append('metaTitle', data.metaTitle);
      formData.append('metaDescription', data.metaDescription);
      formData.append('author', data.author);
      formData.append('description', editorData);
      formData.append('tags', data.tags);
      formData.append('image', imageFile);

      await axios.post(
        `${backend_url}/api/blog/add`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      toast.success('Blog Published Successfully!');
      navigate('/blogs');
      
    } catch (error) {
      console.error('Error adding blog:', error);
      toast.error(error.response?.data?.message || 'Failed to publish blog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-8 border-b border-gray-200 py-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Add New Blog</h1>
        </div>
        <button
          onClick={() => navigate('/blogs')}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          Back to Blogs
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Field */}
          <div className="">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Blog Title <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              {...register('name', { 
                required: 'Blog title is required',
                minLength: {
                  value: 3,
                  message: 'Title must be at least 3 characters'
                }
              })}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
              }`}
              placeholder="e.g. My Awesome Blog Post"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Slug Field */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              id="slug"
              type="text"
              {...register('slug', { 
                required: 'Slug is required',
                pattern: {
                  value: /^[a-z0-9-]+$/,
                  message: 'Slug can only contain lowercase letters, numbers and hyphens'
                }
              })}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.slug ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
              }`}
              placeholder="e.g. my-awesome-blog-post"
            />
            {errors.slug && (
              <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
            )}
          </div>

          {/* Meta Title Field */}
          <div>
            <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 mb-2">
              Meta Title (SEO) <span className="text-red-500">*</span>
            </label>
            <input
              id="metaTitle"
              type="text"
              {...register('metaTitle', { 
                required: 'Meta title is required for SEO',
                maxLength: {
                  value: 60,
                  message: 'Meta title should be under 60 characters for best SEO results'
                }
              })}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.metaTitle ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
              }`}
              placeholder="Title for search engines (keep under 60 chars)"
            />
            {errors.metaTitle && (
              <p className="mt-1 text-sm text-red-600">{errors.metaTitle.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              This appears in search engine results. Recommended length: 50-60 characters.
            </p>
          </div>

          {/* Author Field */}
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
              Author <span className="text-red-500">*</span>
            </label>
            <input
              id="author"
              type="text"
              {...register('author', { 
                required: 'Author is required',
                minLength: {
                  value: 2,
                  message: 'Author name must be at least 2 characters'
                }
              })}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.author ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
              }`}
              placeholder="e.g. John Doe"
            />
            {errors.author && (
              <p className="mt-1 text-sm text-red-600">{errors.author.message}</p>
            )}
          </div>

          {/* Meta Description Field */}
          <div className="md:col-span-2">
            <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-2">
              Meta Description (SEO) <span className="text-red-500">*</span>
            </label>
            <textarea
              id="metaDescription"
              rows={3}
              {...register('metaDescription', { 
                required: 'Meta description is required for SEO',
                maxLength: {
                  value: 160,
                  message: 'Meta description should be under 160 characters for best SEO results'
                }
              })}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.metaDescription ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
              }`}
              placeholder="Brief description for search engines (keep under 160 chars)"
            />
            {errors.metaDescription && (
              <p className="mt-1 text-sm text-red-600">{errors.metaDescription.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              This appears in search engine results below the title. Recommended length: 150-160 characters.
            </p>
          </div>

          {/* Tags Field */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma separated)
            </label>
            <input
              id="tags"
              type="text"
              {...register('tags')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="e.g. technology, web development, javascript"
            />
          </div>
        </div>

        {/* CKEditor Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <div className={`border rounded-md ${!editorData || editorData.length < 10 ? 'border-red-500' : 'border-gray-300'}`}>
            <CKEditor
              editor={ClassicEditor}
              data={editorData}
              onChange={(event, editor) => {
                const data = editor.getData();
                setEditorData(data);
              }}
              config={{
                toolbar: [
                  'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 
                  'numberedList', 'blockQuote', 'insertTable', 'mediaEmbed',
                  'undo', 'redo'
                ]
              }}
            />
          </div>
          {(!editorData || editorData.length < 10) && (
            <p className="mt-1 text-sm text-red-600">Blog content must be at least 10 characters</p>
          )}
        </div>

        {/* Image Upload */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Featured Image <span className="text-red-500">*</span>
          </label>
          
          <div className="flex items-start space-x-6">
            {/* Image Preview */}
            <div className="flex-shrink-0">
              {imagePreview ? (
                <div className="relative group">
                  <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                    title="Remove image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className={`w-32 h-32 rounded-lg border-2 ${imageError ? 'border-red-500' : 'border-dashed border-gray-300'} bg-gray-50 flex items-center justify-center`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            
            {/* Upload Controls */}
            <div className="flex-1 space-y-4">
              <div className="relative">
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <label
                  htmlFor="image"
                  className={`inline-flex items-center px-6 py-3 bg-white border ${imageError ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  {imageFile ? 'Change Image' : 'Upload Image'}
                </label>
              </div>
              
              {imageError && (
                <p className="mt-1 text-sm text-red-600">{imageError}</p>
              )}
              
              <div className="text-sm text-gray-500">
                <p>Upload a high-quality featured image for your blog.</p>
                <p>Recommended size: 1200x630px, JPG or PNG format, max 2MB.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/blogs')}
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
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Publishing...
              </>
            ) : 'Publish Blog'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBlogs;