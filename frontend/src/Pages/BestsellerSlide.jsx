import React, { useContext, useEffect } from 'react'

import { useState } from 'react'

import { ShopContext } from '../Context/ShopContext'
import { Tooltip } from 'react-tooltip';

import { IoEyeOutline } from "react-icons/io5";

import { Link } from 'react-router-dom'
import { MdOutlineStarPurple500 } from "react-icons/md";

import { IoMdHeartEmpty } from "react-icons/io";

import leftimg from '../assets/Image/bookmyshow/logo/dummyImg/bestsellerleft.jpg'


import bestseller from "../assets/Image/bookmyshow/logo/dummyImg/bestsellerlef.jpg"

const BestsellerSlide = () => {

    const { product, addToCart, addToWishlist, handleQuickView, backend_url } = useContext(ShopContext);
    const [bestsellerProduct, setBestsellerProduct] = useState([]);
    const [selectVariant, setSelectVariant] = useState({})

    useEffect(() => {
        if (Array.isArray(product)) {
            // Filter only "bestseller" products
            const bestSellers = product.filter(p => p.section?.toLowerCase() === "bestseller");

            // Get the last 6 bestsellers
            const lastSix = bestSellers.slice(-6);

            setBestsellerProduct(lastSix);


            const initialVariants = {};
            bestSellers.forEach(p => {
                if (p.productType === 'variable' && p.variant && p.variant.length > 0) {
                    initialVariants[p._id] = p.variant[0];
                }
            });
            setSelectVariant(initialVariants);
        }
    }, [product]);


    console.log("allbestSellerProduct", bestsellerProduct)



    const handleVariantClick = (productId, variant) => {
        setSelectVariant(prev => ({ ...prev, [productId]: variant }));
    };


    const handleAddToCart = (product) => {
        const selected = selectVariant[product._id];

        if (product.productType === 'variable' && !selected) {
            alert("Please select a variant");
            return;
        }

        addToCart(product, selected);
    };



    const handleWishlist = (product) => {
        const selected = selectVariant[product._id]
        if (product.productType === 'variable' && !selected) {
            alert("Please select a variant");
            return;
        }

        addToWishlist(product, selected);
    }



    return (
        <div className='bestsellerslide_section'>
            <div className="container">

                <div className='common_headline'>
                    <div>
                        <div className='agarbatti_img'>
                           
                            <h2> Customer Favorites </h2>
                        </div>
                        <p>Explore our top-selling bouquets — handpicked for beauty, freshness, and unforgettable charm.
                        </p>
                    </div>
                </div>

                <div className="bestseller_grid">

                    <div className="bestseller_video">
                        {/* <video src={incensevideo} autoPlay muted loop width='100%'  ></video> */}
                        <img src={bestseller} height="100%" alt="" />

                        <div className="overlay_text">

                        </div>
                    </div>

                    <div className="bestseller_products">

                        <div className="grid_box">
                            {
                                bestsellerProduct.map(product => {
                                    const currentPrice = selectVariant[product._id]?.discountPrice || product.discountedPrice;
                                    const actualPrice = selectVariant[product._id]?.actualPrice || product.mrp;

                                    return (


                                        <div key={product._id}>

                                            <div className='product_card'>
                                                <div className="product_card_img">
                                                    <Link to={`product/${product.slug}`}>

                                                        <img src={`${backend_url}${product.image}`} alt={product.name} />
                                                    </Link>


                                                    <div className='icons'>


                                                        <div data-tooltip-id='view-details' data-tooltip-content="View Details" >
                                                            <IoEyeOutline className='icon' onClick={() => handleQuickView(product)} />

                                                        </div>
                                                        <div data-tooltip-id='add-to-wishlist' data-tooltip-content="Add To Wishlist">
                                                            <IoMdHeartEmpty className='icon' onClick={() => handleWishlist(product)} />
                                                        </div>

                                                        {/*  tool top */}



                                                        <Tooltip id="view-details"
                                                            place="top"
                                                            style={{ backgroundColor: '#000', color: '#fff', borderRadius: '0px', width: '90px', height: '28px', fontSize: '11px' }} />
                                                        <Tooltip id="add-to-wishlist"
                                                            place="top"
                                                            style={{ backgroundColor: '#000', color: '#fff', borderRadius: '0px', width: '90px', height: '30px', fontSize: '11px' }} />
                                                    </div>
                                                </div>

                                                <div className='about_product_detail'>

                                                    <div className="productslide_detail">

                                                          <Link to={`product/${product.slug}`}>      <h4>{product.name}</h4> </Link>
                                                     
                                                        <div className="price_section">
                                                            <p>₹{currentPrice}</p>
                                                            <span className='discount_price'>₹{actualPrice}</span>
                                                        </div>
                                                        {product.productType === 'variable' && (
                                                            <div className="variant_tabs">
                                                                {product.variant?.map((variant, index) => (
                                                                    <button
                                                                        key={index}
                                                                        className={`variant_btn ${selectVariant[product._id]?.variantName === variant.variantName ? 'active' : ''}`}
                                                                        onClick={() => handleVariantClick(product._id, variant)}
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
                                                            <div>
                                                                {/* 23 reviews */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="cart_btn">
                                                        <Link onClick={() => handleAddToCart(product)}>Add To Cart</Link>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default BestsellerSlide