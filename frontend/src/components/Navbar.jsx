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
          {/* <div className="flex items-center gap-8">
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
          </div> */}

<div className="flex items-center gap-12">
  
  {/* --- หน้าหลัก --- */}
  <div className="relative group">
    <button
      onClick={() => navigate("/home")}
      className="text-lg font-normal text-gray-500 hover:text-gray-900 transition-colors duration-300 whitespace-nowrap pb-1.5"
    >
      หน้าหลัก
      {/* เส้นใต้บางเฉียบสไตล์ Minimal */}
      <span className="absolute bottom-0 left-1/2 w-0 h-[1.5px] bg-[#f28c45] transition-all duration-300 group-hover:w-full group-hover:left-0 rounded-full"></span>
    </button>
  </div>

  {/* --- สินค้า (Dropdown) --- */}
  <div 
    className="relative group"
    onMouseEnter={() => setShowFilter(true)}
    onMouseLeave={() => setShowFilter(false)}
  >
    <button
      className={`text-lg font-normal transition-colors duration-300 whitespace-nowrap pb-1.5 flex items-center gap-1.5 ${showFilter ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-900'}`}
    >
      สินค้า
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={`h-3.5 w-3.5 transition-transform duration-500 ${showFilter ? 'rotate-180 text-[#f28c45]' : 'text-gray-400'}`} 
        fill="none" viewBox="0 0 24 24" stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
      </svg>
      {/* เส้นใต้บางเฉียบที่วิ่งขยายจากกึ่งกลาง */}
      <span className={`absolute bottom-0 h-[1.5px] bg-[#f28c45] transition-all duration-300 rounded-full ${showFilter ? 'w-full left-0' : 'w-0 left-1/2 group-hover:w-full group-hover:left-0'}`}></span>
    </button>

    {/* Dropdown Menu - เน้นความเบาและนุ่มนวล */}
    <div className={`
      absolute top-full left-[-15px] pt-3 z-[60] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
      ${showFilter ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-2 invisible pointer-events-none'}
    `}>
      <div className="bg-white/95 shadow-[0_10px_30px_rgba(0,0,0,0.05)] rounded-xl w-52 py-3 border border-gray-50">
        {categories.map((item) => (
          <div
            key={item.slug}
            onClick={() => {
              handleCategoryClick(item.slug);
              setShowFilter(false);
            }}
            className="px-6 py-2 hover:text-[#f28c45] cursor-pointer transition-all flex items-center group/item"
          >
            <span className="text-[15px] font-normal text-gray-500 group-hover/item:text-gray-900 transition-colors">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
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