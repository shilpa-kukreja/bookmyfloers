// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './layout/Layout';
import Dashboard from './pages/Dashboard';
import Category from './pages/Category';
import AddCategory from './pages/AddCategory';
import EditCategory from './pages/EditCategory';
import SubCategory from './pages/SubCategory';
import AddSubCategory from './pages/AddSubCategory';
import EditSubCategory from './pages/EditSubCategory';
import Product from './pages/Product';
import AddProduct from './pages/AddProduct';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditProduct from './pages/EditProduct';
import Coupons from './pages/Coupons';
import AddCoupons from './pages/AddCoupons';
import EditCoupon from './pages/EditCoupon';
import Blogs from './pages/Blogs';
import AddBlogs from './pages/AddBlogs';
import EditBlog from './pages/EditBlog';
import Contact from './pages/Contact';
import OrdersTable from './pages/OrdersTable';
import AdminOrderDetails from './pages/AdminOrderDetails';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import UserManagement from './pages/UserManagement';

function App() {



  return (
    <Router>
      <div className="app-container">
        <ToastContainer 
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Routes>
          {/* Public route - no layout */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes - with layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="category">
                <Route index element={<Category />} />
                <Route path="add" element={<AddCategory />} />
                <Route path="edit/:id" element={<EditCategory />} />
              </Route>
              <Route path="subcategory">
                <Route index element={<SubCategory />} />
                <Route path="add" element={<AddSubCategory />} />
                <Route path="edit/:id" element={<EditSubCategory />} />
              </Route>
              <Route path="product">
                <Route index element={<Product />} />
                <Route path="add" element={<AddProduct />} />
                <Route path="edit/:id" element={<EditProduct />} />
              </Route>
              <Route path="coupons">
                <Route index element={<Coupons />} />
                <Route path="add" element={<AddCoupons />} />
                <Route path="edit/:id" element={<EditCoupon />} />
              </Route>
              <Route path="blogs">
                <Route index element={<Blogs />} />
                <Route path="add" element={<AddBlogs />} />
                <Route path="edit/:id" element={<EditBlog />} />
              </Route>
              <Route path="contacts">
                <Route index element={<Contact />} />
              </Route>
              <Route path="orders">
                <Route index element={<OrdersTable />} />
                <Route path="view/:id" element={<AdminOrderDetails />} />
              </Route>
              <Route path="users">
                <Route index element={<UserManagement />} />
          
              </Route>
            </Route>
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;