import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import RegisterStep1 from "./pages/RegisterStep1";
import RegisterStep2 from "./pages/RegisterStep2";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import ProductDetail from "./pages/ProductDetail";
import Layout from "./layout/Layout";
import Cart from "./pages/Cart";
import { CartProvider } from "./context/CartContext";
import Checkout from "./pages/Checkout";

function App() {
  return (
    <CartProvider>
    <Router>
      <Routes>

        {/* หน้า Login ไม่ใช้ Layout */}
        <Route path="/" element={<Login />} />
        <Route path="/register/step1" element={<RegisterStep1 />} />
        <Route path="/register/step2" element={<RegisterStep2 />} />

        {/* หน้าที่ใช้ Layout */}
        <Route element={<Layout />}>
          
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route path="/profile" element={<Profile />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route
  path="/checkout"
  element={
    <ProtectedRoute>
      <Checkout />
    </ProtectedRoute>
  }
/>
        </Route>

      </Routes>
    </Router>
    </CartProvider>
  );
}

export default App;