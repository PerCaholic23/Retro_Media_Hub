// import { useLocation, useNavigate } from "react-router-dom";
// //import { useEffect, useState } from "react"; // ✅ เพิ่ม 2 ตัวนี้
// import { useLocation, useNavigate } from "react-router-dom";

// export default function Home() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [user, setUser] = useState(null);
//   const queryParams = new URLSearchParams(location.search);
// const searchQuery = queryParams.get("search") || "";
// const categoryQuery = queryParams.get("category") || "";
// useEffect(() => {
//     const token = localStorage.getItem("token");
//     const savedUser = localStorage.getItem("user");

//     if (!token || !savedUser) {
//       navigate("/login"); 
//     } else {
//       setUser(JSON.parse(savedUser));
//     }
//   }, [navigate]);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/login");
//   };
//   const products = [
//     { id: 1, name: "CD เพลง Rock มือสอง", price: 450 },
//     { id: 2, name: "เสื้อวง Nirvana วินเทจ", price: 890 },
//     { id: 3, name: "แผ่นเสียง Beatles แท้", price: 1200 },
//     { id: 4, name: "โปสเตอร์ศิลปิน Queen", price: 350 },
//     { id: 5, name: "เทปคาสเซ็ท Classic", price: 250 },
//   ];

//   const filteredProducts = products.filter((product) => {
//   const matchSearch = searchQuery
//     ? product.name.toLowerCase().includes(searchQuery.toLowerCase())
//     : true;

//   const matchCategory = categoryQuery
//     ? product.name.toLowerCase().includes(categoryQuery.toLowerCase())
//     : true;

//   return matchSearch && matchCategory;
// });

//   return (
//     <div className="bg-[#e9eff3] font-prompt">
      

//        {/* 🏠 HERO SECTION (จะแสดงเฉพาะตอนยังไม่ search) */}
//        {!searchQuery && !categoryQuery && (
//         <div className="flex justify-between px-24 py-10 relative">
//           {/* LEFT */}
//           <div className="w-1/2 mt-16">
//             <h2 className="text-2xl mb-2">แหล่งรวม</h2>

//              <h1 className="text-6xl font-bold leading-tight">
//               <span className="text-[#f28c45]">
//                 สินค้าด้านดนตรี
//                </span>
//               <br />
//                มือสอง
//              </h1>

//              <button
//   onClick={() => navigate("/store")}
//   className="mt-8 bg-[#f28c45] text-white px-8 py-3 rounded-2xl shadow-lg hover:scale-105 transition"
// >
//   🏪 ร้านค้าของคุณ
// </button>

//              {/* รายการสินค้าแนะนำ */}
//              <div className="mt-10 bg-[#d6dee4] p-6 rounded-3xl w-[420px] shadow-md">
//                <h3 className="font-semibold mb-4 text-lg">
//                 รายการสินค้าแนะนำ
//                </h3>

//               {products.slice(0, 2).map((item) => (
//                 <div
//                   key={item.id}
//                   onClick={() => navigate(`/product/${item.id}`)}
//                   className="flex gap-4 bg-[#eef3f7] p-4 rounded-2xl mb-4 cursor-pointer hover:scale-[1.02] transition"
//                 >
//                   <div className="w-14 h-14 bg-gray-400 rounded-xl flex items-center justify-center text-white text-xs">
//                     IMG
//                   </div>
//                   <div>
//                     <p className="text-sm">{item.name}</p>
//                     <p className="text-sm font-medium">
//                       ฿{item.price}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//            {/* RIGHT */}
//            <div className="relative w-[650px] h-[650px]">
//              <div className="absolute top-[170px] left-[-300px] w-[360px] h-[360px] rounded-full bg-gray-400 z-20 shadow-xl flex items-center justify-center text-white">
//                IMAGE
//                <span className="absolute bottom-6 bg-white px-5 py-2 rounded-xl shadow text-black">
//                 CD เพลง
//                </span>
//              </div>

//              <SmallCircle text="แผ่นเสียง" className="top-[-10px] left-[-150px] z-10" />
//              <SmallCircle text="เทปคาสเซ็ท" className="top-[85px] left-[20px] z-10" />
//              <SmallCircle text="โปสเตอร์ศิลปิน" className="bottom-[220px] left-[80px] z-10" />
//              <SmallCircle text="เสื้อวง" className="bottom-[25px] left-[10px] z-10" />
//            </div>
//          </div>
//        )}

//       {/* 🔎 PRODUCT SECTION */}
//  <div className="px-24 pb-16">

//    {(searchQuery || categoryQuery) && (
//      <>
//        <h2 className="text-2xl mb-6">
//          {searchQuery && (
//           <>
//             ผลการค้นหา:
//             <span className="text-[#f28c45] font-semibold ml-2">
//               {searchQuery}
//             </span>
//           </>
//         )}

