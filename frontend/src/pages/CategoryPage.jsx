import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import imageCompression from 'browser-image-compression';

export default function CategoryPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  const token = localStorage.getItem("token");

  const API = process.env.REACT_APP_API_URL;
  console.log("API URL: ", API);

  const [alertData, setAlertData] = useState({
    show: false,
    message: "",
    onConfirm: null,
  });

  const [formData, setFormData] = useState({
    name: "",
    artist: "",
    description: "",
    category: slug,
    price: "",
    stock: "1",
    previews: ["", "", "", ""],
  });

  const categories = [
    { name: "CD เพลง", slug: "cd" },
    { name: "แผ่นเสียง", slug: "vinyl" },
    { name: "เทปคาสเซ็ท", slug: "cassette" },
    { name: "โปสเตอร์ศิลปิน", slug: "poster" },
    { name: "เสื้อวง", slug: "tshirt" },
  ];

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEdit(false);
    setEditingId(null);
    setActiveImageIndex(0);
    setFormData({
      name: "",
      artist: "",
      description: "",
      category: slug,
      price: "",
      stock: "1",
      previews: ["", "", "", ""],
    });
  };

  useEffect(() => {
    axios.get(`${API}/api/my-products/${slug}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setProducts(res.data);
        setSelectedItems([]);
        setSelectAll(false);
      })
      .catch(err => console.error("Fetch error:", err));
  }, [slug, token]);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  const handleSelectItem = (id) => {
    const updated = selectedItems.includes(id)
      ? selectedItems.filter(i => i !== id)
      : [...selectedItems, id];
    setSelectedItems(updated);
    setSelectAll(updated.length === products.length && products.length !== 0);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
      setSelectAll(false);
    } else {
      setSelectedItems(products.map(p => p._id));
      setSelectAll(true);
    }
  };

  const showAlert = (message, onConfirm = null) => {
    setAlertData({ show: true, message, onConfirm });
  };

const handleImageChange = async (e, index) => { // Added async
  const file = e.target.files[0];
  if (!file) return;

  // --- Start Compressor ---
  const options = {
    maxSizeMB: 0.2,          // make this one not exceed 200kb
    maxWidthOrHeight: 1280, 
    useWebWorker: true,
    fileType: 'image/webp'  //convert to webp for performance
  };

  let fileToRead = file;
  try {
    const compressedFile = await imageCompression(file, options);
    fileToRead = compressedFile; // Use the smaller file
  } catch (error) {
    console.error("Compression failed, using original", error);
  }
  // --- End Compressor ---

  const reader = new FileReader();
  reader.onloadend = () => {
    const updated = [...formData.previews];
    updated[index] = reader.result;
    setFormData(prev => ({ ...prev, previews: updated }));
  };
  reader.readAsDataURL(fileToRead); 
};

  const handleSubmit = async () => {
    if (!formData.name || !formData.artist || !formData.previews[0]) {
      return showAlert("กรอกข้อมูลให้ครบ");
    }
    showAlert(isEdit ? "ยืนยันแก้ไขสินค้า?" : "ยืนยันเพิ่มสินค้า?", async () => {
      try {
        const payload = {
          name: formData.name,
          artist: formData.artist,
          description: formData.description,
          category: formData.category,
          price: formData.price,
          stock: formData.stock,
          images: formData.previews
        };

        if (isEdit) {
          await axios.put(`${API}/api/product/${editingId}`, payload, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } else {
          await axios.post(`${API}/api/product`, payload, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
        
        const res = await axios.get(`${API}/api/my-products/${slug}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(res.data);
        handleCloseModal();
      } catch { showAlert("เกิดข้อผิดพลาด"); }
    });
  };

  const handleDeleteProducts = () => {
    if (!selectedItems.length) return;
    showAlert("แน่ใจหรือไม่ว่าต้องการลบ?", async () => {
      await Promise.all(selectedItems.map(id =>
        axios.delete(`${API}/api/product/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ));
      setProducts(products.filter(p => !selectedItems.includes(p._id)));
      setSelectedItems([]);
      setSelectAll(false);
    });
  };

  const handleEdit = (item) => {
    setIsEdit(true);
    setEditingId(item._id);
    setFormData({
      name: item.name,
      artist: item.artist,
      description: item.description,
      category: item.category,
      price: item.price,
      stock: item.stock || "1",
      previews: item.images?.length
        ? [...item.images, "", "", "", ""].slice(0, 4)
        : ["", "", "", ""],
    });
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-[#e9eff3] p-20 relative">
      <div className="space-y-6 pb-24">
        {products.map(item => (
          <div key={item._id} className="bg-white rounded-2xl p-6 flex justify-between shadow-sm">
            <div className="flex gap-6 items-center">
              <input type="checkbox" className="w-6 h-6 accent-[#f28c45]" checked={selectedItems.includes(item._id)} onChange={() => handleSelectItem(item._id)} />
              <img src={item.images?.[0]} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-500">{item.artist}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right mr-4">
                <p className="font-semibold text-orange-500">฿{item.price}</p>
                <p className="text-xs text-gray-400">คงเหลือ: {item.stock || 0}</p>
              </div>
              <button onClick={() => handleEdit(item)} className="text-gray-500 hover:text-black text-xl">✏️</button>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-20 py-5 flex justify-between items-center z-40">
        <div className="flex gap-4 items-center">
          <input type="checkbox" className="w-6 h-6 accent-[#f28c45]" checked={selectAll} onChange={handleSelectAll} />
          <span>เลือกทั้งหมด</span>
          <button onClick={handleDeleteProducts} className={`font-semibold ${selectedItems.length > 0 ? "text-red-500" : "text-gray-400"}`}>
            ลบสินค้า ({selectedItems.length})
          </button>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-[#f28c45] text-white px-8 py-3 rounded-xl font-bold">เพิ่มสินค้า</button>
      </div>

      {showModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-40 flex items-start justify-center z-50 overflow-y-auto p-4 md:p-10"
          onClick={handleCloseModal}
        >
          {/* ลบ border-2 border-black ออกแล้ว */}
          <div 
            className="bg-white w-full max-w-[800px] rounded-3xl p-8 md:p-12 shadow-2xl relative my-auto cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={handleCloseModal} className="absolute top-8 right-8 text-gray-400 hover:text-black transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-3xl font-bold mb-2 text-gray-800">{isEdit ? "แก้ไขสินค้า" : "เพิ่มสินค้า"}</h2>
            <p className="text-gray-500 mb-6">กรอกรายละเอียดสินค้าให้ครบถ้วนเพื่อวางจำหน่าย</p>
            <hr className="mb-10 border-gray-100" />

            <div className="flex flex-col items-center mb-8">
              <div className="relative group w-[400px] mb-4">
                <div className="h-[300px] bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden relative">
                  {formData.previews[activeImageIndex] ? (
                    <img src={formData.previews[activeImageIndex]} alt="Main" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-500">เลือกรูปหลัก</span>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center backdrop-blur-sm">
                    <div onClick={() => formData.previews[activeImageIndex] && setShowPreview(true)} className="cursor-pointer flex flex-col items-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                      <span className="text-white text-xs">คลิกดูรูปขยาย</span>
                    </div>
                    <label className="bg-white p-2 px-4 rounded-full cursor-pointer shadow-lg text-xs font-bold">
                      แก้ไขรูปภาพ
                      <input type="file" hidden accept="image/*" onChange={(e) => handleImageChange(e, activeImageIndex)} />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                {[0, 1, 2, 3].map(i => (
                  <div key={i} onClick={() => setActiveImageIndex(i)} className={`h-[65px] w-[80px] rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${activeImageIndex === i ? "border-[#f28c45] scale-105" : "border-transparent opacity-60"}`}>
                    {formData.previews[i] ? (
                      <img src={formData.previews[i]} alt={`Thumb ${i}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-[10px] text-gray-400">รูป {i + 1}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <input className="w-full p-3 border rounded-lg outline-none focus:border-[#f28c45]" placeholder="ชื่อสินค้า" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              <input className="w-full p-3 border rounded-lg outline-none focus:border-[#f28c45]" placeholder="ศิลปิน" value={formData.artist} onChange={(e) => setFormData({ ...formData, artist: e.target.value })} />
              <textarea className="w-full p-3 border rounded-lg h-24 resize-none outline-none focus:border-[#f28c45]" placeholder="รายละเอียด" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="mb-2 text-sm font-medium">ราคา (฿)</p>
                  <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full p-3 border rounded-lg outline-none focus:border-[#f28c45] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" placeholder="0" />
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium">จำนวนในคลัง (Stock)</p>
                  <input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} className="w-full p-3 border rounded-lg outline-none focus:border-[#f28c45]" placeholder="0" min="0" />
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium">หมวดหมู่สินค้า</p>
                <div className="grid grid-cols-3 gap-3">
                  {categories.map(cat => (
                    <button key={cat.slug} type="button" onClick={() => setFormData({ ...formData, category: cat.slug })} className={`p-2 rounded-lg text-sm border transition-all ${formData.category === cat.slug ? "bg-[#f28c45] text-white border-[#f28c45]" : "bg-gray-50 hover:bg-gray-100 border-transparent"}`}>
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center">
              <button onClick={handleSubmit} className="bg-[#f28c45] text-white px-12 py-3 rounded-xl font-bold shadow-lg hover:bg-orange-600 transition-colors">
                {isEdit ? "บันทึกการแก้ไข" : "เพิ่มสินค้าลงหน้าร้าน"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[1000]" onClick={() => setShowPreview(false)}>
          <img src={formData.previews[activeImageIndex]} alt="Full Preview" className="max-w-[90%] max-h-[90%] object-contain shadow-2xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      {alertData.show && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[999]">
          {/* ลบ border-2 border-black ออกแล้ว */}
          <div className="bg-white w-[400px] rounded-3xl p-8 text-center shadow-2xl">
            <p className="text-lg font-bold mb-6">{alertData.message}</p>
            <div className="flex justify-center gap-4">
              {alertData.onConfirm && (
                <button onClick={() => { alertData.onConfirm(); setAlertData({ show: false, message: "", onConfirm: null }); }} className="bg-[#f28c45] text-white px-8 py-2 rounded-xl font-bold">ยืนยัน</button>
              )}
              <button onClick={() => setAlertData({ show: false, message: "", onConfirm: null })} className="bg-gray-100 text-gray-600 px-8 py-2 rounded-xl font-bold">ปิด</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}