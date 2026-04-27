import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = async () => {
    if (!user) {
      setCartCount(0);
      return;
    }
    try {
      const { data } = await axios.get("http://localhost:3000/api/cart/get", {
        withCredentials: true,
      });
      const carts = data.carts || (data.items ? [data] : []);
      const total = carts.reduce(
        (sum, cart) => sum + (cart.items?.length || 0),
        0
      );
      setCartCount(total);
    } catch (error) {
      console.error("Failed to fetch cart count:", error);
      setCartCount(0);
    }
  };

  // Refetch when user changes (login/logout)
  useEffect(() => {
    fetchCartCount();
  }, [user]);

  return (
    <CartContext.Provider value={{ cartCount, fetchCartCount }}>
      {children}
    </CartContext.Provider>
  );
};