//          {!searchQuery && categoryQuery && (
//            <>
//              หมวดหมู่:
//              <span className="text-[#f28c45] font-semibold ml-2">
//               {categoryQuery}
//              </span>
//            </>
//          )}
//        </h2>

//        <div className="grid grid-cols-3 gap-8">
//          {filteredProducts.length > 0 ? (
//            filteredProducts.map((item) => (
//              <div
//                key={item.id}
//               onClick={() => navigate(`/product/${item.id}`)}
//               className="bg-white p-6 rounded-3xl shadow-md hover:shadow-xl hover:scale-105 cursor-pointer transition"
//             >
//               <div className="w-full h-40 bg-gray-300 rounded-2xl flex items-center justify-center text-white mb-4">
//                 IMAGE
//               </div>
//               <h3 className="font-semibold mb-2">{item.name}</h3>
//               <p className="text-[#f28c45] font-medium">
//                 ฿{item.price}
//               </p>
//             </div>
//           ))
//         ) : (
//           <p className="text-lg text-gray-600">
//             ไม่พบสินค้าที่ค้นหา
//           </p>
//         )}
//       </div>
//     </>
//   )}

//  </div>

      
//      </div>
//   );
// }

// function SmallCircle({ text, className }) {
//   return (
//     <div
//       className={`absolute w-[150px] h-[150px] rounded-full bg-gray-400 shadow-md flex items-center justify-center text-white ${className}`}
//     >
//       IMAGE
//       <span className="absolute -bottom-4 bg-white px-4 py-1 rounded-xl shadow text-sm text-black whitespace-nowrap">
//         {text}
//       </span>
//     </div>
//   );
//  }

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  // ดึงค่า Search และ Category จาก URL
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search") || "";
  const categoryQuery = queryParams.get("category") || "";

  // 🔐 1. ตรวจสอบการ Login เมื่อเปิดหน้าเว็บ
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   const savedUser = localStorage.getItem("user");

  //   if (!token || !savedUser) {
  //     navigate("/login"); 
  //   } else {
  //     setUser(JSON.parse(savedUser));
  //   }
  // }, [navigate]);
  // 🔐 1. ตรวจสอบการ Login เมื่อเปิดหน้าเว็บครั้งแรกเท่านั้น
