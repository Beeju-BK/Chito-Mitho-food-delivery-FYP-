// import { useState, useEffect } from "react";
// import axios from "axios";
// import RestaurantCard from "../components/cards/RestaurantCard"; // We'll create this
// import MenuCard from "../components/cards/MenuCard";

// const Restaurant = () => {
//   const [restaurants, setRestaurants] = useState([]);
//   const [selectedRestaurant, setSelectedRestaurant] = useState(null);
//   const [menus, setMenus] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [restaurantLoading, setRestaurantLoading] = useState(false);

//   // Fetch all restaurants
//   useEffect(() => {
//     fetchRestaurants();
//   }, []);

//   const fetchRestaurants = async () => {
//     try {
//       setLoading(true);
//       const { data } = await axios.get("http://localhost:3000/api/restaurant/all");
//       setRestaurants(data.restaurants || []);
//     } catch (error) {
//       console.error("Error fetching restaurants:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch restaurant menus
//   // ✅ FIXED: Correct API endpoint
// const fetchRestaurantMenus = async (restaurantId) => {
//   try {
//     setRestaurantLoading(true);
//     // ✅ FIXED: Use menu API, not restaurant API
//     const { data } = await axios.get(`http://localhost:3000/api/menu/restaurant/${restaurantId}`);
//     setMenus(data.menus || []);
//   } catch (error) {
//     console.error("Menu error:", error.response?.data || error.message);
//     setMenus([]);
//   } finally {
//     setRestaurantLoading(false);
//   }
// };
//   const handleRestaurantClick = (restaurant) => {
//     setSelectedRestaurant(restaurant);
//     fetchRestaurantMenus(restaurant._id);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
//         <div className="text-center">
//           <div className="w-12 h-12 border-4 border-gray-300 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-lg text-gray-600">Loading restaurants...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-16">
//           <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">🍽️ Restaurants</h1>
//           <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//             Choose your favorite restaurant and explore the menu
//           </p>
//         </div>

//         {!selectedRestaurant ? (
//           /* Restaurants Grid */
//           <>
//             <div className="mb-8 text-center">
//               <p className="text-2xl font-semibold text-gray-800">
//                 {restaurants.length} restaurants available
//               </p>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
//               {restaurants.length === 0 ? (
//                 <div className="col-span-full text-center py-20 bg-white rounded-xl shadow-sm border">
//                   <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-xl flex items-center justify-center">
//                     <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
//                     </svg>
//                   </div>
//                   <h3 className="text-2xl font-bold text-gray-900 mb-2">No restaurants found</h3>
//                   <p className="text-gray-600">Check back later</p>
//                 </div>
//               ) : (
//                 restaurants.map(restaurant => (
//                   <RestaurantCard
//                     key={restaurant._id}
//                     restaurant={restaurant}
//                     onClick={() => handleRestaurantClick(restaurant)}
//                   />
//                 ))
//               )}
//             </div>
//           </>
//         ) : (
//           /* Selected Restaurant Menus */
//           <>
//             {/* Back Button */}
//             <div className="mb-12">
//               <button
//                 onClick={() => setSelectedRestaurant(null)}
//                 className="inline-flex items-center gap-2 text-lg font-semibold text-orange-600 hover:text-orange-700 transition-colors bg-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                 </svg>
//                 All Restaurants
//               </button>
//             </div>

//             {/* Restaurant Header */}
//             <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 text-center border border-gray-100">
//               <img
//                 src={selectedRestaurant.restaurantImage}
//                 alt={selectedRestaurant.restaurantName}
//                 className="w-32 h-32 rounded-3xl mx-auto object-cover shadow-2xl mb-6"
//               />
//               <h2 className="text-4xl font-bold text-gray-900 mb-2">
//                 {selectedRestaurant.restaurantName}
//               </h2>
//               <p className="text-xl text-gray-600 mb-6">
//                 {selectedRestaurant.restaurantType}
//               </p>
//               {selectedRestaurant.openingTime && selectedRestaurant.closingTime && (
//                 <p className="text-lg text-orange-600 font-semibold">
//                   🕒 {selectedRestaurant.openingTime} - {selectedRestaurant.closingTime}
//                 </p>
//               )}
//             </div>

//             {/* Menus Grid */}
//             <div className="mb-8 text-center">
//               <p className="text-2xl font-semibold text-gray-800">
//                 {menus.length} menu items
//               </p>
//             </div>
//             {restaurantLoading ? (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
//                 {[...Array(6)].map((_, i) => (
//                   <div key={i} className="bg-white rounded-xl p-6 animate-pulse shadow-sm">
//                     <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
//                     <div className="h-6 bg-gray-200 rounded-full mb-2"></div>
//                     <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
//                     <div className="h-8 bg-gray-200 rounded-full w-1/2"></div>
//                   </div>
//                 ))}
//               </div>
//             ) : menus.length === 0 ? (
//               <div className="col-span-full text-center py-20 bg-white rounded-xl shadow-sm border">
//                 <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-xl flex items-center justify-center">
//                   <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                   </svg>
//                 </div>
//                 <h3 className="text-2xl font-bold text-gray-900 mb-2">No menu items</h3>
//                 <p className="text-gray-600">This restaurant has no menu yet</p>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
//                 {menus.map(menu => (
//                   <MenuCard
//                     key={menu._id}
//                     id={menu._id}
//                     img={menu.menuImage}
//                     name={menu.name}
//                     description={menu.description}
//                     price={menu.price}
//                   />
//                 ))}
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Restaurant;


