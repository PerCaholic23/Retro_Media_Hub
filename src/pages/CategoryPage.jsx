import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

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
    image: "",
    previews: ["", "", "", ""],
  });

  const categories = [
    { name: "CD เพลง", slug: "cd" },
    { name: "แผ่นเสียง", slug: "vinyl" },
    { name: "เทปคาสเซ็ท", slug: "cassette" },
    { name: "โปสเตอร์ศิลปิน", slug: "poster" },
    { name: "เสื้อวง", slug: "tshirt" },
  ];

  // ฟังก์ชันสำหรับปิด Modal และล้างข้อมูลทิ้ง
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
      image: "",
      previews: ["", "", "", ""],
    });
  };

  useEffect(() => {
    axios.get(`http://localhost:5000/api/my-products/${slug}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setProducts(res.data);
      setSelectedItems([]);
      setSelectAll(false);
    });
  }, [slug]);

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

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const updated = [...formData.previews];
      updated[index] = reader.result;
      setFormData(prev => ({ ...prev, image: updated[0], previews: updated }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.artist || !formData.previews[0]) {
      return showAlert("กรอกข้อมูลให้ครบ");
    }
    showAlert(isEdit ? "ยืนยันแก้ไขสินค้า?" : "ยืนยันเพิ่มสินค้า?", async () => {
      try {
        if (isEdit) {
          await axios.put(`http://localhost:5000/api/product/${editingId}`, formData, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } else {
          await axios.post("http://localhost:5000/api/product", formData, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
        const res = await axios.get(`http://localhost:5000/api/my-products/${slug}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(res.data);
        handleCloseModal(); // ใช้ฟังก์ชันล้างข้อมูลเมื่อทำรายการเสร็จ
      } catch { showAlert("เกิดข้อผิดพลาด"); }
    });
  };

  const handleDeleteProducts = () => {
    if (!selectedItems.length) return;
    showAlert("แน่ใจหรือไม่ว่าต้องการลบ?", async () => {
      await Promise.all(selectedItems.map(id =>
        axios.delete(`http://localhost:5000/api/product/${id}`, {
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
      name: item.name, artist: item.artist, description: item.description,
      category: item.category, price: item.price, stock: item.stock || "1",
      image: item.image, previews: [item.image, "", "", ""],
    });
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-[#e9eff3] p-20 relative">
      <div className="space-y-6">
        {products.map(item => (
          <div key={item._id} className="bg-white rounded-2xl p-6 flex justify-between shadow-sm">
            <div className="flex gap-6 items-center">
              <input type="checkbox" className="w-6 h-6 accent-[#f28c45]" checked={selectedItems.includes(item._id)} onChange={() => handleSelectItem(item._id)} />
              <img src={item.image} className="w-24 h-24 object-cover rounded-lg" />
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

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-20 py-5 flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <input type="checkbox" className="w-6 h-6 accent-[#f28c45]" checked={selectAll} onChange={handleSelectAll} />
          <span>เลือกทั้งหมด</span>
          <button 
            onClick={handleDeleteProducts}
            className={`font-semibold ${selectedItems.length > 0 ? "text-red-500" : "text-gray-400"}`}
          >
            ลบสินค้า ({selectedItems.length})
          </button>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-[#f28c45] text-white px-8 py-3 rounded-xl">เพิ่มสินค้า</button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white w-[800px] rounded-2xl p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl text-center font-semibold mb-8 relative">
              <button onClick={handleCloseModal} className="absolute top-0 right-0 text-gray-400 hover:text-black text-2xl font-bold">X</button>
              {isEdit ? "แก้ไขสินค้า" : "เพิ่มสินค้า"}
            </h2>

            {/* IMAGE AREA */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative group w-[400px] mb-4">
                <div className="h-[300px] bg-gray-200 rounded-2xl flex items-center justify-center overflow-hidden relative">
                  {formData.previews[activeImageIndex] ? (
                    <img src={formData.previews[activeImageIndex]} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-500">เลือกรูปหลัก</span>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center backdrop-blur-sm">
                    <div onClick={() => formData.previews[activeImageIndex] && setShowPreview(true)} className="cursor-pointer flex flex-col items-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                      <span className="text-white text-xs">คลิกเพื่อดูรูปขยาย</span>
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
                  <div key={i} onClick={() => setActiveImageIndex(i)} className={`h-[65px] w-[80px] rounded-xl overflow-hidden cursor-pointer border-2 ${activeImageIndex === i ? "border-[#f28c45]" : "border-transparent"}`}>
                    {formData.previews[i] ? (
                      <img src={formData.previews[i]} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-400">รูป {i + 1}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <input className="w-full p-3 border rounded-lg" placeholder="ชื่อสินค้า" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              <input className="w-full p-3 border rounded-lg" placeholder="ศิลปิน" value={formData.artist} onChange={(e) => setFormData({ ...formData, artist: e.target.value })} />
              <textarea className="w-full p-3 border rounded-lg h-24 resize-none" placeholder="รายละเอียด" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
             <div className="grid grid-cols-2 gap-4">
  {/* ช่องราคา: ไม่มีปุ่มเพิ่มลด */}
  <div>
    <p className="mb-2 text-sm font-medium">ราคา (฿)</p>
    <input 
      type="number" 
      value={formData.price} 
      onChange={(e) => setFormData({ ...formData, price: e.target.value })} 
      className="w-full p-3 border rounded-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
      placeholder="0"
    />
  </div>

  {/* ช่องจำนวน (Stock): มีปุ่มเพิ่มลดปกติ */}
  <div>
    <p className="mb-2 text-sm font-medium">จำนวนในคลัง (Stock)</p>
    <input 
      type="number" 
      value={formData.stock} 
      onChange={(e) => setFormData({ ...formData, stock: e.target.value })} 
      className="w-full p-3 border rounded-lg" // ใช้คลาสปกติ ปุ่มเพิ่มลดจะปรากฏตาม Browser
      placeholder="0"
      min="0"
    />
  </div>
</div>
              <div>
                <p className="mb-2 text-sm font-medium">หมวดหมู่สินค้า</p>
                <div className="grid grid-cols-3 gap-3">
                  {categories.map(cat => (
                    <button key={cat.slug} type="button" onClick={() => setFormData({ ...formData, category: cat.slug })} className={`p-2 rounded-lg text-sm border transition ${formData.category === cat.slug ? "bg-[#f28c45] text-white border-[#f28c45]" : "bg-gray-100"}`}>
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center">
              <button onClick={handleSubmit} className="bg-[#f28c45] text-white px-10 py-2.5 rounded-lg">
                {isEdit ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[1000]" onClick={() => setShowPreview(false)}>
          <img src={formData.previews[activeImageIndex]} className="max-w-[90%] max-h-[90%] object-contain" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      {alertData.show && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[999]">
          <div className="bg-white w-[400px] rounded-2xl p-8 text-center shadow-xl">
            <p className="text-lg font-semibold mb-6">{alertData.message}</p>
            <div className="flex justify-center gap-4">
              {alertData.onConfirm && (
                <button onClick={() => { alertData.onConfirm(); setAlertData({ show: false, message: "", onConfirm: null }); }} className="bg-[#f28c45] text-white px-6 py-2 rounded-lg">ยืนยัน</button>
              )}
              <button onClick={() => setAlertData({ show: false, message: "", onConfirm: null })} className="bg-gray-200 px-6 py-2 rounded-lg">ปิด</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}