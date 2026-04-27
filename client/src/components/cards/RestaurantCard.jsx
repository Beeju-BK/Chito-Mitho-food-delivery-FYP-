// ✅ FIXED RestaurantCard.jsx - Remove menus reference
const RestaurantCard = ({ restaurant, onClick }) => {
  return (
    <div 
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer group hover:-translate-y-2 border border-gray-100 hover:border-orange-200 h-full"
      onClick={onClick}
    >
      {/* Image */}
      <div className="h-64 overflow-hidden relative group-hover:scale-105 transition-transform duration-500">
        <img
          src={restaurant.restaurantImage}
          alt={restaurant.restaurantName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-1 group-hover:text-orange-600 transition-colors">
          {restaurant.restaurantName}
        </h3>
        
        <p className="text-lg text-gray-600 mb-4 line-clamp-2">
          {restaurant.restaurantType}
        </p>
        
        {/* Location */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Location
          </div>
          <div className="text-orange-600 font-semibold text-base line-clamp-1">
            {restaurant.owner?.address || 'Near You'}
          </div>
        </div>

        {/* Timing */}
        {restaurant.openingTime && restaurant.closingTime && (
          <div className="flex items-center gap-2 text-sm text-orange-600 font-semibold mb-6">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {restaurant.openingTime} - {restaurant.closingTime}
          </div>
        )}
        
        {/* ✅ FIXED: Simple button - no menus */}
        <button className="mt-auto bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 w-full">
          🍽️ View Menu
        </button>
      </div>
    </div>
  );
};


export default RestaurantCard;