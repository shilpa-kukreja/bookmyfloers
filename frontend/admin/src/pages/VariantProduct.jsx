import { useState, useEffect, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const VariantProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [productType, setProductType] = useState('simple');
  const backend_url = import.meta.env.VITE_BACKEND_URL;
  const galleryInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      productType: 'simple',
      section: 'bestseller',
      categoryId: [],
      subcategoryId: [],
      variants: [{ variantName: '', actualPrice: '', discountPrice: '' }],
      shortDescription: '',
      description: '',
      additionalInformation: '',
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants"
  });

  // Watch product name to generate slug
  const productName = watch('name');
  useEffect(() => {
    if (productName) {
      const slug = productName
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
      setValue('slug', slug);
    }
  }, [productName, setValue]);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${backend_url}/api/category/all`);
        setCategories(response.data.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
      }
    };
    fetchCategories();
  }, [backend_url]);

  // Fetch subcategories when category changes
  useEffect(() => {
    if (selectedCategory) {
      const fetchSubCategories = async () => {
        try {
          const response = await axios.get(`${backend_url}/api/subcategory/by-category/${selectedCategory}`);
          setSubCategories(response.data.data);
        } catch (error) {
          console.error('Error fetching subcategories:', error);
          toast.error('Failed to load subcategories');
        }
      };
      fetchSubCategories();
    }
  }, [selectedCategory, backend_url]);

  // Handle main image upload
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size should be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle gallery images upload
  const handleGalleryImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + galleryFiles.length > 10) {
      toast.error('Maximum 10 images allowed in gallery');
      return;
    }

    const validFiles = files.filter(file => {
      if (file.size > 2 * 1024 * 1024) {
        toast.error(`Image ${file.name} size should be less than 2MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    const newPreviews = [];
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push({
          url: reader.result,
          file: file
        });
        
        if (newPreviews.length === validFiles.length) {
          setGalleryPreviews(prev => [...prev, ...newPreviews]);
          setGalleryFiles(prev => [...prev, ...validFiles]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove gallery image
  const removeGalleryImage = (index) => {
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
    
    // Reset file input to allow re-uploading the same files
    if (galleryInputRef.current) {
      galleryInputRef.current.value = '';
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const formData = new FormData();
      
      // Append basic fields
      formData.append('name', data.name);
      formData.append('slug', data.slug);
      formData.append('section', data.section);
      formData.append('shortDescription', data.shortDescription);
      formData.append('description', data.description);
      formData.append('additionalInformation', data.additionalInformation);
      formData.append('productType', data.productType);
      formData.append('sku', data.sku);
      formData.append('stock', data.stock);

      // Append categories and subcategories as arrays
      data.categoryId.forEach(id => formData.append('categoryId[]', id));
      data.subcategoryId.forEach(id => formData.append('subcategoryId[]', id));

      // Simple product fields
      if (data.productType === 'simple') {
        formData.append('actualPrice', data.actualPrice);
        formData.append('discountPrice', data.discountPrice || data.actualPrice);
      }
      
      // Variable product fields
      if (data.productType === 'variable') {
        formData.append('variants', JSON.stringify(data.variants));
      }

      // Append main image
      const mainImageInput = document.querySelector('input[name="thumbImg"]');
      if (mainImageInput.files[0]) {
        formData.append('thumbImg', mainImageInput.files[0]);
      }

      // Append gallery images
      galleryFiles.forEach((file) => {
        formData.append('galleryImg', file);
      });

      await axios.post(`${backend_url}/api/product/add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Product added successfully!');
      navigate('/products');
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error(error.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-600 mt-2">Fill in the details to create a new product</p>
        </div>
        <button
          onClick={() => navigate('/products')}
          className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors mt-4 md:mt-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Products
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Product Type */}
        <div className="bg-white border border-gray-100 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Product Type</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:border-blue-400 transition-colors">
              <input
                type="radio"
                value="simple"
                checked={productType === 'simple'}
                onChange={() => setProductType('simple')}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="block text-sm font-medium text-gray-900">Simple Product</span>
                <span className="block text-sm text-gray-500">A single product with no variants</span>
              </div>
            </label>
            <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:border-blue-400 transition-colors">
              <input
                type="radio"
                value="variable"
                checked={productType === 'variable'}
                onChange={() => setProductType('variable')}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="block text-sm font-medium text-gray-900">Variable Product</span>
                <span className="block text-sm text-gray-500">Product with different variants</span>
              </div>
            </label>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name*</label>
              <input
                type="text"
                {...register('name', { required: 'Product name is required' })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. Red Rose Bouquet"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug*</label>
              <input
                type="text"
                {...register('slug', { required: 'Slug is required' })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. red-rose-bouquet"
              />
              {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU*</label>
              <input
                type="text"
                {...register('sku', { required: 'SKU is required' })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. dlkfj123"
              />
              {errors.sku && <p className="mt-1 text-sm text-red-600">{errors.sku.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
              <select
                {...register('section')}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="bestseller">Bestseller</option>
                <option value="featured">Featured</option>
                <option value="new">New Arrivals</option>
                <option value="regular">Regular</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categories*</label>
              <select
                {...register('categoryId', { required: 'At least one category is required' })}
                onChange={(e) => setSelectedCategory(e.target.value)}
                multiple
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-auto min-h-[42px]"
              >
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subcategories</label>
              <select
                {...register('subcategoryId')}
                multiple
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-auto min-h-[42px]"
                disabled={!selectedCategory}
              >
                {subCategories.map((subCategory) => (
                  <option key={subCategory._id} value={subCategory._id}>
                    {subCategory.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Short Description*</label>
              <CKEditor
                editor={ClassicEditor}
                data={watch('shortDescription') || ''}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setValue('shortDescription', data);
                }}
                config={{
                  toolbar: [
                    'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|', 'undo', 'redo'
                  ],
                  removePlugins: ['Heading'],
                }}
              />
              {errors.shortDescription && <p className="mt-1 text-sm text-red-600">{errors.shortDescription.message}</p>}
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Images</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Main Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Image*</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  {mainImagePreview ? (
                    <img src={mainImagePreview} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                      </svg>
                      <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-gray-500">PNG, JPG (MAX. 2MB)</p>
                    </div>
                  )}
                  <input 
                    id="main-image" 
                    type="file" 
                    name="thumbImg"
                    onChange={handleMainImageChange}
                    className="hidden" 
                    accept="image/*"
                    required
                  />
                </label>
              </div>
            </div>

            {/* Gallery Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Images (Max 10)</label>
              <div className="flex flex-col gap-4">
                {/* Upload box */}
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                      </svg>
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        {galleryPreviews.length}/10 images (MAX. 2MB each)
                      </p>
                    </div>
                    <input 
                      id="gallery-images" 
                      type="file" 
                      name="galleryImages"
                      onChange={handleGalleryImagesChange}
                      className="hidden" 
                      accept="image/*"
                      multiple
                      ref={galleryInputRef}
                    />
                  </label>
                </div>
                
                {/* Gallery preview */}
                {galleryPreviews.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {galleryPreviews.map((preview, index) => (
                      <div key={index} className="relative group h-24">
                        <img 
                          src={preview.url} 
                          alt={`Gallery ${index}`} 
                          className="w-full h-full object-cover rounded border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(index)}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center transform translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Simple Product Pricing */}
        {productType === 'simple' && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Pricing</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Actual Price*</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    {...register('actualPrice', { 
                      required: productType === 'simple' ? 'Price is required' : false, 
                      min: 0 
                    })}
                    className="block w-full pl-7 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                  />
                </div>
                {errors.actualPrice && <p className="mt-1 text-sm text-red-600">{errors.actualPrice.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    {...register('discountPrice', { min: 0 })}
                    className="block w-full pl-7 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                  />
                </div>
                {errors.discountPrice && <p className="mt-1 text-sm text-red-600">{errors.discountPrice.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock*</label>
                <input
                  type="number"
                  {...register('stock', { 
                    required: 'Stock is required', 
                    min: 0 
                  })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Variable Product Variants */}
        {productType === 'variable' && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Variants</h2>
            
            {fields.map((field, index) => (
              <div key={field.id} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-700">Variant {index + 1}</h3>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Remove Variant
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Variant Name*</label>
                    <input
                      type="text"
                      {...register(`variants.${index}.variantName`, { 
                        required: 'Variant name is required' 
                      })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. Color, Size"
                    />
                    {errors.variants?.[index]?.variantName && (
                      <p className="mt-1 text-sm text-red-600">{errors.variants[index].variantName.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Actual Price*</label>
                    <input
                      type="number"
                      step="0.01"
                      {...register(`variants.${index}.actualPrice`, { 
                        required: 'Actual price is required',
                        min: 0
                      })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                    />
                    {errors.variants?.[index]?.actualPrice && (
                      <p className="mt-1 text-sm text-red-600">{errors.variants[index].actualPrice.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price</label>
                    <input
                      type="number"
                      step="0.01"
                      {...register(`variants.${index}.discountPrice`, { 
                        min: 0
                      })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                    />
                    {errors.variants?.[index]?.discountPrice && (
                      <p className="mt-1 text-sm text-red-600">{errors.variants[index].discountPrice.message}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => append({ variantName: '', actualPrice: '', discountPrice: '' })}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              Add Another Variant
            </button>
          </div>
        )}

        {/* Description */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Description</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Description*</label>
            <div className="border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
              <CKEditor
                editor={ClassicEditor}
                data={watch('description') || ''}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setValue('description', data);
                }}
                config={{
                  toolbar: [
                    'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote',
                    'insertTable', 'tableColumn', 'tableRow', 'mergeTableCells', '|', 'undo', 'redo'
                  ],
                  editor: {
                    minHeight: '300px'
                  }
                }}
              />
            </div>
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Additional Information</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Information</label>
            <div className="border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
              <CKEditor
                editor={ClassicEditor}
                data={watch('additionalInformation') || ''}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setValue('additionalInformation', data);
                }}
                config={{
                  toolbar: [
                    'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote',
                    'insertTable', 'tableColumn', 'tableRow', 'mergeTableCells', '|', 'undo', 'redo'
                  ],
                  editor: {
                    minHeight: '200px'
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save Product'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VariantProduct;