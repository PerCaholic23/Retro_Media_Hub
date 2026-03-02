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
    <nav className="sticky top-0 bg-[#e9eff3] px-10 md:px-20 py-4 z-50 shadow-sm">
      <div className="flex items-center justify-between">
        
        {/* ===== ฝั่งซ้าย: LOGO ===== */}
        <div className="flex-shrink-0">
          <img
            src={Logo}
            alt="Logo"
            onClick={() => navigate("/home")}
            className="h-14 cursor-pointer"
          />
        </div>

        {/* ===== ตรงกลาง: รวม (หน้าหลัก + สินค้า + ค้นหา) ===== */}
        <div className="flex items-center gap-10">
          {/* เมนูลิงก์ */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => navigate("/home")}
              className="text-lg font-medium hover:text-[#f28c45] transition whitespace-nowrap"
            >
              หน้าหลัก
            </button>

            <div className="relative">
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="text-lg font-medium hover:text-[#f28c45] transition whitespace-nowrap"
              >
                สินค้า ▾
              </button>

              {showFilter && (
                <div className="absolute top-10 left-0 bg-white shadow-xl rounded-2xl w-56 py-4 z-[60] border border-gray-100">
                  {categories.map((item) => (
                    <div
                      key={item.slug}
                      onClick={() => handleCategoryClick(item.slug)}
                      className="px-6 py-2 hover:bg-[#f3f6f9] hover:text-[#f28c45] cursor-pointer transition"
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ช่องค้นหา */}
          <div className="flex items-center bg-white rounded-full shadow-inner px-5 py-2 w-64 lg:w-96 border border-gray-200 focus-within:border-[#f28c45] transition-all">
            <input
              type="text"
              placeholder="ค้นหาสินค้า..."
              value={search}
              onChange={handleSearchChange}
              className="outline-none px-2 w-full text-base lg:text-lg bg-transparent"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
        </div>

        {/* ===== ฝั่งขวา: Profile + Cart ===== */}
        <div className="flex items-center gap-6 flex-shrink-0">
          <img
            src={ProfileIcon}
            alt="profile"
            onClick={() => navigate("/profile")}
            className="w-9 h-9 cursor-pointer hover:scale-110 transition opacity-80 hover:opacity-100"
          />

          <button
            onClick={() => navigate("/cart")}
            className="hover:scale-110 transition relative"
          >
            <img
              src={CartIcon}
              alt="cart"
              className="w-9 h-9 opacity-80 hover:opacity-100"
            />
          </button>
        </div>

      </div>
    </nav>
  );
}