import { useState, useEffect } from "react";
import axios from "axios";
import RestaurantCard from "../components/cards/RestaurantCard";
import MenuCard from "../components/cards/MenuCard";

const Restaurant = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restaurantLoading, setRestaurantLoading] = useState(false);
  const [restaurantSearch, setRestaurantSearch] = useState("");
  const [menuSearch, setMenuSearch] = useState("");

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("http://localhost:3000/api/restaurant/all");
      setRestaurants(data.restaurants || []);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRestaurantMenus = async (restaurantId) => {
    try {
      setRestaurantLoading(true);
      const { data } = await axios.get(
        `http://localhost:3000/api/menu/restaurant/${restaurantId}`
      );
      setMenus(data.menus || []);
    } catch (error) {
      console.error("Menu error:", error.response?.data || error.message);
      setMenus([]);
    } finally {
      setRestaurantLoading(false);
    }
  };

  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setMenuSearch(""); // reset menu search on restaurant change
    fetchRestaurantMenus(restaurant._id);
  };

  const handleBack = () => {
    setSelectedRestaurant(null);
    setMenuSearch("");
    setRestaurantSearch("");
  };

  // Filtered lists
  const filteredRestaurants = restaurants.filter((r) => {
    const q = restaurantSearch.toLowerCase();
    return (
      r.restaurantName?.toLowerCase().includes(q) ||
      r.restaurantType?.toLowerCase().includes(q)
    );
  });

  const filteredMenus = menus.filter((m) => {
    const q = menuSearch.toLowerCase();
    return (
      m.name?.toLowerCase().includes(q) ||
      m.description?.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading restaurants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            🍽️ Restaurants
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your favorite restaurant and explore the menu
          </p>
        </div>

        {!selectedRestaurant ? (
          <>
            {/* Restaurant Search */}
            <div className="mb-8 max-w-xl mx-auto">
              <div className="relative">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                  />
                </svg>
                <input
                  type="text"
                  value={restaurantSearch}
                  onChange={(e) => setRestaurantSearch(e.target.value)}
                  placeholder="Search restaurants or cuisine type..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white text-gray-800 placeholder-gray-400"
                />
                {restaurantSearch && (
                  <button
                    onClick={() => setRestaurantSearch("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-2 text-center">
                {filteredRestaurants.length} of {restaurants.length} restaurants
              </p>
            </div>

            {/* Restaurants Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredRestaurants.length === 0 ? (
                <div className="col-span-full text-center py-20 bg-white rounded-xl shadow-sm border">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-xl flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    No restaurants found
                  </h3>
                  <p className="text-gray-600">
                    Try a different search term
                  </p>
                  <button
                    onClick={() => setRestaurantSearch("")}
                    className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition font-semibold"
                  >
                    Clear Search
                  </button>
                </div>
              ) : (
                filteredRestaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant._id}
                    restaurant={restaurant}
                    onClick={() => handleRestaurantClick(restaurant)}
                  />
                ))
              )}
            </div>
          </>
        ) : (
          <>
            {/* Back Button */}
            <div className="mb-8">
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-2 text-lg font-semibold text-orange-600 hover:text-orange-700 transition-colors bg-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                </svg>
                All Restaurants
              </button>
            </div>

            {/* Restaurant Header */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-10 text-center border border-gray-100">
              <img
                src={selectedRestaurant.restaurantImage}
                alt={selectedRestaurant.restaurantName}
                className="w-32 h-32 rounded-3xl mx-auto object-cover shadow-2xl mb-6"
              />
              <h2 className="text-4xl font-bold text-gray-900 mb-2">
                {selectedRestaurant.restaurantName}
              </h2>
              <p className="text-xl text-gray-600 mb-4">
                {selectedRestaurant.restaurantType}
              </p>
              {selectedRestaurant.openingTime && selectedRestaurant.closingTime && (
                <p className="text-lg text-orange-600 font-semibold">
                  🕒 {selectedRestaurant.openingTime} - {selectedRestaurant.closingTime}
                </p>
              )}
            </div>

            {/* Menu Search */}
            <div className="mb-8 max-w-xl mx-auto">
              <div className="relative">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                  />
                </svg>
                <input
                  type="text"
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                  placeholder="Search menu items..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white text-gray-800 placeholder-gray-400"
                />
                {menuSearch && (
                  <button
                    onClick={() => setMenuSearch("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-2 text-center">
                {filteredMenus.length} of {menus.length} items
              </p>
            </div>

            {/* Menus Grid */}
            {restaurantLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-6 animate-pulse shadow-sm">
                    <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded-full w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : filteredMenus.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl shadow-sm border">
                <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-xl flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {menuSearch ? "No items match your search" : "No menu items"}
                </h3>
                <p className="text-gray-600">
                  {menuSearch ? "Try a different search term" : "This restaurant has no menu yet"}
                </p>
                {menuSearch && (
                  <button
                    onClick={() => setMenuSearch("")}
                    className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition font-semibold"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredMenus.map((menu) => (
                  <MenuCard
                    key={menu._id}
                    id={menu._id}
                    img={menu.menuImage}
                    name={menu.name}
                    description={menu.description}
                    price={menu.price}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Restaurant;