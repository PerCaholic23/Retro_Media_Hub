import { useLocation, useNavigate } from "react-router-dom";


export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
const searchQuery = queryParams.get("search") || "";
const categoryQuery = queryParams.get("category") || "";

  const products = [
    { id: 1, name: "CD เพลง Rock มือสอง", price: 450 },
    { id: 2, name: "เสื้อวง Nirvana วินเทจ", price: 890 },
    { id: 3, name: "แผ่นเสียง Beatles แท้", price: 1200 },
    { id: 4, name: "โปสเตอร์ศิลปิน Queen", price: 350 },
    { id: 5, name: "เทปคาสเซ็ท Classic", price: 250 },
  ];

  const filteredProducts = products.filter((product) => {
  const matchSearch = searchQuery
    ? product.name.toLowerCase().includes(searchQuery.toLowerCase())
    : true;

  const matchCategory = categoryQuery
    ? product.name.toLowerCase().includes(categoryQuery.toLowerCase())
    : true;

  return matchSearch && matchCategory;
});

  return (
    <div className="bg-[#e9eff3] font-prompt">
      

      {/* 🏠 HERO SECTION (จะแสดงเฉพาะตอนยังไม่ search) */}
      {!searchQuery && !categoryQuery && (
        <div className="flex justify-between px-24 py-10 relative">
          {/* LEFT */}
          <div className="w-1/2 mt-16">
            <h2 className="text-2xl mb-2">แหล่งรวม</h2>

            <h1 className="text-6xl font-bold leading-tight">
              <span className="text-[#f28c45]">
                สินค้าด้านดนตรี
              </span>
              <br />
              มือสอง
            </h1>

            <button
  onClick={() => navigate("/store")}
  className="mt-8 bg-[#f28c45] text-white px-8 py-3 rounded-2xl shadow-lg hover:scale-105 transition"
>
  🏪 ร้านค้าของคุณ
</button>

            {/* รายการสินค้าแนะนำ */}
            <div className="mt-10 bg-[#d6dee4] p-6 rounded-3xl w-[420px] shadow-md">
              <h3 className="font-semibold mb-4 text-lg">
                รายการสินค้าแนะนำ
              </h3>

              {products.slice(0, 2).map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/product/${item.id}`)}
                  className="flex gap-4 bg-[#eef3f7] p-4 rounded-2xl mb-4 cursor-pointer hover:scale-[1.02] transition"
                >
                  <div className="w-14 h-14 bg-gray-400 rounded-xl flex items-center justify-center text-white text-xs">
                    IMG
                  </div>
                  <div>
                    <p className="text-sm">{item.name}</p>
                    <p className="text-sm font-medium">
                      ฿{item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative w-[650px] h-[650px]">
            <div className="absolute top-[170px] left-[-300px] w-[360px] h-[360px] rounded-full bg-gray-400 z-20 shadow-xl flex items-center justify-center text-white">
              IMAGE
              <span className="absolute bottom-6 bg-white px-5 py-2 rounded-xl shadow text-black">
                CD เพลง
              </span>
            </div>

            <SmallCircle text="แผ่นเสียง" className="top-[-10px] left-[-150px] z-10" />
            <SmallCircle text="เทปคาสเซ็ท" className="top-[85px] left-[20px] z-10" />
            <SmallCircle text="โปสเตอร์ศิลปิน" className="bottom-[220px] left-[80px] z-10" />
            <SmallCircle text="เสื้อวง" className="bottom-[25px] left-[10px] z-10" />
          </div>
        </div>
      )}

     {/* 🔎 PRODUCT SECTION */}
<div className="px-24 pb-16">

  {(searchQuery || categoryQuery) && (
    <>
      <h2 className="text-2xl mb-6">
        {searchQuery && (
          <>
            ผลการค้นหา:
            <span className="text-[#f28c45] font-semibold ml-2">
              {searchQuery}
            </span>
          </>
        )}

        {!searchQuery && categoryQuery && (
          <>
            หมวดหมู่:
            <span className="text-[#f28c45] font-semibold ml-2">
              {categoryQuery}
            </span>
          </>
        )}
      </h2>

      <div className="grid grid-cols-3 gap-8">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/product/${item.id}`)}
              className="bg-white p-6 rounded-3xl shadow-md hover:shadow-xl hover:scale-105 cursor-pointer transition"
            >
              <div className="w-full h-40 bg-gray-300 rounded-2xl flex items-center justify-center text-white mb-4">
                IMAGE
              </div>
              <h3 className="font-semibold mb-2">{item.name}</h3>
              <p className="text-[#f28c45] font-medium">
                ฿{item.price}
              </p>
            </div>
          ))
        ) : (
          <p className="text-lg text-gray-600">
            ไม่พบสินค้าที่ค้นหา
          </p>
        )}
      </div>
    </>
  )}

</div>

      
    </div>
  );
}

function SmallCircle({ text, className }) {
  return (
    <div
      className={`absolute w-[150px] h-[150px] rounded-full bg-gray-400 shadow-md flex items-center justify-center text-white ${className}`}
    >
      IMAGE
      <span className="absolute -bottom-4 bg-white px-4 py-1 rounded-xl shadow text-sm text-black whitespace-nowrap">
        {text}
      </span>
    </div>
  );
}