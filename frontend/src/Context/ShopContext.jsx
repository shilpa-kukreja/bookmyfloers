import { createContext, useEffect, useState } from 'react'

// import { category, subcategory } from '../assets/assets'
// import { product } from '../assets/assets'
// import { blog } from '../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'



export const ShopContext = createContext()

const ShopContextProvider = (props) => {

  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [wishlist, setWishlist] = useState([])
  const [showWishlist, setShowWishlist] = useState(false)
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const backend_url = import.meta.env.VITE_BACKEND_URL || 'https://bookmyflowers.shop';
  const [loadingCoupons, setLoadingCoupons] = useState(false);
  const [category, setCategory] = useState([]);
  const [subcategory, setSubcategory] = useState([]);
  const [blog, setBlog] = useState([]);
  const [product, setProduct] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);
  const [openFilter, setOpenFilter] = useState(false)
    // Function to verify token and set user
  const verifyToken = async () => {
   
    if (!token) {
      // setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${backend_url}/api/auth/validate`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setUser(response.data.user);
      } else {
        // logout();
      }
    } catch (error) {
      // logout();
      // console.log(error);
    } finally {
      // setLoading(false);
    }
  };

  // Function to logout user
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    // navigate('/');
  };

  // Verify token on initial load
  useEffect(() => {
    verifyToken();
  }, [token]);

   useEffect(() => {
        const fetchCategories = async () => {
            try {
                // setLoading(true);
                const response = await fetch(`${backend_url}/api/category/all`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // Add authorization header if needed
                        // 'Authorization': `Bearer ${token}`
                    },
                    // Add body if your endpoint requires it
                    // body: JSON.stringify({ someData: true })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                
                if (data.success) {
                    setCategory(data.data);
                        // console.log ("all category",data.data);
                } else {
                    throw new Error(data.message || 'Failed to load categories');
                }
            } catch (err) {
                // console.error('Error fetching categories:', err);
                toast.error('Failed to load categories');
            } finally {
                // setLoading(false);
            }
        };

        fetchCategories();

        // Optional: Cleanup function
        return () => {
            // Cancel any pending requests if component unmounts
        };
    }, []); // Empty dependency array means this runs once on mount

   useEffect(() => {
        const fetchSubCategories = async () => {
            try {
                // setLoading(true);
                const response = await fetch(`${backend_url}/api/subcategory/all`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // Add authorization header if needed
                        // 'Authorization': `Bearer ${token}`
                    },
                    // Add body if your endpoint requires it
                    // body: JSON.stringify({ someData: true })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setSubcategory(data);
                
            } catch (err) {
                console.error('Error fetching subcategories:', err);
                toast.error('Failed to load subcategories');
            } finally {
                // setLoading(false);
            }
        };

       fetchSubCategories();

        // Optional: Cleanup function
        return () => {
            // Cancel any pending requests if component unmounts
        };
    }, []); // Empty dependency array means this runs once on mount


    useEffect(() => {
    
    const fetchBlogs = async () => {
      try {

        const response = await axios.post(`${backend_url}/api/blog/all`);
         
        if (response.data.success) {
       
          setBlog(response.data.data);
    
        } else {
           toast.error('Failed to load blogs');
        }
      } catch (err) {
        toast.error('Failed to load blogs');
      } finally {
          
      }
    };
    fetchBlogs();
       return () => {
            // Cancel any pending requests if component unmounts
        }; 
  }, []);

    useEffect(() => {
    
    const fetchAllProduct = async () => {
      try {

        const response = await axios.post(`${backend_url}/api/product/all`);
        
        if (response.data.success) {
          // console.log(response.data.products);
          setProduct(response.data.products);
        } else {
           toast.error('Failed to load Products');
        }
      } catch (err) {
        toast.error('Failed to load Products' + err);
      } finally {
          
      }
    };
    fetchAllProduct();
       return () => {
            // Cancel any pending requests if component unmounts
        }; 
  }, []);

  



  const closeQuickView = () => {
    setQuickViewOpen(false);
    setQuickViewProduct(null);
  };


  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const handleQuickView = (product) => {
    if (product) {
      setQuickViewProduct(product);
      setQuickViewOpen(true);
      document.body.style.overflow = 'hidden';
    } else {
      setQuickViewProduct(null);
      setQuickViewOpen(false);
      document.body.style.overflow = 'auto';
    }
  };



  // getlocalstorrage data 


  useEffect(() => {
    const savedCart = localStorage.getItem('cartData');
    if (savedCart) setCart(JSON.parse(savedCart));
    const savedWishlist = localStorage.getItem('wishlistData');
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  // console.log('cart add in local storage', cart)
  // console.log('wishlist add in local storage', wishlist)


  //  add locatstorage
  useEffect(() => {
    localStorage.setItem("cartData", JSON.stringify(cart))
    localStorage.setItem("wishlistData", JSON.stringify(wishlist))

  }, [cart, wishlist])


  const addToCart = (product, variant = null, quantity = 1) => {
    const productId = product._id
    const variantName = variant ? variant.variantName : null
    // check same product 
    const existingIndex = cart.findIndex(
      (item) => item.id === productId && item.variantName === variantName
    )


    if (existingIndex !== -1) {

      const updateCart = [...cart]
      updateCart[existingIndex].quantity += quantity
      setCart(updateCart)
      toast.success("Item quantity already  updated in cart");
    }
    else {
      setCart((prevCart) => [
        ...prevCart, {
          id: productId,
          name: product.name,
          slug: product.slug,
          variantName: variantName,

          discountPrice: variant ? variant.discountPrice : product.discountedPrice,
          actualPrice: variant ? variant.actualPrice : product.mrp,
          quantity: quantity,
          thumbImg:product.image,
          productType: product.productType,
          sku: product.sku,
          category: product.category,
        }
      ])
      toast.success("Item added to cart");
    }
  }



  const searchProduct = (query) => {
    if (!query) return product;

    return product.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    )
  }





  const toggleCart = () => setShowCart(prev => !prev)
  const toggleWishlist = () => setShowWishlist(prev => !prev)







  const removeCart = (productId, variantName = null) => {
    const updateCart = cart.filter(
      (item) => item.id !== productId || item.variantName !== variantName
    )
    setCart(updateCart)
    toast.error("Item removed from cart.")
  }


  const addToWishlist = (product, variant = null) => {
    const productId = product._id
    const variantName = variant ? variant.variantName : null
    // console.log("variant", variant);

    // check same product 

    const existingIndex = wishlist.findIndex(

      (item) => item.id === productId && item.variantName === variantName
    )
 


    if (existingIndex !== -1) {

      // const updateCart = [...wishlist]
      // updateCart[existingIndex].quantity += 1
      // setCart(updateCart)
      toast.success("Item already in wishlist.");
    }
    else {
      setWishlist((prevWishlist) => [
        ...prevWishlist, {
          id: productId,
          name: product.name,
          slug: product.slug,
          variantName: variantName,
          discountPrice: variant ? variant.discountPrice : product.discountedPrice,
          actualPrice: variant ? variant.actualPrice : product.mrp,
          quantity: 1,
          image:  product.image,
          productType: product.productType,
          sku: product.sku,
          category: product.category,
        }
      ])

      toast.success("Item added to wishlist");
    }
  }


  const removeWishlist = (productId) => {
    const updateWishlist = wishlist.filter((item) => item.id !== productId
    )
    setWishlist(updateWishlist)
    toast.error('item removed from wishlist')
  }


  const increseQuantity = (productId, variantName = null) => {
    const updateCart = cart.map((item) =>
      item.id === productId && item.variantName === variantName
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    setCart(updateCart);
  };


  const decreaseQuantity = (productId, variantName = null) => {
    const updateCart = cart.map((item) =>
      item.id === productId && item.variantName === variantName ? { ...item, quantity: Math.max(item.quantity - 1, 1) } : item
    )
    setCart(updateCart)
  }


  //  filter by price

  const filterByPrice = (ranges) => {

    setSelectedPrices(ranges)

  }
  const clearPrice = () => {

    setSelectedPrices([])

  }

  const getFilterProductByPrice = () => {
    if (selectedPrices.length === 0) return product;

    return product.filter((p) => {
      let price;


      if (p.productType === 'variable' && Array.isArray(p.variant) && p.variant.length > 0) {
        price = Math.min(...p.variant.map(v => v.discountPrice));
      } else {
        // For simple product
        price = p.discountPrice;
      }

      // Check if price is within any selected range
      return selectedPrices.some((range) => price >= range.min && price <= range.max);
    });
  };


  


    useEffect(() => {
            fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        setLoadingCoupons(true);
        try {
            const response = await fetch(`${backend_url}/api/coupons/all`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            const data = await response.json();
            if (data.success) {
                setCoupons(data.data);
            } else {
                toast.error(data.message || 'Failed to load coupons');
            }
        } catch (err) {
            toast.error('Network error. Please try again.');
            console.error('Error fetching coupons:', err);
        } finally {
            setLoadingCoupons(false);
        }
    };




  const value = {
    user,
    setUser,
    token,
    setToken,
    logout,
    category,
    subcategory,
    product,
    blog,
    cart,
    showCart,
    addToCart,
    toggleCart,
    removeCart,
    coupons, 
    setCoupons,
    showWishlist,
    toggleWishlist,
    wishlist,
    addToWishlist,
    removeWishlist,
    increseQuantity,
    decreaseQuantity,
    closeQuickView,
    quickViewOpen, setQuickViewOpen,
    handleQuickView,
    quickViewProduct, setQuickViewProduct,
    searchProduct,
    // closeQuickView, setQuickViewVisible,setQuickViewProduct,quickViewProduct,quickViewVisible
    loadingCoupons, 
    setLoadingCoupons,
    filterByPrice,
    clearPrice,
    selectedPrices,
    getFilterProductByPrice,
    backend_url,
    openFilter,
    setOpenFilter
  }



  return (


    <div>

      <ShopContext.Provider value={value}>

        {
          props.children
        }
      </ShopContext.Provider>




    </div>



  )
}

export default ShopContextProvider