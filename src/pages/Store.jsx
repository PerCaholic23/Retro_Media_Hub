import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Store() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  // 🔥 map icon ตามหมวด
  const categoryIcons = {
    cd: "💿",
    vinyl: "🎵",
    cassette: "📼",
    poster: "📜",
    tshirt: "👕",
  };

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

  return (
    <div className="bg-[#e9eff3] font-prompt p-20">
      <div className="grid grid-cols-3 gap-10">
        {categories.map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(`/category/${item.slug}`)}
            className="flex items-center gap-6 p-8 rounded-2xl
              shadow-sm cursor-pointer
              transition-all duration-300
              bg-[#f3f3f3]
              hover:bg-[#f28c45] hover:text-white hover:shadow-lg"
          >
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl bg-black text-white">
              {categoryIcons[item.slug]}
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