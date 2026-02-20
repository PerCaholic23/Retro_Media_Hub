import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const search = searchParams.get("search") || "";

  const categories = [
    "CD เพลง",
    "แผ่นเสียง",
    "เทปคาสเซ็ท",
    "โปสเตอร์ศิลปิน",
    "เสื้อวง",
  ];

  const handleSearchChange = (e) => {
    const value = e.target.value;
    navigate(`/home?search=${value}`);
  };

  return (
    <nav className="bg-[#e9eff3] px-20 py-6">
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

        {/* สินค้า */}
        <div className="text-center relative">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="text-lg hover:text-[#f28c45] transition"
          >
            สินค้า ▾
          </button>

          {showFilter && (
            <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-2xl w-56 py-4 z-50">
              {categories.map((item, index) => (
                <div
                  key={index}
                  className="px-6 py-2 hover:bg-[#f3f6f9] cursor-pointer"
                >
                  {item}
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
            🔍
          </div>
        </div>

        {/* Profile + Cart */}
        <div className="flex justify-end items-center gap-6">
          <div
            onClick={() => navigate("/profile")}
            className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center cursor-pointer hover:scale-105 transition"
          >
            👤
          </div>

          <div className="text-2xl cursor-pointer hover:scale-105 transition">
            🛒
          </div>
        </div>

      </div>
    </nav>
  );
}