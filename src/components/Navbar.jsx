import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// ===== IMPORT IMAGES =====
import Logo from "../image/LogoText.png";
import ProfileIcon from "../image/ProfileIcon.png";
import CartIcon from "../image/CartIcon.png";

export default function Navbar() {
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const search = searchParams.get("search") || "";

  const categories = [
    { name: "CD เพลง", slug: "cd" },
    { name: "แผ่นเสียง", slug: "vinyl" },
    { name: "เทปคาสเซ็ท", slug: "cassette" },
    { name: "โปสเตอร์ศิลปิน", slug: "poster" },
    { name: "เสื้อวง", slug: "tshirt" },
  ];

  const handleSearchChange = (e) => {
    const value = e.target.value;
    navigate(`/home?search=${value}`);
  };

  const handleCategoryClick = (slug) => {
    navigate(`/home?category=${slug}`);
    setShowFilter(false);
  };

  return (
    <nav className="sticky top-0 bg-[#e9eff3] px-20 py-4 z-50 shadow">
      <div className="grid grid-cols-5 items-center">

        {/* ===== LOGO (ใหญ่ขึ้น) ===== */}
        <div>
          <img
            src={Logo}
            alt="Logo"
            onClick={() => navigate("/")}
            className="h-14 cursor-pointer"   // 👈 เดิม h-10
          />
        </div>

        {/* ===== หน้าหลัก ===== */}
        <div className="text-center">
          <button
            onClick={() => navigate("/home")}
            className="text-lg hover:text-[#f28c45] transition"
          >
            หน้าหลัก
          </button>
        </div>

        {/* ===== สินค้า Dropdown ===== */}
        <div className="text-center relative">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="text-lg hover:text-[#f28c45] transition"
          >
            สินค้า ▾
          </button>

          {showFilter && (
            <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-2xl w-56 py-4 z-50">
              {categories.map((item) => (
                <div
                  key={item.slug}
                  onClick={() => handleCategoryClick(item.slug)}
                  className="px-6 py-2 hover:bg-[#f3f6f9] cursor-pointer"
                >
                  {item.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ===== ค้นหา (เอา CD ออก เอาแว่นขยายกลับมา) ===== */}
        <div className="flex justify-center">
          <div className="flex items-center bg-white rounded-full shadow px-5 py-2 w-96">
            <input
              type="text"
              placeholder="ค้นหาสินค้า..."
              value={search}
              onChange={handleSearchChange}
              className="outline-none px-2 w-full text-lg"
            />

            {/* 🔍 แว่นขยาย SVG เดิม */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-black hover:text-gray-600 transition"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>

        {/* ===== Profile + Cart ===== */}
        <div className="flex justify-end items-center gap-8">

          {/* ===== Profile (ใหญ่ขึ้น + เอาวงกลมออก) ===== */}
          <img
            src={ProfileIcon}
            alt="profile"
            onClick={() => navigate("/profile")}
            className="w-10 h-10 cursor-pointer hover:scale-110 transition"
          />

          {/* ===== Cart (ใหญ่ขึ้นเล็กน้อย) ===== */}
          <button
            onClick={() => navigate("/cart")}
            className="hover:scale-110 transition"
          >
            <img
              src={CartIcon}
              alt="cart"
              className="w-8 h-8"
            />
          </button>

        </div>
      </div>
    </nav>
  );
}