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

  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user"));

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

  // ================= FETCH =================
  useEffect(() => {
    axios.get(
      `http://localhost:5000/api/my-products/${slug}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then(res => {
        setProducts(res.data);
        setSelectedItems([]);
        setSelectAll(false);
      });
  }, [slug]);

  // ================= SELECT =================
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

  // ================= ALERT =================
  const showAlert = (message, onConfirm = null) => {
    setAlertData({ show: true, message, onConfirm });
  };

  // ================= IMAGE =================
  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const updated = [...formData.previews];
      updated[index] = reader.result;

      setFormData(prev => ({
        ...prev,
        image: updated[0],
        previews: updated
      }));
    };
    reader.readAsDataURL(file);
  };

  // ================= ADD / EDIT =================
  const handleSubmit = async () => {
    if (!formData.name || !formData.artist || !formData.previews[0]) {
      return showAlert("กรอกข้อมูลให้ครบ");
    }

    showAlert(
      isEdit ? "ยืนยันแก้ไขสินค้า?" : "ยืนยันเพิ่มสินค้า?",
      async () => {
        try {
          if (isEdit) {
            await axios.put(
              `http://localhost:5000/api/product/${editingId}`,
              formData,
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            );
          } else {


            await axios.post(
              "http://localhost:5000/api/product",
              formData,
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            );
          }

          const res = await axios.get(
            `http://localhost:5000/api/category/${slug}`
          );
          setProducts(res.data);

          setShowModal(false);
          setIsEdit(false);
          setEditingId(null);

          setFormData({
            name: "",
            artist: "",
            description: "",
            category: slug,
            price: "",
            image: "",
            previews: ["", "", "", ""],
          });

        } catch {
          showAlert("เกิดข้อผิดพลาด");
        }
      }
    );
  };

  // ================= DELETE =================
  const handleDeleteProducts = () => {
    if (!selectedItems.length)
      return showAlert("กรุณาเลือกสินค้า");

    showAlert("แน่ใจหรือไม่ว่าต้องการลบ?", async () => {
      await Promise.all(
        selectedItems.map(id =>
          axios.delete(
            `http://localhost:5000/api/product/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
        )
      );

      setProducts(products.filter(p => !selectedItems.includes(p._id)));
      setSelectedItems([]);
      setSelectAll(false);
    });
  };

  // ================= EDIT =================
  const handleEdit = (item) => {
    setIsEdit(true);
    setEditingId(item._id);

    setFormData({
      name: item.name,
      artist: item.artist,
      description: item.description,
      category: item.category,
      price: item.price,
      image: item.image,
      previews: [item.image, "", "", ""],
    });

    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-[#e9eff3] p-20 relative">

      {/* LIST */}
      <div className="space-y-6">
        {products.map(item => (
          <div key={item._id}
            className="bg-white rounded-2xl p-6 flex justify-between shadow-sm">

            <div className="flex gap-6 items-center">
              <input
                type="checkbox"
                className="w-6 h-6 accent-[#f28c45]"
                checked={selectedItems.includes(item._id)}
                onChange={() => handleSelectItem(item._id)}
              />

              <img src={item.image}
                className="w-24 h-24 object-cover rounded-lg" />

              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-500">{item.artist}</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <p className="font-semibold">฿{item.price}</p>

              <button
                onClick={() => handleEdit(item)}
                className="text-gray-500 hover:text-black text-xl">
                ✏️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-20 py-5 flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <input
            type="checkbox"
            className="w-6 h-6 accent-[#f28c45]"
            checked={selectAll}
            onChange={handleSelectAll}
          />
          <span>เลือกทั้งหมด</span>

          <button
            onClick={handleDeleteProducts}
            className="text-red-500 font-semibold">
            ลบสินค้า ({selectedItems.length})
          </button>
        </div>

        <button
          onClick={() => {
            setIsEdit(false);
            setShowModal(true);
          }}
          className="bg-[#f28c45] text-white px-8 py-3 rounded-xl">
          เพิ่มสินค้า
        </button>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white w-[800px] rounded-2xl p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl text-center font-semibold mb-8 relative">
              <button
                onClick={() => {
                  setShowModal(false);
                  setIsEdit(false);
                  setEditingId(null);
                }}
                className="absolute top-0 right-0 text-gray-400 hover:text-black text-2xl font-bold"
              >
                X
              </button>
              {isEdit ? "แก้ไขสินค้า" : "เพิ่มสินค้า"}
            </h2>

            {/* ===== TOP SECTION ===== */}
            <div className="grid grid-cols-2 gap-8 mb-8">

              {/* รูปใหญ่ */}
              <label className="h-[220px] bg-gray-200 rounded-2xl flex items-center justify-center cursor-pointer overflow-hidden">
                {formData.previews[0]
                  ? <img src={formData.previews[0]} className="w-full h-full object-cover" />
                  : <span className="text-gray-500">เลือกรูปหลัก</span>}
                <input type="file" hidden
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 0)} />
              </label>

              {/* รูปเล็ก 3 รูป */}
              <div className="flex flex-col gap-3">
                {[1, 2, 3].map(i => (
                  <label key={i}
                    className="h-[75px] bg-gray-200 rounded-xl flex items-center justify-center cursor-pointer overflow-hidden">
                    {formData.previews[i]
                      ? <img src={formData.previews[i]} className="w-full h-full object-cover" />
                      : <span className="text-sm text-gray-500">เลือกรูป</span>}
                    <input type="file" hidden
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, i)} />
                  </label>
                ))}
              </div>
            </div>

            {/* ===== FORM ===== */}
            <div className="space-y-4 mb-8">

              <input
                className="w-full p-3 border rounded-lg"
                placeholder="ชื่อสินค้า"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />

              <input
                className="w-full p-3 border rounded-lg"
                placeholder="ศิลปิน"
                value={formData.artist}
                onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
              />

              {/* 🔥 ราคา (ไม่มีลูกศรแล้ว) */}
              <input
                placeholder="ราคา"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full p-3 border rounded-lg appearance-none
                     [&::-webkit-outer-spin-button]:appearance-none
                     [&::-webkit-inner-spin-button]:appearance-none"
              />

              <textarea
                className="w-full p-3 border rounded-lg h-24 resize-none"
                placeholder="รายละเอียด"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />

              {/* หมวดหมู่ */}
              <div>
                <p className="mb-2 text-sm font-medium">หมวดหมู่สินค้า</p>
                <div className="grid grid-cols-3 gap-3">
                  {categories.map(cat => (
                    <button
                      key={cat.slug}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, category: cat.slug })
                      }
                      className={`p-2 rounded-lg text-sm border transition
                  ${formData.category === cat.slug
                          ? "bg-[#f28c45] text-white border-[#f28c45]"
                          : "bg-gray-100 hover:bg-gray-200"
                        }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* ===== BUTTON ===== */}
            <div className="text-center">
              <button
                onClick={handleSubmit}
                className="bg-[#f28c45] text-white px-10 py-2.5 rounded-lg hover:scale-105 transition"
              >
                {isEdit ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ALERT MODAL */}
      {alertData.show && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[999]">
          <div className="bg-white w-[400px] rounded-2xl p-8 text-center shadow-xl">
            <p className="text-lg font-semibold mb-6">
              {alertData.message}
            </p>

            <div className="flex justify-center gap-4">
              {alertData.onConfirm && (
                <button
                  onClick={() => {
                    alertData.onConfirm();
                    setAlertData({ show: false, message: "", onConfirm: null });
                  }}
                  className="bg-[#f28c45] text-white px-6 py-2 rounded-lg">
                  ยืนยัน
                </button>
              )}

              <button
                onClick={() =>
                  setAlertData({ show: false, message: "", onConfirm: null })
                }
                className="bg-gray-200 px-6 py-2 rounded-lg">
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}