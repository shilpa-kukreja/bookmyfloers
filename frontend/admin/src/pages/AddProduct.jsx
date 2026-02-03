import { useState, useEffect, useRef } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [productType, setProductType] = useState('simple');
  const [fileErrors, setFileErrors] = useState({
    image: '',
    galleryImage: ''
  });
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
      variant: [{ variantName: '', actualPrice: '', discountPrice: '', stock: '' }],
      shortDescription: '',
      description: '',
      additionalInformation: '',
      dimensions: {
        length: '',
        width: '',
        height: '',
      },
      weight: '',
      availability: true,
      status: true
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variant"
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

  
  // Fetch categories and subcategories on component mount
  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const [categoriesRes, subCategoriesRes] = await Promise.all([
          axios.post(`${backend_url}/api/category/all`),
          axios.post(`${backend_url}/api/subcategory/all`)
        ]);
        setCategories(categoriesRes.data.data);
        setSubCategories(subCategoriesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load categories or subcategories' );
      }
    };
    fetchData();
  }, [backend_url]);


  
  // Handle category selection change
  const handleCategoryChange = (e) => {
    const options = Array.from(e.target.selectedOptions).map(option => option.value);
    setValue('categoryId', options);
  };

  // Handle subcategory selection change
  const handleSubcategoryChange = (e) => {
    const options = Array.from(e.target.selectedOptions).map(option => option.value);
    setValue('subcategoryId', options);
  };

  // Validate files before submission
  const validateFiles = () => {
    const newErrors = { image: '', galleryImage: '' };
    let isValid = true;

    if (!mainImagePreview) {
      newErrors.image = 'Main image is required';
      isValid = false;
    }

    if (galleryPreviews.length === 0) {
      newErrors.galleryImage = 'At least one gallery image is required';
      isValid = false;
    }

    setFileErrors(newErrors);
    return isValid;
  };

  // Handle main image upload with validation
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setFileErrors(prev => ({ ...prev, image: 'Image size should be less than 2MB' }));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result);
        setFileErrors(prev => ({ ...prev, image: '' }));
      };
      reader.readAsDataURL(file);
    } else {
      setFileErrors(prev => ({ ...prev, image: 'Main image is required' }));
    }
  };

  // Handle gallery images upload with validation
  const handleGalleryImagesChange = (e) => {
    const files = Array.from(e.target.files);
    let isValid = true;
    const newErrors = [];

    if (files.length + galleryPreviews.length > 10) {
      setFileErrors(prev => ({ ...prev, galleryImage: 'Maximum 10 images allowed' }));
      isValid = false;
    }

    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        newErrors.push(`Image ${file.name} exceeds 2MB`);
        return false;
      }
      return true;
    });

    if (!isValid || newErrors.length > 0) {
      setFileErrors(prev => ({
        ...prev,
        galleryImage: newErrors.length > 0 ? newErrors.join(', ') : 'Maximum 10 images allowed'
      }));
      return;
    }

    if (validFiles.length === 0) {
      setFileErrors(prev => ({ ...prev, galleryImage: 'Please select valid images' }));
      return;
    }

    const newPreviews = [];
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);

        if (newPreviews.length === validFiles.length) {
          setGalleryPreviews(prev => [...prev, ...newPreviews]);
          setFileErrors(prev => ({ ...prev, galleryImage: '' }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove gallery image and update validation
  const removeGalleryImage = (index) => {
    // console.log(index);
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));

    if (galleryInputRef.current) {
      galleryInputRef.current.value = '';
    }

    if (galleryPreviews.length > 1) {
      setFileErrors(prev => ({ ...prev, galleryImage: '' }));
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
    // Validate files first
    if (!validateFiles()) {
      toast.error('Please fix the file upload errors');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();


      // Append all fields
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'categoryId' || key === 'subcategoryId') {
          value.forEach(id => formData.append(`${key}[]`, id));
        } else if (key === 'dimensions') {
          formData.append('dimensions[length]', value.length);
          formData.append('dimensions[width]', value.width);
          formData.append('dimensions[height]', value.height);
        } else if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      if (data.productType === 'variable') {
      // Format variants properly before stringifying
      const provariants = data.variant.map(v => ({
        variantName: v.variantName,
        actualPrice: parseFloat(v.actualPrice),
        discountPrice: parseFloat(v.discountPrice || v.actualPrice),
        stock: parseInt(v.stock)
      }));
      
      // Stringify the array of variant objects
      formData.append('provariants', JSON.stringify(provariants));
    }

      // Append main image
      const mainImageInput = document.querySelector('input[name="image"]');
      if (mainImageInput?.files[0]) {
        formData.append('image', mainImageInput.files[0]);
      }

 

      // Append gallery images
      const galleryInput = document.querySelector('input[name="galleryImage"]');
      if (galleryInput?.files) {
        Array.from(galleryInput.files).forEach(file => {
          formData.append('galleryImage', file);
        });
      }

      const response = await axios.post(`${backend_url}/api/product/add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success(response.data.message);
      navigate('/product');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto px-4 py-8 ">
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
        {/* Product Type */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Product Type</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:border-blue-400 transition-colors flex-1">
              <input
                type="radio"
                value="simple"
                {...register('productType')} // This handles the value
                checked={productType === 'simple'}
                onChange={() => setProductType('simple')}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="block text-sm font-medium text-gray-900">Simple Product</span>
                <span className="block text-sm text-gray-500">A single product with no variants</span>
              </div>
            </label>
            <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:border-blue-400 transition-colors flex-1">
              <input
                type="radio"
                value="variable"
                 {...register('productType')} // This handles the value
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
                readOnly
              />
              {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU*</label>
              <input
                type="text"
                {...register('sku', { required: 'SKU is required' })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. PROD-001"
              />
              {errors.sku && <p className="mt-1 text-sm text-red-600">{errors.sku.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section*</label>
              <select
                {...register('section', { required: 'Section is required' })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="bestseller">Bestseller</option>
                <option value="featured">Featured</option>
                <option value="new">New Arrivals</option>
                <option value="regular">Regular</option>
              </select>
              {errors.section && <p className="mt-1 text-sm text-red-600">{errors.section.message}</p>}
            </div>
          </div>
        </div>

        {/* Categories and Subcategories */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Categories</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categories*</label>
              <select
                {...register('categoryId', {
                  required: 'At least one category is required',
                  validate: value => value.length > 0 || 'At least one category is required'
                })}
                onChange={handleCategoryChange}
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
                onChange={handleSubcategoryChange}
                multiple
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-auto min-h-[42px]"
              >
                {subCategories.map((subCategory) => (
                  <option key={subCategory._id} value={subCategory._id}>
                    {subCategory.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Images</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Main Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Main Image*
                {fileErrors.image && (
                  <span className="text-red-500 text-xs ml-2">{fileErrors.image}</span>
                )}
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  {mainImagePreview ? (
                    <img src={mainImagePreview} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-gray-500">PNG, JPG (MAX. 2MB)</p>
                    </div>
                  )}
                  <input
                    id="main-image"
                    type="file"
                    name="image"
                    onChange={handleMainImageChange}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
              </div>
            </div>

            {/* Gallery Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gallery Images (Max 10)*
                {fileErrors.galleryImage && (
                  <span className="text-red-500 text-xs ml-2">{fileErrors.galleryImage}</span>
                )}
              </label>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
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
                      name="galleryImage"
                      onChange={handleGalleryImagesChange}
                      className="hidden"
                      accept="image/*"
                      multiple
                      ref={galleryInputRef}
                    />
                  </label>
                </div>

                {galleryPreviews.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {galleryPreviews.map((preview, index) => (
                      <div key={index} className="relative group h-24">
                        <img
                          src={preview}
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
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Pricing & Inventory</h2>

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

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Variant Name*</label>
                    <input
                      type="text"
                      {...register(`variant.${index}.variantName`, {
                        required: 'Variant name is required'
                      })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. Color, Size"
                    />
                    {errors.variant?.[index]?.variantName && (
                      <p className="mt-1 text-sm text-red-600">{errors.variant[index].variantName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Actual Price*</label>
                    <input
                      type="number"
                      step="0.01"
                      {...register(`variant.${index}.actualPrice`, {
                        required: 'Actual price is required',
                        min: 0
                      })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                    />
                    {errors.variant?.[index]?.actualPrice && (
                      <p className="mt-1 text-sm text-red-600">{errors.variant[index].actualPrice.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price</label>
                    <input
                      type="number"
                      step="0.01"
                      {...register(`variant.${index}.discountPrice`, {
                        min: 0
                      })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                    />
                    {errors.variant?.[index]?.discountPrice && (
                      <p className="mt-1 text-sm text-red-600">{errors.variant[index].discountPrice.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock*</label>
                    <input
                      type="number"
                      {...register(`variant.${index}.stock`, {
                        required: 'Stock is required',
                        min: 0
                      })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.variant?.[index]?.stock && (
                      <p className="mt-1 text-sm text-red-600">{errors.variant[index].stock.message}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => append({ variantName: '', actualPrice: '', discountPrice: '', stock: '' })}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              Add Another Variant
            </button>
          </div>
        )}

        {/* Dimensions & Weight */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Dimensions & Weight</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Length (cm)</label>
              <input
                type="number"
                step="0.01"
                {...register('dimensions.length')}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Width (cm)</label>
              <input
                type="number"
                step="0.01"
                {...register('dimensions.width')}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
              <input
                type="number"
                step="0.01"
                {...register('dimensions.height')}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)*</label>
              <input
                type="text"
                {...register('weight', { required: 'Weight is required' })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. 0.5kg"
              />
              {errors.weight && <p className="mt-1 text-sm text-red-600">{errors.weight.message}</p>}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Description</h2>

          <div className='mt-5'>
            <label className="block text-sm font-medium text-gray-700 mb-2">Short Description*</label>
            <div className="border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
              <Controller
                name="shortDescription"
                control={control}
                rules={{ required: 'Short description is required' }}
                render={({ field }) => (
                  <CKEditor
                    editor={ClassicEditor}
                    data={field.value}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      field.onChange(data);
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
                )}
              />
            </div>
            {errors.shortDescription && <p className="mt-1 text-sm text-red-600">{errors.shortDescription.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">Product Description*</label>
            <div className="border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
              <Controller
                name="description"
                control={control}
                rules={{ required: 'Description is required' }}
                render={({ field }) => (
                  <CKEditor
                    editor={ClassicEditor}
                    data={field.value}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      field.onChange(data);
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
                )}
              />
            </div>
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
          </div>

          <div className='mt-4'>
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Information</label>
            <div className="border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
              <Controller
                name="additionalInformation"
                control={control}
                render={({ field }) => (
                  <CKEditor
                    editor={ClassicEditor}
                    data={field.value}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      field.onChange(data);
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
                )}
              />
            </div>
          </div>
        </div>

        {/* SEO Meta Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">SEO Meta Information</h2>
          
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
              <input
                type="text"
                {...register('metaTitle')}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Product meta title for SEO"
                maxLength={60}
              />
              <p className="mt-1 text-xs text-gray-500">Recommended length: 50-60 characters</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
              <textarea
                {...register('metaDescription')}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Product meta description for SEO"
                maxLength={160}
              />
              <p className="mt-1 text-xs text-gray-500">Recommended length: 150-160 characters</p>
            </div>
          </div>
        </div>

        {/* Status & Availability */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Status & Availability</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="status"
                {...register('status')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                defaultChecked
              />
              <label htmlFor="status" className="ml-2 block text-sm text-gray-900">
                Active
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="availability"
                {...register('availability')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                defaultChecked
              />
              <label htmlFor="availability" className="ml-2 block text-sm text-gray-900">
                Available for purchase
              </label>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/product')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''
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

export default AddProduct;