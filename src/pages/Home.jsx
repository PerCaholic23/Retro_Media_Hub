import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import ShopIcon from "../image/ShopIcon.png";

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  // ลบหรือคอมเมนต์ user ออกหากไม่ได้ใช้ในขณะนี้ เพื่อเลี่ยง Error no-unused-vars
  // const [user, setUser] = useState(null); 

  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search") || "";
  const categoryQuery = queryParams.get("category") || "";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
    // ถ้าจะใช้ setUser ให้ปลดคอมเมนต์บรรทัดด้านบนและด้านล่างนี้
    // else if (savedUser) { setUser(JSON.parse(savedUser)); }
  }, [navigate]); // เพิ่ม navigate ตรงนี้

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        setLoading(true);

        const query = new URLSearchParams();

        if (searchQuery) query.append("search", searchQuery);
        if (categoryQuery) query.append("category", categoryQuery);

        const res = await fetch(
          `http://localhost:5000/api/products?${query.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await res.json();
        setProducts(data);

      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, categoryQuery]);



  if (!localStorage.getItem("token")) return null;
  //////////Add loading screen to wait for database to complete
  if (loading) {
    return (
      <div class="flex items-center justify-center min-h-screen">
        <div role="status">
          <svg aria-hidden="true" class="inline w-10 h-10 w-8 h-8 text-neutral-tertiary animate-spin fill-brand" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="white" />
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#f28c45" />
          </svg>
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-[#e9eff3] font-prompt min-h-screen">
      {!searchQuery && !categoryQuery && (
        <div className="flex justify-between px-24 py-10 relative">
          <div className="w-1/2 mt-16">
            <h3 className="font-semibold mb-4 text-4xl">แหล่งรวม</h3>
            <h1 className="text-6xl font-bold leading-tight ml-20">
              <span className="text-[#f28c45]">สินค้าด้านดนตรี</span>
            </h1>
            <h3 className="text-5xl font-bold leading-tight ml-10">มือสอง</h3>

            <button
              onClick={() => navigate("/store")}
              className="mt-8 bg-[#f28c45] text-white px-8 py-3 rounded-2xl shadow-lg hover:scale-105 transition flex items-center gap-3"
            >
              <img
                src={ShopIcon}
                alt="store"
                className="w-7 h-7 object-contain"
              />
              ร้านค้าของคุณ
            </button>
            <div className="mt-10 bg-[#d6dee4] p-6 rounded-3xl w-[420px] shadow-md">
              <h3 className="font-semibold mb-4 text-lg">รายการสินค้าแนะนำ</h3>
              {products.slice(0, 2).map((item) => (
                <div
                  key={item._id}
                  onClick={() => navigate(`/product/${item._id}`)}
                  className="flex gap-4 bg-[#eef3f7] p-4 rounded-2xl mb-4 cursor-pointer hover:scale-[1.02] transition"
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center text-xs text-white">
                        No Img
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm">{item.name}</p>
                    <p className="text-sm font-medium">฿{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative w-[650px] h-[650px]">
  {/* ตัวอย่าง: CD เพลง (อันใหญ่กลาง) - ผมปรับให้ข้อความอยู่ล่างสุดแบบไม่ทับรูปมาก */}
  <div
  onClick={() => navigate("/home?category=CD เพลง")}
  /* 1. เอา overflow-hidden ออกจากบรรทัดนี้ */
  className="absolute top-[160px] left-[0px] w-[360px] h-[360px] rounded-full bg-white z-20 shadow-xl flex items-center justify-center cursor-pointer hover:scale-105 transition border-4 border-white"
>
  {/* 2. ใส่ rounded-full และ overflow-hidden ที่ img แทนเพื่อให้รูปยังเป็นวงกลม */}
  <img 
    src="https://i.pinimg.com/736x/25/67/32/256732cfc95f431a70ee49de12c328a1.jpg" 
    alt="CD" 
    className="w-full h-full object-cover rounded-full overflow-hidden" 
  />

  {/* 3. ตอนนี้ขยับ left, bottom ได้อิสระแล้ว จะหลุดนอกวงกลมแค่ไหนก็ได้ */}
  <span className="absolute top-[45px] left-[-20px] bg-white px-5 py-2 rounded-xl shadow-lg text-black font-bold z-30">
    CD เพลง
  </span>
</div>

  {/* แผ่นเสียง: ให้ข้อความอยู่ "ข้างบน" วงกลม */}
  <SmallCircle
    text="แผ่นเสียง"
    image="https://i.pinimg.com/736x/4b/c8/6d/4bc86d00722fd941baededbae9411845.jpg"
    className="top-[-10px] left-[200px]"
    textPosition="bottom-[100px] left-[100px]" 
  />

  {/* เทปคาสเซ็ท: ให้ข้อความอยู่ "ทางขวา" ของวงกลม */}
  <SmallCircle
    text="เทปคาสเซ็ท"
    image="https://i.pinimg.com/1200x/00/00/99/000099d11fdec13320997e182e968f5f.jpg"
    className="top-[100px] left-[340px]"
    textPosition="right-[-40px] top-[20px]" 
  />

  {/* โปสเตอร์ศิลปิน: ให้ข้อความอยู่ "ข้างล่าง" (เหมือนเดิมแต่ขยับได้) */}
  <SmallCircle
    text="โปสเตอร์ศิลปิน"
    image="https://i.pinimg.com/736x/6e/0a/2b/6e0a2b2826c82a28084348e7a0004bbb.jpg"
    className="bottom-[220px] left-[390px]"
    textPosition="bottom-[100px] left-[80px]"
  />

  {/* เสื้อวง: ให้ข้อความอยู่ "ทางซ้าย" ของวงกลม */}
  <SmallCircle
    text="เสื้อวง"
    image="https://i.pinimg.com/736x/01/03/4d/01034d08a5985dd64c0af29afda50ca6.jpg"
    className="bottom-[45px] left-[330px]"
    textPosition="bottom-[100px] left-[100px]"
  />
</div>
        </div>
      )}

      <div className="px-24 pb-16">
        {(searchQuery || categoryQuery) && (
          <>
            <h2 className="text-2xl mb-6">
              {searchQuery && (
                <>ผลการค้นหา: <span className="text-[#f28c45] font-semibold ml-2">{searchQuery}</span></>
              )}
              {!searchQuery && categoryQuery && (
                <>หมวดหมู่: <span className="text-[#f28c45] font-semibold ml-2">{categoryQuery}</span></>
              )}
            </h2>

            <div className="grid grid-cols-3 gap-8">
              {products.length > 0 ? (
                products.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => navigate(`/product/${item._id}`)}
                    className="bg-white p-6 rounded-3xl shadow-md hover:shadow-xl hover:scale-105 cursor-pointer transition"
                  >
                    <div className="w-full h-40 rounded-2xl overflow-hidden mb-4">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center text-white">
                          No Image
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold mb-2">{item.name}</h3>
                    <p className="text-[#f28c45] font-medium">฿{item.price}</p>
                  </div>
                ))
              ) : (
                <p className="text-lg text-gray-600">ไม่พบสินค้าที่ค้นหา</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SmallCircle({ text, className, image, textPosition = "bottom-[-20px]" }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/home?category=${text}`)}
      className={`absolute flex flex-col items-center cursor-pointer hover:scale-110 transition active:scale-95 z-10 ${className}`}
    >
      <div className="w-[150px] h-[150px] rounded-full bg-white shadow-md flex items-center justify-center overflow-hidden border-2 border-gray-100 relative">
        {image ? (
          <img src={image} alt={text} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-400 text-xs">No Image</span>
        )}
      </div>
      
      {/* ใช้ absolute เพื่อให้ข้อความขยับได้อิสระรอบวงกลม */}
      <span className={`absolute bg-white px-4 py-1 rounded-xl shadow-md text-sm text-black whitespace-nowrap border border-gray-100 font-medium z-30 ${textPosition}`}>
        {text}
      </span>
    </div>
  );
}