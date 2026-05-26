import HomePage from "./components/pages/home.jsx";
import LoginPage from "./components/pages/login.jsx";
import RegisterPage from "./components/pages/register.jsx";
import ForgotPasswordPage from "./components/pages/forgot-password.jsx";
import UserProfile from "./components/pages/user-profile.jsx";
import UserEditProfile from "./components/pages/user-edit-profile.jsx";
import AdminProfile from "./components/pages/admin-profile.jsx";
import AdminEditProfile from "./components/pages/admin-edit-profile.jsx";
import ProductDetail from "./components/pages/product-detail.jsx";
import Header from "./components/layout/hearder.jsx";
import Footer from "./components/layout/footer.jsx";
import Products from "./components/pages/products.jsx";
import CartPage from "./components/pages/cart.jsx";
import CheckoutPage from "./components/pages/checkout.jsx";
import OrderHistoryPage from "./components/pages/orderHistory.jsx";

import { Routes, Route, useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  const authRoutes = ['/login', '/register', '/forgot-password'];
  const showHeaderFooter = !authRoutes.includes(location.pathname);

  return (
    <>
      {showHeaderFooter && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout/:orderId" element={<CheckoutPage />} />
        <Route path="/history" element={<OrderHistoryPage />} />

        
        
        {/* User Routes */}
        <Route path="/user/profile" element={<UserProfile />} />
        <Route path="/user/edit-profile" element={<UserEditProfile />} />
        
        {/* Admin Routes */}
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/admin/edit-profile" element={<AdminEditProfile />} />
        <Route path="/admin/edit-profile/:userId" element={<AdminEditProfile />} />
      </Routes>
      {showHeaderFooter && <Footer />}
    </>
  );
}

export default App;