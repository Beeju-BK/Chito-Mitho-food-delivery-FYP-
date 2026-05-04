


import { useState, useEffect, useContext, useRef } from "react";
import { Plus, Search, Edit2, Trash2, Upload } from "lucide-react";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext.jsx";

export default function MenuManagement() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", price: "", menuImage: null });
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  // Fetch menu items on mount & when user changes
  useEffect(() => {
    if (!user || authLoading) return;
    fetchMenu();
  }, [user, authLoading]);

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get("http://localhost:3000/api/menu/get", { withCredentials: true });
      setMenu(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch menu items");
      console.error("Fetch menu error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError("Please select a valid image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }

      setForm(prev => ({ ...prev, menuImage: file }));
      setError("");

      if (imagePreview) URL.revokeObjectURL(imagePreview);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const removeImage = () => {
    setForm(prev => ({ ...prev, menuImage: null }));
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const filtered = menu.filter((item) => 
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.description.toLowerCase().includes(search.toLowerCase())
  );

  const deleteItem = async (id) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    
    try {
      setError("");
      await axios.delete(`http://localhost:3000/api/menu/delete/${id}`, { withCredentials: true });
      fetchMenu();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete item");
    }
  };

  const openAdd = () => {
    setEditItem(null);
    setForm({ name: "", description: "", price: "", menuImage: null });
    setImagePreview(null);
    setError("");
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item._id);
    setForm({ 
      name: item.name, 
      description: item.description, 
      price: item.price,
      menuImage: item.menuImage 
    });
    setImagePreview(item.menuImage || null);
    setError("");
    setShowModal(true);
  };

 const saveItem = async () => {
  if (!form.name || !form.price) {
    setError("Name and price are required");
    return;
  }

  try {
    setError("");
    setLoading(true);

    const submitData = new FormData();
    submitData.append("name", form.name);
    submitData.append("description", form.description);
    submitData.append("price", form.price);
    
    // ✅ FIXED: Backend expects 'menuImage' field
    if (form.menuImage && typeof form.menuImage !== 'string') {
      submitData.append("menuImage", form.menuImage);  // ← CHANGED FROM "image" to "menuImage"
    }

    let response;

    if (editItem) {
      response = await axios.put(`http://localhost:3000/api/menu/update/${editItem}`, submitData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
    } else {
      response = await axios.post("http://localhost:3000/api/menu/add", submitData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
    }

    setShowModal(false);
    fetchMenu();
  } catch (err) {
    setError(err.response?.data?.message || "Failed to save item");
  } finally {
    setLoading(false);
  }
};




  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Menu Management</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {menu.length} items • {user.restaurantId ? "Restaurant Owner" : "Admin"}
          </p>
        </div>
        <button 
          onClick={openAdd} 
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
          disabled={loading}
        >
          <Plus size={16} /> Add Item
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="relative max-w-md">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search name or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
          disabled={loading}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div key={item._id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center text-3xl overflow-hidden">
                  {item.menuImage ? (
                    <img 
                      src={item.menuImage} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentNode.innerHTML = '🍽️';
                      }}
                    />
                  ) : (
                    "🍽️"
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-800 text-sm truncate">{item.name}</h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
              <span className="font-bold text-gray-900 text-base">NPR {item.price}</span>
              <div className="flex gap-1">
                <button 
                  onClick={() => openEdit(item)} 
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                  disabled={loading}
                >
                  <Edit2 size={14} />
                </button>
                <button 
                  onClick={() => deleteItem(item._id)} 
                  className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                  disabled={loading}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && filtered.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🍽️</div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No menu items found</h3>
          <p className="text-gray-500 mb-4">Add your first menu item to get started</p>
          <button 
            onClick={openAdd}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-indigo-700"
          >
            Add First Item
          </button>
        </div>
      )}

      {/* Modal with Image Upload */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="font-semibold text-gray-800 mb-5">
              {editItem ? "Edit Item" : "Add New Item"}
            </h3>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs mb-4">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">
                  Item Name <span className="text-red-500">*</span>
                </label>
                <input 
                  value={form.name} 
                  onChange={(e) => setForm({ ...form, name: e.target.value })} 
                  placeholder="e.g. Chicken Momo"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200" 
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Description</label>
                <textarea 
                  value={form.description} 
                  onChange={(e) => setForm({ ...form, description: e.target.value })} 
                  placeholder="Describe this dish..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-none" 
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">
                  Price (NPR) <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  step="0.01"
                  min="0"
                  value={form.price} 
                  onChange={(e) => setForm({ ...form, price: e.target.value })} 
                  placeholder="250"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200" 
                />
              </div>

              {/* Image Upload - FIXED Vite Error */}
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Menu Image</label>
                <div className="space-y-2">
                  <div 
                    className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-indigo-300 transition-colors cursor-pointer bg-gray-50 hover:bg-indigo-50"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {form.menuImage ? (
                      form.menuImage instanceof File ? (
                        <div className="space-y-2">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="w-24 h-24 object-cover rounded-lg mx-auto shadow-md"
                          />
                          <p className="text-xs text-gray-500 truncate max-w-[200px]">
                            {form.menuImage.name}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <img 
                            src={form.menuImage} 
                            alt="Current" 
                            className="w-24 h-24 object-cover rounded-lg mx-auto shadow-md"
                          />
                          <p className="text-xs text-gray-500">Current image</p>
                        </div>
                      )
                    ) : (
                      <>
                        <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                        {/* ✅ FIXED: No < character in text */}
                        <p className="text-sm text-gray-500">Click to upload image (JPG, PNG, max 5MB)</p>
                      </>
                    )}
                  </div>
                  
                  {form.menuImage && (
                    <button
                      onClick={removeImage}
                      className="w-full bg-red-50 hover:bg-red-100 text-red-600 text-xs py-2 px-3 rounded-lg border border-red-200 font-medium transition-colors flex items-center justify-center gap-1"
                    >
                      <Trash2 size={12} /> Remove Image
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowModal(false)} 
                className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-2.5 text-sm font-medium hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                onClick={saveItem} 
                disabled={!form.name || !form.price || loading}
                className="flex-1 bg-indigo-600 disabled:bg-gray-400 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-indigo-700 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  editItem ? "Save Changes" : "Add Item"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}