useEffect(() => {
  const token = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");

  // 🚩 แก้ไข: ถ้าไม่มี Token จริงๆ ถึงจะเตะไปหน้า Login
  if (!token) {
    navigate("/login");
  } else if (savedUser) {
    // ถ้ามี Token และมีข้อมูล user ในเครื่อง ให้ดึงมาใส่ State เสมอ
    setUser(JSON.parse(savedUser));
  }
}, []); // ใส่เป็น [] เพื่อให้เช็คแค่ครั้งเดียวตอนโหลดหน้าเว็บ

  // 🚪 2. ฟังก์ชันออกจากระบบ
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

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

  // กัน Error ถ้า user ยังโหลดไม่เสร็จ
  if (!localStorage.getItem("token")) return null;

  return (
    <div className="bg-[#e9eff3] font-prompt min-h-screen">
      
      {/* 👤 TOP NAVIGATION (แสดงชื่อและปุ่ม Logout) */}
      {/* <div className="flex justify-end items-center gap-4 px-24 py-4 bg-white/30 backdrop-blur-sm sticky top-0 z-50">
        <p className="text-sm">
          สวัสดี, <span className="font-bold text-[#f28c45]">{user.username}</span>
        </p>
        <button 
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-1.5 rounded-xl text-sm hover:bg-red-600 transition shadow-sm"
        >
          ออกจากระบบ
        </button>
      </div> */}

      {/* 🏠 HERO SECTION (จะแสดงเฉพาะตอนยังไม่ search) */}
      {!searchQuery && !categoryQuery && (
        <div className="flex justify-between px-24 py-10 relative">
          {/* LEFT */}
          <div className="w-1/2 mt-16">
            <h3 className="font-semibold mb-4 text-4xl">แหล่งรวม</h3>
            <h1 className="text-6xl font-bold leading-tight ml-20">
              <span className="text-[#f28c45]">สินค้าด้านดนตรี</span>
              
            </h1>
            <h3 className="text-5xl font-bold leading-tight ml-10">
              มือสอง
            </h3>

            <button
              onClick={() => navigate("/store")}
              className="mt-8 bg-[#f28c45] text-white px-8 py-3 rounded-2xl shadow-lg hover:scale-105 transition"
            >
              🏪 ร้านค้าของคุณ
            </button>

            {/* รายการสินค้าแนะนำ */}
            <div className="mt-10 bg-[#d6dee4] p-6 rounded-3xl w-[420px] shadow-md">
              <h3 className="font-semibold mb-4 text-lg">รายการสินค้าแนะนำ</h3>
              {products.slice(0, 2).map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/product/${item.id}`)}
                  className="flex gap-4 bg-[#eef3f7] p-4 rounded-2xl mb-4 cursor-pointer hover:scale-[1.02] transition"
                >
                  <div className="w-14 h-14 bg-gray-400 rounded-xl flex items-center justify-center text-white text-xs">IMG</div>
                  <div>
                    <p className="text-sm">{item.name}</p>
                    <p className="text-sm font-medium">฿{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          {/* <div className="relative w-[650px] h-[650px]">
            <div className="absolute top-[170px] left-[0px] w-[360px] h-[360px] rounded-full bg-gray-400 z-20 shadow-xl flex items-center justify-center text-white">
              IMAGE
              <span className="absolute bottom-6 bg-white px-5 py-2 rounded-xl shadow text-black">CD เพลง</span>
            </div>
            <SmallCircle text="แผ่นเสียง" className="top-[-10px] left-[200px] z-10" />
            <SmallCircle text="เทปคาสเซ็ท" className="top-[100px] left-[340px] z-10" />
            <SmallCircle text="โปสเตอร์ศิลปิน" className="bottom-[220px] left-[400px] z-10" />
            <SmallCircle text="เสื้อวง" className="bottom-[45px] left-[330px] z-10" />
          </div> */}
          {/* RIGHT */}
          <div className="relative w-[650px] h-[650px]">
            {/* วงกลมใหญ่ตรงกลาง (CD เพลง) */}
              {/* วงกลมใหญ่ตรงกลาง (CD เพลง) */}
                <div 
                  onClick={() => navigate("/home?category=CD เพลง")} // เพิ่มบรรทัดนี้
                  className="absolute top-[160px] left-[0px] w-[360px] h-[360px] rounded-full bg-white z-20 shadow-xl flex items-center justify-center overflow-hidden cursor-pointer hover:scale-105 transition border-4 border-white"
                >
                  <img src="https://i.pinimg.com/736x/25/67/32/256732cfc95f431a70ee49de12c328a1.jpg" className="w-full h-full object-cover" />
                  <span className="absolute bottom-6 bg-white px-5 py-2 rounded-xl shadow text-black font-bold">CD เพลง</span>
                </div>

            {/* วงกลมเล็กๆ รอบๆ */}
            <SmallCircle 
              text="แผ่นเสียง" 
              image="https://i.pinimg.com/736x/4b/c8/6d/4bc86d00722fd941baededbae9411845.jpg"
              className="top-[-10px] left-[200px] z-10" 
            />
            <SmallCircle 
              text="เทปคาสเซ็ท" 
              image="https://i.pinimg.com/1200x/00/00/99/000099d11fdec13320997e182e968f5f.jpg"
              className="top-[100px] left-[340px] z-10" 
            />
            <SmallCircle 
              text="โปสเตอร์ศิลปิน" 
              image="https://i.pinimg.com/736x/6e/0a/2b/6e0a2b2826c82a28084348e7a0004bbb.jpg"
              className="bottom-[220px] left-[390px] z-10" 
            />
            <SmallCircle 
              text="เสื้อวง" 
              image="https://i.pinimg.com/736x/01/03/4d/01034d08a5985dd64c0af29afda50ca6.jpg"
              className="bottom-[45px] left-[330px] z-10" 
            />
          </div>
        </div>
      )}

      {/* 🔎 PRODUCT SECTION */}
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
              {filteredProducts.length > 0 ? (
                filteredProducts.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => navigate(`/product/${item.id}`)}
                    className="bg-white p-6 rounded-3xl shadow-md hover:shadow-xl hover:scale-105 cursor-pointer transition"
                  >
                    <div className="w-full h-40 bg-gray-300 rounded-2xl flex items-center justify-center text-white mb-4">IMAGE</div>
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

function SmallCircle({ text, className, image }) {
  const navigate = useNavigate(); // ใช้สำหรับเปลี่ยน URL

  return (
    <div 
      // พอกดแล้วจะเปลี่ยน URL เป็น /?category=ชื่อหมวดหมู่
      onClick={() => navigate(`/home?category=${text}`)} 
      className={`absolute flex flex-col items-center cursor-pointer hover:scale-110 transition active:scale-95 ${className}`}
    >
      {/* ส่วนวงกลมรูปภาพ */}
      <div className="w-[150px] h-[150px] rounded-full bg-white shadow-md flex items-center justify-center overflow-hidden border-2 border-gray-100 relative">
        {image ? (
          <img src={image} alt={text} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-400 text-xs">No Image</span>
        )}
      </div>

      {/* ส่วนป้ายชื่อ */}
      <span className="mt-[-20px] z-30 bg-white px-4 py-1 rounded-xl shadow-md text-sm text-black whitespace-nowrap border border-gray-100 font-medium">
        {text}
      </span>
    </div>
  );
}