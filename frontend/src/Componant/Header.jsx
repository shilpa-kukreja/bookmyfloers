import '../assets/Css/Header.css';
import { Link, useNavigate } from 'react-router-dom';
import { GoSearch } from "react-icons/go";
import { BsCartPlus } from "react-icons/bs";
import { FaUser, FaChevronDown, FaSignOutAlt, FaHistory } from "react-icons/fa";
import { IoMdHeartEmpty } from "react-icons/io";
import { useContext, useState, useRef, useEffect } from 'react';
import { ShopContext } from '../Context/ShopContext';
import logo from '../assets/Image/bookmyshow/logo/Logo.png';
import { RxCross2 } from "react-icons/rx";
import { FiMenu } from "react-icons/fi";
import { useLocation } from 'react-router-dom';

const Header = () => {
    const {
        category,
        subcategory,
        toggleCart,
        cart,
        products,
        toggleWishlist,
        wishlist,
        searchProduct,
        user,
        logout,
        openFilter,
        setOpenFilter
        
    } = useContext(ShopContext);

    const [showMenu, setShowMenu] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [showInput, setShowInput] = useState(false);
    const [showCategory, setShowCategory] = useState(true);
    const [activeCategory, setActiveCategory] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const searchBoxRef = useRef(null);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    const isHomeOrDecor = location.pathname === "/" || location.pathname === "/decor";
    const isDecorPage = location.pathname === "/decor";
    const totalCartItem = cart.reduce((p, item) => p + item.quantity, 0);
    const totalWishlistItem = wishlist.length;
    const results = searchProduct(searchInput);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
                setSearchInput("");
            }
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelectProduct = (product) => {
        setSearchInput("");
        setShowInput(false);
        navigate(`/product/${product.slug}`);
    };

    const handleCategoryClick = (slug) => {
        navigate(`/${slug}`);
        setShowCategory(false);
        setShowMenu(false);
    };

    const getSubCategory = (categoryId) => {
        return subcategory.filter((sub) => String(sub.categoryId._id) === String(categoryId));
    };

    const toggleCategoryMenu = () => {
        setShowMenu(false);
        if(windowWidth < 576){
            setOpenFilter(true);
        }
        
    };



   const UserDropdown = () => {
  if (!user) {
    return (
      <div className="user-auth-container">
        <Link to="/login" className="user-login-link">
          <FaUser className="user-login-icon" />
        </Link>
      </div>
    );
  }

  return (
    <div className="user-dropdown-container" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="user-profile-btn"
        aria-expanded={isDropdownOpen}
      >
        <FaUser className="user-profile-icon" />
        <FaChevronDown className={`dropdown-arrow ${isDropdownOpen ? 'dropdown-arrow-open' : ''}`} />
      </button>

      {isDropdownOpen && (
        <div className="dropdown-content">
          <div className="user-welcome">
            <p className="welcome-text">Welcome back</p>
            <p className="username">{user.name.split(' ')[0]}</p>
          </div>
          
          <Link
            to="/order-history"
            className="dropdown-item"
            onClick={() => setIsDropdownOpen(false)}
          >
            <FaHistory className="dropdown-item-icon" />
            <span>Order History</span>
          </Link>
          
          <button
            onClick={() => {
              logout();
              setIsDropdownOpen(false);
              navigate('/');
            }}
            className="dropdown-item logout-btn"
          >
            <FaSignOutAlt className="dropdown-item-icon" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

    return (
        <div className={`header_section ${isHomeOrDecor ? 'header_shadow' : ''} ${isDecorPage ? 'decor_header_bg' : ''}`}>
            <div className="container">
                <div className="navbar">
                    <div className="navlinks">
                        <div className="header_toggle_icon" onClick={() => setShowMenu(true)}>
                            <FiMenu className='icon' size='25px' />
                        </div>

                        <div className={`navlink_sidebar ${showMenu ? 'navlink_active' : ''}`}>
                            <ul>
                                <div className="close-btn" onClick={() => setShowMenu(false)}>✖</div>
                                <li>
                                    <Link to='/' onClick={() => setShowMenu(false)}>Home</Link>
                                </li>
                                <li>
                                    <Link onClick={() => setShowMenu(false)} to='/about-us'>About Us</Link>
                                </li>
                                <li className='dropdown'>
                                    <Link to='/shop' onClick={() => toggleCategoryMenu()}>All Category</Link>
                                    <div className="dropdown_contant">
                                        {showCategory && (
                                            <div className="bmc_category">
                                                {category.map((item, index) => {
                                                    const subs = getSubCategory(item._id);
                                                    const hasSubs = subs.length > 0;

                                                    return (
                                                        <div key={index} className="category_item">
                                                            <p className="category_name" onClick={() => handleCategoryClick(item.slug)}>
                                                                {item.name}
                                                            </p>
                                                            {hasSubs && (
                                                                <div className="subcategory_dropdown">
                                                                    {subs.map((sub) => (
                                                                        <p
                                                                            key={sub._id}
                                                                            className="subcategory_name"
                                                                            onClick={() => { navigate(`/${item.slug}/${sub.id}`); setShowMenu(false); }}
                                                                        >
                                                                            {sub.name}
                                                                        </p>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </li>
                                <li>
                                    <Link to='/shop' onClick={() => setShowMenu(false) }>Shop Now</Link>
                                </li>
                                <li>
                                    <Link to='/blogs' onClick={() => setShowMenu(false)}>Blog</Link>
                                </li>
                                <li>
                                    <Link to='/decor' onClick={() => setShowMenu(false)}>Decor</Link>
                                </li>
                                <li>
                                    <Link to='/contact-us' onClick={() => setShowMenu(false)}>Contact Now</Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="logo">
                        <Link to="/"><img src={logo} alt="Logo" /></Link>
                    </div>

                    <div className="header_right_icons">
                        <div className='product_search' ref={searchBoxRef}>
                            <GoSearch className='icon' onClick={() => setShowInput(prev => !prev)} />
                            {showInput && (
                                <form action="">
                                    <div className="search_input_wrapper">
                                        <input
                                            type="text"
                                            placeholder='Search Products...'
                                            value={searchInput}
                                            onChange={(e) => setSearchInput(e.target.value)}
                                            autoComplete='off'
                                        />
                                        <div className='close_searchbar'>
                                            <RxCross2 className='icon' onClick={() => setShowInput(false)} />
                                        </div>
                                        {searchInput && (
                                            <div className="search_dropdown">
                                                {results.length > 0 ? (
                                                    results.map((item) => (
                                                        <div
                                                            key={item.id}
                                                            className="search_suggestion"
                                                            onClick={() => handleSelectProduct(item)}
                                                        >
                                                            {item.name}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="no_results">No products found</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </form>
                            )}
                        </div>

                        <div className='cart_icon' onClick={toggleWishlist}>
                            <IoMdHeartEmpty className='icon' />
                            <div className="item_quantity">
                                {totalWishlistItem}
                            </div>
                        </div>

                        <div className='cart_icon' onClick={toggleCart}>
                            <BsCartPlus className='icon' />
                            <div className="item_quantity">
                                {totalCartItem}
                            </div>
                        </div>

                        <UserDropdown />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;