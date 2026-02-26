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
    axios.get(`http://localhost:5000/api/category/${slug}`)
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

  // ================= IMAGE (เลือกได้ทุกช่อง) =================
  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const updated = [...formData.previews];
      updated[index] = reader.result;

      setFormData(prev => ({
        ...prev,
        image: updated[0], // รูปหลัก
        previews: updated
      }));
    };
    reader.readAsDataURL(file);
  };

  // ================= ADD / EDIT =================
  const handleSubmit = async () => {
    if (!formData.name || !formData.artist || !formData.previews[0]) {
      return alert("กรอกข้อมูลให้ครบ");
    }

    if (!window.confirm(isEdit ? "ยืนยันแก้ไขสินค้า?" : "ยืนยันเพิ่มสินค้า?"))
      return;

    try {
      if (isEdit) {
        await axios.put(`http://localhost:5000/api/product/${editingId}`, formData);
        alert("แก้ไขสำเร็จ");
      } else {
        await axios.post("http://localhost:5000/api/product", formData);
        alert("เพิ่มสินค้าสำเร็จ");
      }

      const res = await axios.get(`http://localhost:5000/api/category/${slug}`);
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

    } catch (err) {
      alert("เกิดข้อผิดพลาด");
    }
  };

  // ================= DELETE =================
  const handleDeleteProducts = async () => {
    if (!selectedItems.length)
      return alert("กรุณาเลือกสินค้า");

    if (!window.confirm("แน่ใจหรือไม่ว่าต้องการลบ?"))
      return;

    await Promise.all(
      selectedItems.map(id =>
        axios.delete(`http://localhost:5000/api/product/${id}`)
      )
    );

    alert("ลบสำเร็จ");

    setProducts(products.filter(p => !selectedItems.includes(p._id)));
    setSelectedItems([]);
    setSelectAll(false);
  };

  // ================= EDIT CLICK =================
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
   
      <div className="min-h-screen flex items-center justify-center bg-[#e9eff3] relative">

      {/* LIST */}
      <div className="px-20 pt-10 space-y-6">
        {products.map(item => (
          <div key={item._id}
            className="bg-white rounded-2xl p-6 flex justify-between shadow-sm">

            <div className="flex gap-6 items-center">

              {/* BIG CHECKBOX */}
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

              {/* EDIT ICON */}
              <button onClick={() => handleEdit(item)}
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
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-[1000px] rounded-3xl p-10 relative">

            <h2 className="text-2xl text-center font-semibold mb-8">
              {isEdit ? "แก้ไขสินค้า" : "เพิ่มสินค้า"}
            </h2>

            <div className="grid grid-cols-3 gap-10">

              {/* LEFT IMAGE 4 ช่อง */}
              <div className="space-y-4">
                {[0,1,2,3].map(i => (
                  <label key={i}
                    className="w-full h-40 bg-gray-200 rounded-2xl flex items-center justify-center cursor-pointer overflow-hidden">
                    {formData.previews[i]
                      ? <img src={formData.previews[i]} className="w-full h-full object-cover"/>
                      : <span>เลือกรูป</span>}
                    <input type="file" hidden
                      accept="image/*"
                      onChange={(e)=>handleImageChange(e,i)}/>
                  </label>
                ))}
              </div>

              {/* MIDDLE */}
              <div className="space-y-6">
                <input className="w-full p-4 border rounded-xl"
                  placeholder="ชื่อสินค้า"
                  value={formData.name}
                  onChange={(e)=>setFormData({...formData,name:e.target.value})}/>

                <input className="w-full p-4 border rounded-xl"
                  placeholder="ศิลปิน"
                  value={formData.artist}
                  onChange={(e)=>setFormData({...formData,artist:e.target.value})}/>

                <input className="w-full p-4 border rounded-xl"
                  type="number"
                  placeholder="ราคา"
                  value={formData.price}
                  onChange={(e)=>setFormData({...formData,price:e.target.value})}/>

                <textarea className="w-full p-4 border rounded-xl h-32"
                  placeholder="รายละเอียด"
                  value={formData.description}
                  onChange={(e)=>setFormData({...formData,description:e.target.value})}/>
              </div>

              {/* RIGHT CATEGORY */}
              <div className="flex flex-col gap-4">
                {categories.map(cat => (
                  <button key={cat.slug}
                    onClick={()=>setFormData({...formData,category:cat.slug})}
                    className={`p-4 rounded-xl text-left ${
                      formData.category===cat.slug
                        ? "bg-[#f28c45] text-white"
                        : "bg-gray-200"
                    }`}>
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-center mt-10">
              <button
                onClick={handleSubmit}
                className="bg-[#f28c45] text-white px-12 py-3 rounded-xl">
                {isEdit ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}
              </button>
            </div>

            <button
              onClick={()=>setShowModal(false)}
              className="absolute top-4 right-6 text-xl text-gray-400">
              ✕
            </button>

          </div>
        </div>
      )}

    </div>
  );
}