import axios from "axios";
import { useContext, useState } from "react"; // Added useState
import { AuthContext } from "../../contexts/AuthContext.jsx";

const MenuCard = ({ id, img, name, description, price }) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false); // Track loading state

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    if (!user) {
      alert("Please log in to add items to your cart.");
      return;
    }

    setLoading(true); // Disable button and show loading

    try {
      // NOTE: We only send menuId and quantity. 
      // The backend gets the User ID from the session/token middleware.
      const response = await axios.post(
        "http://localhost:3000/api/cart/add",
        {
          menuId: id,
          quantity: 1,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        alert(`${name} added to cart! 🛒`);
      }
    } catch (error) {
      console.error("Cart Error:", error);
      alert(error.response?.data?.message || "Failed to add to cart");
    } finally {
      setLoading(false); // Re-enable button
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden cursor-pointer group flex flex-col mb-5">
      {/* Image Section */}
      <div className="w-full h-44 sm:h-48 md:h-52 overflow-hidden">
        <img
          src={img}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300/f8f9fa/6c757d?text=No+Image';
          }}
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-col justify-between flex-1 p-4 sm:p-5">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-800">{name}</h3>
          <p className="text-gray-500 text-sm sm:text-base mt-2 line-clamp-2">
            {description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-4 sm:mt-6">
          <span className="text-base sm:text-lg font-semibold text-orange-500">
            NRS. {parseFloat(price).toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={loading} // Prevent multiple clicks
            className={`${
              loading ? "bg-gray-400" : "bg-orange-500 hover:bg-orange-600"
            } text-white px-4 py-2 rounded-full text-sm font-semibold transition duration-300 flex items-center`}
          >
            {loading ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;