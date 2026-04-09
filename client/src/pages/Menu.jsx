import { useEffect, useState, useCallback } from "react";
import axios from "axios";

import MenuCard from "../components/cards/MenuCard";

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMenuItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // ✅ YOUR BACKEND ROUTE
      const response = await axios.get("http://localhost:3000/api/menu/public");
      
      // ✅ Matches your controller response
      setMenuItems(response.data.data || []);

    } catch (error) {
      console.error("Error fetching menu items:", error);
      setError(error.response?.data?.message || "Failed to load menu items");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading menu...</p>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full text-center">
          <div className="text-red-500 w-16 h-16 mx-auto mb-4">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">{error}</h3>
          <button
            onClick={fetchMenuItems}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
     

      {/* YOUR EXACT STYLE */}
      <section className="py-6 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-5">
            Our Menu
          </h2>

          {menuItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">No menu items available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {menuItems.map(item => (
                <MenuCard
                  key={item._id}           
                  id={item._id}            
                  img={item.menuImage}     
                  name={item.name}
                  description={item.description}
                  price={item.price}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Menu;