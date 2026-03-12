import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

// ===== IMPORT ICONS 2 สี =====
import CDIconBlack from "../image/CDIconBlack.png";
import CDIconWhite from "../image/CDIconWhite.png";

import VinylIconBlack from "../image/VinylIconBlack.png";
import VinylIconWhite from "../image/VinylIconWhite.png";

import CassetteIconBlack from "../image/CassetteIconBlack.png";
import CassetteIconWhite from "../image/CassetteIconWhite.png";

import PosterIconBlack from "../image/PosterIconBlack.png";
import PosterIconWhite from "../image/PosterIconWhite.png";

import BandShirtIconBlack from "../image/BandShirtIconBlack.png";
import BandShirtIconWhite from "../image/BandShirtIconWhite.png";

export default function Store() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  const API = process.env.REACT_APP_API_URL;
  console.log("API Store.jsx ", API);

  useEffect(() => {
    axios.get(`${API}/api/category`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then((res) => {
        const defaultCategories = [
          { name: "CD เพลง", slug: "cd" },
          { name: "แผ่นเสียง", slug: "vinyl" },
          { name: "เทปคาสเซ็ท", slug: "cassette" },
          { name: "โปสเตอร์ศิลปิน", slug: "poster" },
          { name: "เสื้อวง", slug: "tshirt" },
        ];

        const merged = defaultCategories.map((cat) => {
          const found = res.data.find(
            (item) => item.category_slug === cat.slug
          );

          return {
            ...cat,
            stock: found ? found.productCount : 0,
          };
        });

        setCategories(merged);
      })
      .catch((err) => {
        console.error("โหลดหมวดหมู่ไม่สำเร็จ", err);
      });
  }, []);

  // ===== ICON COMPONENT =====
  const CategoryIcon = ({ slug }) => {
    const baseClass =
      "w-12 h-12 object-contain transition duration-300";

    switch (slug) {
      case "cd":
        return (
          <>
            <img
              src={CDIconBlack}
              className={`${baseClass} group-hover:hidden`}
              alt="cd-black"
            />
            <img
              src={CDIconWhite}
              className={`${baseClass} hidden group-hover:block`}
              alt="cd-white"
            />
          </>
        );

      case "vinyl":
        return (
          <>
            <img
              src={VinylIconBlack}
              className={`${baseClass} group-hover:hidden`}
              alt="vinyl-black"
            />
            <img
              src={VinylIconWhite}
              className={`${baseClass} hidden group-hover:block`}
              alt="vinyl-white"
            />
          </>
        );

      case "cassette":
        return (
          <>
            <img
              src={CassetteIconBlack}
              className={`${baseClass} group-hover:hidden`}
              alt="cassette-black"
            />
            <img
              src={CassetteIconWhite}
              className={`${baseClass} hidden group-hover:block`}
              alt="cassette-white"
            />
          </>
        );

      case "poster":
        return (
          <>
            <img
              src={PosterIconBlack}
              className={`${baseClass} group-hover:hidden`}
              alt="poster-black"
            />
            <img
              src={PosterIconWhite}
              className={`${baseClass} hidden group-hover:block`}
              alt="poster-white"
            />
          </>
        );

      case "tshirt":
        return (
          <>
            <img
              src={BandShirtIconBlack}
              className={`${baseClass} group-hover:hidden`}
              alt="shirt-black"
            />
            <img
              src={BandShirtIconWhite}
              className={`${baseClass} hidden group-hover:block`}
              alt="shirt-white"
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-[#e9eff3] font-prompt p-20 min-h-screen">
      <div className="grid grid-cols-3 gap-10">

        {/* ===== CATEGORY CARDS ===== */}
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
            <div className="flex items-center justify-center">
              <CategoryIcon slug={item.slug} />
            </div>

            <div>
              <h3 className="text-xl font-semibold">
                {item.name}
              </h3>
              <p>คงเหลือ : {item.stock}</p>
            </div>
          </div>
        ))}

        {/* ===== DASHBOARD BUTTON ===== */}
        <div
          onClick={() => navigate("/dashboard")}
          className="flex items-center justify-center p-8 rounded-2xl
            bg-gradient-to-r from-orange-400 to-orange-500
            text-white cursor-pointer shadow-md
            hover:scale-105 transition-all duration-300"
        >
          <div className="text-center">
            <h3 className="text-xl font-bold">
              รายได้รวมสุทธิ
            </h3>
            <p className="text-sm opacity-90">
              ดูสรุปยอดทั้งหมด
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}