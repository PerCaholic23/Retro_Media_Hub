import React from "react";
// สำคัญมาก: ต้อง Import BrowserRouter, Routes และ Route จาก react-router-dom
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import Providers
import { CartProvider } from "./context/CartContext";

// Import Layout & Protection
import Layout from "./layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Import Pages (ตรวจสอบชื่อไฟล์และ Path ให้ตรงกับโปรเจกต์ของคุณ)
import Login from "./pages/Login"; 
import Home from "./pages/Home";
import RegisterStep1 from "./pages/RegisterStep1";
import RegisterStep2 from "./pages/RegisterStep2";
import Profile from "./pages/Profile";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Store from "./pages/Store";
import CategoryPage from "./pages/CategoryPage";
import Dashboard from "./pages/Dashboard";
import OrderHistory from "./pages/OrderHistory"; // หน้าประวัติการซื้อที่คุณสร้างไว้

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* ----- ส่วนที่ 1: หน้าที่ไม่มีแถบเมนู (Login / Register) ----- */}
          <Route path="/" element={<Login />} />
          <Route path="/register/step1" element={<RegisterStep1 />} />
          <Route path="/register/step2" element={<RegisterStep2 />} />

          {/* ----- ส่วนที่ 2: หน้าที่ใช้ Layout ร่วมกับ Navbar/Footer ----- */}
          <Route element={<Layout />}>
            
            {/* หน้า Home */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            {/* หน้าโปรไฟล์ */}
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />

            {/* หน้าประวัติการซื้อ (เพิ่มตรงนี้เพื่อให้เข้าผ่าน URL /order-history ได้) */}
            <Route 
              path="/order-history" 
              element={
                <ProtectedRoute>
                  <OrderHistory />
                </ProtectedRoute>
              } 
            />

            {/* หน้าชำระเงิน */}
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />

            {/* หน้าอื่นๆ */}
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/store" element={<Store />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
          </Route>

          {/* กรณีพิมพ์ URL มั่วให้แสดง 404 หรือส่งกลับหน้าแรก */}
          <Route path="*" element={<div className="p-10 text-center font-prompt">ไม่พบหน้าที่คุณต้องการ</div>} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;