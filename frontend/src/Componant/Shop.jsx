//new code 
import React, { useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import topbanner from '../assets/Image/bookmyshow/logo/mainbanner/topbanner.jpg'
import { ShopContext } from '../Context/ShopContext';
import { Tooltip } from 'react-tooltip';

import { IoEyeOutline } from "react-icons/io5";
import { useParams } from 'react-router-dom';

import { Link } from 'react-router-dom'
import { MdOutlineStarPurple500 } from "react-icons/md";
import '../assets/Css/ProductSlider.css'
import { useState } from 'react';
import { useEffect } from 'react';
import { IoMdHeartEmpty } from "react-icons/io";

import shopbanner from '../assets/Image/bookmyshow/logo/mainbanner/topbanner/Shoppagebanner.jpg'
import filter from '../assets/Image/icon/filter.png'

import { GoPlus } from "react-icons/go";
import { FiMinus } from "react-icons/fi";



// import leftImg from '../assets/Image/bookmyshow/logo/dummyImg/leftimg.jpg'  



import leftImg from '../assets/Image/bookmyshow/logo/dummyImg/leftdetailpage.jpg'

const Shop = () => {
    const { product, category, subcategory, addToCart, addToWishlist, handleQuickView, filterByPrice,
        clearPrice,
        selectedPrices,
        getFilterProductByPrice, backend_url, openFilter, setOpenFilter } = useContext(ShopContext);

    const { categorySlug: selectedCategorySlug, subcategorySlug } = useParams();

    const [selectedVariants, setSelectedVariants] = useState({});

    const [openCategory, setOpenCategory] = useState(null)

    //  for mobile 
    
    const toggleDropdown = (catId) => {
        setOpenCategory((prev) => (prev === catId ? null : catId));
    };

    const priceRanges = [
        { label: '0 to 499', min: 0, max: 499 },
        { label: '500 to 999', min: 500, max: 999 },
        { label: '1000 to 1499', min: 1000, max: 1499 },
        { label: '1500 to 1999', min: 1500, max: 1999 },
        { label: '2000 to 2499', min: 2000, max: 2499 },
        { label: '2500 to 2999', min: 2500, max: 2999 },
        { label: '3000 and Above', min: 3000, max: Infinity }
    ];

    const selectedCategory = category.find(
        (cat) => cat.slug.toLowerCase() === selectedCategorySlug?.toLowerCase()
    );

    const selectedCategoryId = selectedCategory?._id?.toString();

    const priceFilteredProducts = getFilterProductByPrice();

    const matchedSubcategory = subcategory.find(
        (sub) => sub.slug.toLowerCase() === subcategorySlug?.toLowerCase()
    );
    const selectedSubcategoryId = matchedSubcategory?._id?.toString();


const filteredProducts = priceFilteredProducts.filter((product) => {
    // Category filter - check if product belongs to any selected categories
    const matchesCategory = selectedCategoryId
        ? product.categoryId.some(cat => 
            cat._id.toString() === selectedCategoryId.toString()
          )
        : true;

    // Subcategory filter - check if product belongs to any selected subcategories
    const matchesSubcategory = selectedSubcategoryId
        ? product.subcategoryId.some(sub => 
            sub._id.toString() === selectedSubcategoryId.toString()
          )
        : true;

    return matchesCategory && matchesSubcategory;
});

    const getSubcategoriesByCategory = (categoryId) => {
         return subcategory.filter((sub) => String(sub.categoryId._id) === String(categoryId));
    };


    useEffect(() => {
        if (filteredProducts.length === 0) return;

        const initialVariants = {};
        filteredProducts.forEach((p) => {
            if (p.productType === 'variable' && p.variant && p.variant.length > 0) {
                initialVariants[p._id] = p.variant[0];
            }
        });

        setSelectedVariants(initialVariants);
    }, [selectedCategorySlug, selectedSubcategoryId, product]);




    const handleVariantClick = (productId, variant) => {
        setSelectedVariants((prev) => ({
            ...prev,
            [productId]: variant,
        }));
    };



    const handleAddToCart = (item, e) => {

        const selected = selectedVariants[item._id];

        if (item.productType === 'variable' && !selected) {
            alert("Please select a variant");
            return;
        }

        addToCart(item, selected);
    };

    const handleWishlist = (item) => {
        const selected = selectedVariants[item._id]
        if (item.productType === 'variable' && !selected) {
            alert("Please select a variant");
            return;
        }

        addToWishlist(item, selected);
    }



    //  toggle price range 

    const togglePriceRange = (range) => {

        const alreadySelected = selectedPrices.some(
            (r) => r.min === range.min && r.max === range.max
        );

        const updatedRanges = alreadySelected
            ? selectedPrices.filter((r) => r.min !== range.min || r.max !== range.max)
            : [...selectedPrices, range];

        filterByPrice(updatedRanges);
    };



    return (
        <div className="allproduct_container">
            <img src={shopbanner} width="100%" alt="Shop Banner" />

            <div className="container">


                {/* icon of filter  */}
                <div className="filterbycategory">
                    <h2>FilterBy Category </h2>
                    <div onClick={() => setOpenFilter(true)} >
                        <img src={filter} width='20px' alt="filtericon" />
                    </div>
                </div>

                <div className="shop_container">

                    {/*  mobile asidebar  */}
                    {
                        openFilter && (
                            <>
                                <div className="mobile_overlay" onClick={() => setOpenFilter(false)}></div>

                                <div className="mobile_category">
                                    <div className='mobile_category_header-close'>
                                        <div className="close-btn" onClick={() => setOpenFilter(false)} >✖</div>
                                    </div>
                                    
                                    <div>

                                        <h2> Our Categories</h2>

                                        <ul>
                                            {category.map((cat) => {
                                                const isActive = selectedCategorySlug === cat.slug; 
                                                const subs = getSubcategoriesByCategory(cat._id);

                                                console.log("subs", subs)
                                                const hasSubs = subs.length > 0;
                                                const isOpen = openCategory === cat._id;

                                                return (
                                                    <li key={cat._id}>
                                                        <div
                                                            className={`category_list ${isActive ? 'active' : ''} ${hasSubs ? 'has-subs' : ''}`}
                                                            onClick={() => hasSubs && toggleDropdown(cat._id)}
                                                            style={{ cursor: hasSubs ? 'pointer' : 'default' }}
                                                        >
                                                            <div className='category_link'   >
                                                                <Link
                                                                    to={`/${cat.slug}`}
                                                                    
                                                                    onClick={() => setOpenFilter(false)}
                                                                    style={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
                                                                >
                                                                    {cat.name}

                                                                </Link>

                                                                {hasSubs && (
                                                                    <span style={{ paddingLeft: '10px', userSelect: 'none' }}>
                                                                        {isOpen ? <FiMinus className='icon' /> : <GoPlus className='icon' />}
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {isOpen && hasSubs && (
                                                                <ul className="subcategory-list">
                                                                    {subs.map((sub) => (
                                                                        <li key={sub._id}>

                                                                            <Link
                                                                                to={`/${cat.slug}/${sub.slug}`}
                                                                                onClick={() => setOpenFilter(false)}
                                                                                
                                                                                className={selectedSubcategoryId === sub._id.toString() ? 'active' : ''} >

                                                                                {sub.name}
                                                                            </Link>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                        </div>
                                                    </li>
                                                );
                                            })}

                                        </ul>
                                    </div>
                                    <div className=" filter_by_price_section ">
                                        <div className="clear_all">
                                            <h2>Price</h2>
                                            {selectedPrices.length > 0 && (
                                                <button onClick={clearPrice} className="clear_filter_btn">
                                                    Clear All
                                                </button>
                                            )}
                                        </div>

                                        <ul>
                                            {priceRanges.map((range, index) => (
                                                <label key={index} className='price_lists'   >
                                                    <input
                                                        type="checkbox"

                                                        checked={selectedPrices.some(
                                                            (r) => r.min === range.min && r.max === range.max
                                                        )}
                                                        onChange={() => togglePriceRange(range)}
                                                    />
                                                    {range.label}
                                                </label>
                                            ))}
                                        </ul>
                                    </div>


                                </div>
                            </>
                        )
                    }







                    {/*  desktop side asidebar */}

                    <div className="aside_bar">

                        <div className="categoryName">
                            <h2>Our Categories</h2>
                            <ul>
                                {category.map((cat) => {

                                    const isActive = selectedCategorySlug === cat.slug;
                                    const subs = getSubcategoriesByCategory(cat._id);

                                    // console.log("subs", subs)
                                    const hasSubs = subs.length > 0;

                                    const isOpen = openCategory === cat._id;

                                    return (
                                        <li key={cat._id}>
                                            <div
                                                className={`category_list ${isActive ? 'active' :''} ${hasSubs ? 'has-subs' : ''}`}
                                                onClick={() => hasSubs && toggleDropdown(cat._id)}
                                                style={{ cursor: hasSubs ? 'pointer' : 'default' }}
                                            >
                                                <div className='category_link'>
                                                    <Link
                                                        to={`/${cat.slug}`}
                                                        onClick={(e) => e.stopPropagation()}
                                                        style={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
                                                    >
                                                        {cat.name}

                                                    </Link>

                                                    {hasSubs && (
                                                        <span style={{ paddingLeft: '10px', userSelect: 'none' }}>
                                                            {isOpen ? <FiMinus className='icon' /> : <GoPlus className='icon' />}
                                                        </span>
                                                    )}
                                                </div>

                                                {isOpen && hasSubs && (
                                                    <ul className="subcategory-list">
                                                        {subs.map((sub) => (
                                                            <li key={sub._id}>

                                                                <Link
                                                                    to={`/${cat.slug}/${sub.slug}`}
                                                                    className={selectedSubcategoryId === sub._id.toString() ? 'active' : ''}>
                                                                    {sub.name}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}

                                            </div>


                                        </li>


                                    );
                                })}

                            </ul>
                        </div>

                        {/*  filter by price section */}
                        <div className=" filter_by_price_section ">
                            <div className="clear_all">
                                <h2>Price</h2>
                                {selectedPrices.length > 0 && (
                                    <button onClick={clearPrice} className="clear_filter_btn">
                                        Clear All
                                    </button>
                                )}
                            </div>

                            <ul>
                                {priceRanges.map((range, index) => (
                                    <label key={index} className='price_lists'   >
                                        <input
                                            type="checkbox"

                                            checked={selectedPrices.some(
                                                (r) => r.min === range.min && r.max === range.max
                                            )}
                                            onChange={() => togglePriceRange(range)}
                                        />
                                        {range.label}
                                    </label>
                                ))}
                            </ul>
                        </div>



                        <div className="aside_img">
                            <img src={leftImg} alt="product img" />
                        </div>


                    </div>

                    {/* Product Display */}

                    <div className="allProduct_slide">
                        <div className="product_list mobile_product_grid">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((item) => {

                                    const selectedVariant = selectedVariants[item._id];

                                    const currentPrice = item.productType === 'variable'
                                        ? selectedVariant?.discountPrice
                                        : item.discountedPrice;

                                    const actualPrice = item.productType === 'variable'
                                        ? selectedVariant?.actualPrice
                                        : item.mrp;

                                    return (

                                        <div key={item._id} >
                                            <div className='product_card'>
                                                <div className="product_card_img">
                                                    <Link to={`/product/${item.slug}`}>
                                                        <img src={`${backend_url}${item.image}`} className='product_img' alt={item.name} />
                                                    </Link>
                                                    <div className='icons'>
                                                        <div data-tooltip-id='view-details' data-tooltip-content="View Details" >
                                                            <IoEyeOutline className='icon' onClick={() => handleQuickView(item)} />
                                                        </div>
                                                        <div data-tooltip-id='add-to-wishlist' data-tooltip-content="Add To Wishlist" onClick={() => handleWishlist(item)} >
                                                            <IoMdHeartEmpty className='icon' />
                                                        </div>
                                                        <Tooltip id="view-details"
                                                            place="top"
                                                            style={{ backgroundColor: '#000', color: '#fff', borderRadius: '0px', width: '90px', height: '25px', fontSize: '11px' }} />
                                                        <Tooltip id="add-to-wishlist"
                                                            place="top"
                                                            style={{ backgroundColor: '#000', color: '#fff', borderRadius: '0px', width: '90px', height: '30px', fontSize: '11px' }} />
                                                    </div>
                                                </div>

                                                <div className='about_product_detail'>
                                                    <div className="productslide_detail">
                                                        <Link to={`/product/${item.slug}`}>   <h4>{item.name}</h4></Link>
                                                        {/* <p>Category: {item.category}</p> */}
                                                        <div className="price_section">
                                                            <p>₹{currentPrice}</p>
                                                            <span className='discount_price'>₹{actualPrice}</span>
                                                        </div>
                                                        {item.productType === 'variable' && item.variant && (
                                                            <div className="variant_tabs">
                                                                {item.variant.map((variant, index) => (
                                                                    <button
                                                                        key={index}
                                                                        className={`variant_btn ${selectedVariants[item._id]?.variantName === variant.variantName ? 'active' : ''
                                                                            }`}
                                                                        onClick={() => handleVariantClick(item._id, variant)}
                                                                    >
                                                                        {variant.variantName}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                        <div className='rating_review'>
                                                            <div>
                                                                <MdOutlineStarPurple500 color='#ffa51f' /> <MdOutlineStarPurple500 color='#ffa51f' /><MdOutlineStarPurple500 color='#ffa51f' /> <MdOutlineStarPurple500 color='#ffa51f' />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="cart_btn">
                                                        <Link onClick={() => handleAddToCart(item)}>Add To Cart</Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )







                                })
                            ) : (
                                <p>No products found in this category.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;
