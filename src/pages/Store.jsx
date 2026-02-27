import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Store() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/category")
      .then(res => {
        const defaultCategories = [
          { name: "CD เพลง", slug: "cd" },
          { name: "แผ่นเสียง", slug: "vinyl" },
          { name: "เทปคาสเซ็ท", slug: "cassette" },
          { name: "โปสเตอร์ศิลปิน", slug: "poster" },
          { name: "เสื้อวง", slug: "tshirt" },
        ];

        const merged = defaultCategories.map(cat => {
          const found = res.data.find(
            item => item.category_slug === cat.slug
          );

          return {
            ...cat,
            stock: found ? found.totalStock : 0
          };
        });

        setCategories(merged);
      });
  }, []);

  const CategoryIcon = ({ slug }) => {
    const baseClass = "w-10 h-10";

    switch (slug) {
      case "cd":
        return (
          <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="2" />
          </svg>
        );
      case "vinyl":
        return (
          <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="4" />
          </svg>
        );
      case "cassette":
        return (
          <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="6" width="18" height="12" rx="2" />
            <circle cx="9" cy="12" r="2" />
            <circle cx="15" cy="12" r="2" />
          </svg>
        );
      case "poster":
        return (
          <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="5" y="3" width="14" height="18" rx="2" />
            <line x1="8" y1="7" x2="16" y2="7" />
            <line x1="8" y1="11" x2="16" y2="11" />
          </svg>
        );
      case "tshirt":
        return (
          <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 4l4-2 4 2 3 4-3 2v10H8V10L5 8l3-4z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#e9eff3] font-prompt p-20">
      <div className="grid grid-cols-3 gap-10">
        {categories.map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(`/category/${item.slug}`)}
            className="group flex items-center gap-6 p-8 rounded-2xl
              shadow-sm cursor-pointer
              transition-all duration-300
              bg-[#f3f3f3]
              hover:bg-[#f28c45] hover:text-white hover:shadow-lg"
          >
            {/* ICON */}
            <div className="w-20 h-20 rounded-full flex items-center justify-center 
              bg-white text-black 
              group-hover:bg-white group-hover:text-[#f28c45] 
              transition">
              <CategoryIcon slug={item.slug} />
            </div>

            <div>
              <h3 className="text-xl font-semibold">{item.name}</h3>
              <p>คงเหลือ : {item.stock}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}