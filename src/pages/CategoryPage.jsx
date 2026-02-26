import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function CategoryPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    artist: "",
    description: "",
    category: slug,
    images: "",
    previews: [],
  });

  const categories = [
    { name: "CD เพลง", slug: "cd" },
    { name: "แผ่นเสียง", slug: "vinyl" },
    { name: "เทปคาสเซ็ท", slug: "cassette" },
    { name: "โปสเตอร์ศิลปิน", slug: "poster" },
    { name: "เสื้อวง", slug: "tshirt" },
  ];

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/category/${slug}`)
      .then((res) => {
        setProducts(res.data);
        setSelectedItems([]);
        setSelectAll(false);
      });
  }, [slug]);

  // =========================
  // SELECT LOGIC
  // =========================

  const handleSelectItem = (id) => {
    let updated;

    if (selectedItems.includes(id)) {
      updated = selectedItems.filter((item) => item !== id);
    } else {
      updated = [...selectedItems, id];
    }

    setSelectedItems(updated);

    // 🔥 ถ้าติ๊กครบทุกตัว → selectAll = true
    if (updated.length === products.length && products.length !== 0) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
      setSelectAll(false);
    } else {
      setSelectedItems(products.map((item) => item._id));
      setSelectAll(true);
    }
  };

  // =========================
  // IMAGE UPLOAD (4 รูป)
  // =========================

  const handleImageChange = (e) => {
  const file = e.target.files[0]; // just first image for now
  if (!file) return;

  const reader = new FileReader();

  reader.onloadend = () => {
    setFormData((prev) => ({
      ...prev,
      image: reader.result, // base64 string
      previews: [reader.result], // use same for preview
    }));
  };

  reader.readAsDataURL(file);
};

  // =========================
  // ADD PRODUCT
  // =========================

  const handleAddProduct = async () => {
  if (!formData.name || !formData.artist || formData.previews.length === 0) {
    alert("Please fill in all fields and upload at least 1 image");
    return;
  }

  try {
    const res = await axios.post("http://localhost:5000/api/product", {
      name: formData.name,
      artist: formData.artist,
      description: formData.description,
      category: formData.category,
      price: 0,
      image: formData.image,
    });

    setProducts([...products, res.data.product]);
    setShowModal(false);

  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="bg-[#e9eff3] font-prompt pb-32">

      {/* LIST */}
      <div className="px-20 pt-10 space-y-6">
        {products.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-2xl p-6 flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-6">
              <input
                type="checkbox"
                checked={selectedItems.includes(item._id)}
                onChange={() => handleSelectItem(item._id)}
              />

              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-lg"
              />

              <div>
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-500">{item.artist}</p>
              </div>
            </div>

            <p className="font-semibold">฿{item.price}</p>
          </div>
        ))}
      </div>

      {/* BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-20 py-5 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
          />
          <span>เลือกทั้งหมด</span>

          <button className="font-semibold text-red-500">
            ลบสินค้า ({selectedItems.length})
          </button>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-[#f28c45] text-white px-8 py-3 rounded-xl"
        >
          เพิ่มสินค้า
        </button>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-[1000px] rounded-3xl p-10 relative">

            <h2 className="text-2xl text-center font-semibold mb-8">
              เพิ่มสินค้า
            </h2>

            <div className="grid grid-cols-3 gap-10">

              {/* LEFT - IMAGE SECTION */}
              <div className="col-span-1 space-y-4">

                <label className="w-full h-64 bg-gray-200 rounded-2xl flex items-center justify-center cursor-pointer overflow-hidden">
                  {formData.previews[0] ? (
                    <img
                      src={formData.previews[0]}
                      alt="main"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>รูปหลัก</span>
                  )}
                  <input
                    type="file"
                    multiple
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>

                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-24 bg-gray-200 rounded-xl overflow-hidden"
                    >
                      {formData.previews[i] && (
                        <img
                          src={formData.previews[i]}
                          alt="sub"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* MIDDLE - FORM */}
              <div className="space-y-6">
                <input
                  type="text"
                  placeholder="ชื่อ"
                  className="w-full p-4 border rounded-xl"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />

                <input
                  type="text"
                  placeholder="วง"
                  className="w-full p-4 border rounded-xl"
                  value={formData.artist}
                  onChange={(e) =>
                    setFormData({ ...formData, artist: e.target.value })
                  }
                />

                <textarea
                  placeholder="ข้อมูลจำเพาะ"
                  className="w-full p-4 border rounded-xl h-40"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              {/* RIGHT - CATEGORY */}
              <div className="flex flex-col gap-4">
                {categories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() =>
                      setFormData({ ...formData, category: cat.slug })
                    }
                    className={`p-4 rounded-xl text-left ${
                      formData.category === cat.slug
                        ? "bg-[#f28c45] text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-center mt-10">
              <button
                onClick={handleAddProduct}
                className="bg-[#f28c45] text-white px-12 py-3 rounded-xl"
              >
                เพิ่มสินค้า
              </button>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-6 text-xl text-gray-400"
            >
              ✕
            </button>

          </div>
        </div>
      )}
    </div>
  );
}