

import Header from './Componant/Header'
import Home from './Pages/Home'
import IncenseSmoke from './Componant/IncenseSmock'
import Footer from './Componant/Footer'
import AboutUsPage from './Componant/AboutUsPage'
import { BrowserRouter, Routes, Route, } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Contact from './Componant/Contact'
import BlogPage from './Pages/BlogPage'
import ProductDetail from './Pages/ProductDetail'
import CartSlide from './Componant/CartSlide'
import Shop from './Componant/Shop'
import WishlistSlide from './Componant/WishlistSlide'
import QuickView from './Pages/QuickView'
import Checkout from './Pages/Checkout'
import BlogDetail from './Pages/BlogDetail'
import PrivacyPolicy from './Pages/PrivacyPolicy'
import TermCondition from './Pages/TermCondition'
import { Link } from 'react-router-dom'
import LogIn from './Componant/LogIn'
import SignUp from './Componant/SignUp'
import ForgotPassword from './Componant/ForgotPassword'
import ScrollToTop from './Componant/ScrollToTop'
import { FaWhatsapp } from "react-icons/fa";
import { IoMdCall } from "react-icons/io";
//  import whiteTexture from '../src/assets/Image/bookmyshow/logo/mainbanner/whiteTexture.jpg'
import maintexture from '../src/assets/Image/icon/maintextture.jpg'
import Error from './Componant/Error'

import Decor from './Componant/Decor'
import ResetPassword from './Componant/ResetPassword'
import OrderConfirmation from './Pages/OrderConfirmation'
import OrderHistory from './Pages/OrderHistory'
const App = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${maintexture})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        width: '100%',
        minHeight: '100vh',
      }}
    >

      <BrowserRouter>

        <ToastContainer />
        <ScrollToTop />


        {/* <IncenseSmoke/> */}
        <Header />

        <Routes>

          <Route path='/' element={<Home />} />
          <Route path='/about-us' element={<AboutUsPage />} />
          <Route path='/contact-us' element={<Contact />} />
          <Route path='/blogs' element={<BlogPage />} />
          <Route path='/blog/:slug' element={<BlogDetail />} />
          <Route path='/shop' element={<Shop />} />
          <Route path="/:categorySlug" element={<Shop />} />
            <Route path="/:categorySlug/:subcategorySlug" element={<Shop />} />




          <Route path='/login' element={<LogIn />} />
          <Route path='/signup' element={<SignUp />} />

          {/* <Route path="/shop/category/:categoryId" element={<Shop />} /> */}

          <Route path='/product/:slug' element={<ProductDetail />} />

          <Route path='/checkout' element={<Checkout />} />
          <Route path='/terms-conditions' element={<TermCondition />} />
          <Route path='/privacy-policy' element={<PrivacyPolicy />} />


          <Route path='/reset-password/:token' element={<ResetPassword />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/order-confirmation' element={<OrderConfirmation />} />
           <Route path="/order-history" element={<OrderHistory />} />


          <Route path='/decor' element={<Decor />} />

          <Route path='*' element={<Error/>} />



        </Routes>

        <QuickView />

        <CartSlide />
        <WishlistSlide />

        <Footer />


















        <div className="decor_btn">
          <button> <Link to='/decor'> Last Moment Decor! </Link></button>
        </div>


        {/*  icon watsapp or call */}

        <a href="tel:9811296262" target="_blank" className="btn-call-pulse">
          <IoMdCall className="icon"  />          
        </a>

        <a href="https://wa.me/9811296262" target="_blank" className="btn-whatsapp-pulse">
          <FaWhatsapp  className='icon' /> 
          
          
        </a>





      </BrowserRouter>














    </div>
  )
}

export default App