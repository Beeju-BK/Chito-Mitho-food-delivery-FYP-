// import { useState } from "react";
// import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
// import axios from "axios";

// export function CartCard({ item, onUpdate, onRemove }) {
//   const [loading, setLoading] = useState(false);

//   // Fixed: sends { menuId, quantity } in body — matches controller's req.body
//   const handleDecrease = async () => {
//     if (item.quantity <= 1 || loading) return;
//     setLoading(true);
//     try {
//       const newQty = item.quantity - 1;
//       await axios.put(
//         "http://localhost:3000/api/cart/update",
//         { menuId: item.menu._id, quantity: newQty },
//         { withCredentials: true }
//       );
//       onUpdate(item.menu._id, newQty);
//     } catch (error) {
//       console.error("Failed to decrease quantity:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fixed: sends { menuId, quantity } in body — matches controller's req.body
//   const handleIncrease = async () => {
//     if (loading) return;
//     setLoading(true);
//     try {
//       const newQty = item.quantity + 1;
//       await axios.put(
//         "http://localhost:3000/api/cart/update",
//         { menuId: item.menu._id, quantity: newQty },
//         { withCredentials: true }
//       );
//       onUpdate(item.menu._id, newQty);
//     } catch (error) {
//       console.error("Failed to increase quantity:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fixed: sends { menuId } in body — matches controller's req.body
//   const handleRemove = async () => {
//     if (loading) return;
//     setLoading(true);
//     try {
//       await axios.delete("http://localhost:3000/api/cart/remove", {
//         data: { menuId: item.menu._id },
//         withCredentials: true,
//       });
//       onRemove(item.menu._id);
//     } catch (error) {
//       console.error("Failed to remove item:", error);
//     } finally {
//       setLoading(false);
//     }
//   };


//   const total = item.menu.price * item.quantity;

//   return (
//     <div
//       className={`bg-white border-b border-gray-200 transition-colors ${
//         loading ? "opacity-60 pointer-events-none" : "hover:bg-gray-50"
//       }`}
//     >
//       <div className="grid grid-cols-[2fr_1fr_1fr_auto] gap-4 p-4 items-center">
//         {/* Image + Name */}
//         <div className="flex gap-3 items-start">
//           <div className="flex w-20 h-20 shrink-0">
//             <img
//               src={item.menu?.menuImage}
//               alt={item.menu?.name}
//               className="w-full h-full object-cover rounded-lg"
//               onError={(e) =>
//                 (e.target.src = "https://via.placeholder.com/80")
//               }
//             />
//           </div>
//           <div className="min-w-0">
//             <h3 className="font-semibold text-black text-sm mb-1">{item.menu?.name}</h3>
//             <p className="text-gray-600 text-xs line-clamp-2">
//               {item.menu?.description}
//             </p>
//             <p className="text-black text-sm mt-1">
//               NRS. {item.menu.price?.toFixed(2)} /-
//             </p>
//           </div>
//         </div>

//         {/* Quantity Controls */}
//         <div className="flex items-center gap-1">
//           <button
//             onClick={handleDecrease}
//             disabled={item.quantity <= 1 || loading}
//             className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
//           >
//             <FaMinus className="w-3 h-3" />
//           </button>
//           <span className="w-10 text-center text-sm font-medium">
//             {item.quantity}
//           </span>
//           <button
//             onClick={handleIncrease}
//             disabled={loading}
//             className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
//           >
//             <FaPlus className="w-3 h-3" />
//           </button>
//         </div>

//         {/* Subtotal */}
//         <div className="font-semibold text-sm">NRS. {total.toFixed(2)}</div>

//         {/* Remove */}
//         <div>
//           <button
//             onClick={handleRemove}
//             disabled={loading}
//             className="w-9 h-9 rounded border border-red-200 flex items-center justify-center hover:bg-red-50 text-red-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
//           >
//             <FaTrash className="w-4 h-4" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }



import { useState } from "react";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import axios from "axios";

export function CartCard({ item, onUpdate, onRemove }) {
  const [loading, setLoading] = useState(false);

  // Safe extraction — works whether restaurantId is a populated object or plain ID
  const restaurantId = item.restaurantId?._id || item.restaurantId;

  const handleDecrease = async () => {
    if (item.quantity <= 1 || loading) return;
    setLoading(true);
    try {
      const newQty = item.quantity - 1;
      await axios.put(
        "http://localhost:3000/api/cart/update",
        { menuId: item.menu._id, quantity: newQty, restaurantId },
        { withCredentials: true }
      );
      onUpdate();
    } catch (error) {
      console.error("Failed to decrease quantity:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleIncrease = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const newQty = item.quantity + 1;
      await axios.put(
        "http://localhost:3000/api/cart/update",
        { menuId: item.menu._id, quantity: newQty, restaurantId },
        { withCredentials: true }
      );
      onUpdate();
    } catch (error) {
      console.error("Failed to increase quantity:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await axios.delete("http://localhost:3000/api/cart/remove", {
        data: { menuId: item.menu._id, restaurantId },
        withCredentials: true,
      });
      onRemove();
    } catch (error) {
      console.error("Failed to remove item:", error);
    } finally {
      setLoading(false);
    }
  };

  const total = item.menu.price * item.quantity;

  return (
    <div
      className={`bg-white border-b border-gray-200 transition-colors ${
        loading ? "opacity-60 pointer-events-none" : "hover:bg-gray-50"
      }`}
    >
      <div className="grid grid-cols-[2fr_1fr_1fr_auto] gap-4 p-4 items-center">
        {/* Image + Name */}
        <div className="flex gap-3 items-start">
          <div className="flex w-20 h-20 shrink-0">
            <img
              src={item.menu?.menuImage}
              alt={item.menu?.name}
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => (e.target.src = "https://via.placeholder.com/80")}
            />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-black text-sm mb-1">
              {item.menu?.name}
            </h3>
            <p className="text-gray-600 text-xs line-clamp-2">
              {item.menu?.description}
            </p>
            <p className="text-black text-sm mt-1">
              NPR. {item.menu.price?.toFixed(2)} /-
            </p>
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleDecrease}
            disabled={item.quantity <= 1 || loading}
            className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FaMinus className="w-3 h-3" />
          </button>
          <span className="w-10 text-center text-sm font-medium">
            {item.quantity}
          </span>
          <button
            onClick={handleIncrease}
            disabled={loading}
            className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FaPlus className="w-3 h-3" />
          </button>
        </div>

        {/* Subtotal */}
        <div className="font-semibold text-sm">NPR. {total.toFixed(2)}</div>

        {/* Remove */}
        <div>
          <button
            onClick={handleRemove}
            disabled={loading}
            className="w-9 h-9 rounded border border-red-200 flex items-center justify-center hover:bg-red-50 text-red-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FaTrash className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}