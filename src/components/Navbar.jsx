import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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

        {/* LOGO */}
        <div>
          <h1
            onClick={() => navigate("/")}
            className="text-2xl font-bold cursor-pointer"
          >
            <span className="text-[#f28c45]">Retro</span>MediaHub
          </h1>
        </div>

        {/* หน้าหลัก */}
        <div className="text-center">
          <button
            onClick={() => navigate("/home")}
            className="text-lg hover:text-[#f28c45] transition"
          >
            หน้าหลัก
          </button>
        </div>

        {/* สินค้า Dropdown */}
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

        {/* ค้นหา */}
        <div className="flex justify-center">
          <div className="flex items-center bg-white rounded-full shadow px-5 py-2 w-80">
            <input
              type="text"
              placeholder="ค้นหาสินค้า..."
              value={search}
              onChange={handleSearchChange}
              className="outline-none px-2 w-full"
            />

            {/* 🔍 Search Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-black hover:text-gray-600 transition"
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

        {/* Profile + Cart */}
        <div className="flex justify-end items-center gap-6">

          {/* Profile */}
          <div
            onClick={() => navigate("/profile")}
            className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center cursor-pointer hover:bg-black hover:text-white transition"
          >
            {/* 👤 Profile Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="12" cy="7" r="4" />
              <path d="M5.5 21a6.5 6.5 0 0113 0" />
            </svg>
          </div>

          {/* 🛒 Cart */}
          <button
            onClick={() => navigate("/cart")}
            className="hover:scale-110 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-black hover:text-gray-600 transition"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h7.72a2 2 0 002-1.61L23 6H6" />
            </svg>
          </button>

        </div>
      </div>
    </nav>
  );
}