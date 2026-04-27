import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import MenuCard from "../components/cards/MenuCard";

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/api/menu/public");
      setMenuItems(response.data.data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  // Simple search
  const filteredItems = useMemo(() => {
    if (!searchTerm) return menuItems;
    return menuItems.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [menuItems, searchTerm]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Simple */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Menu</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {filteredItems.length} of {menuItems.length} items
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12 ">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search burgers, pizza, drinks..."
              className="w-full p-4 pl-12 pr-6 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm"
            />
            <svg className="w-6 h-6 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Grid - YOUR ORIGINAL SIZING */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredItems.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-white rounded-xl shadow-sm border">
              <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-xl flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No items found</h3>
              <p className="text-gray-600">Try a different search</p>
            </div>
          ) : (
            filteredItems.map(item => (
              <MenuCard
                key={item._id}
                id={item._id}
                img={item.menuImage}
                name={item.name}
                description={item.description}
                price={item.price}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;