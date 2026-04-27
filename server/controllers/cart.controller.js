

import Cart from "../models/cart.model.js";
import Menu from "../models/menu.model.js";

// ─────────────────────────────────────────────────────────────────────────────
// Add item to cart
// ─────────────────────────────────────────────────────────────────────────────
export const addToCart = async (req, res) => {
  try {
    // ✅ FIX: JWT sets req.user.userId — never destructure as { userId }
    const userId = req.user.userId;
    const { menuId, quantity = 1 } = req.body;

    if (!menuId) {
      return res.status(400).json({ message: "menuId is required" });
    }

    const menuItem = await Menu.findById(menuId);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    const restaurantId = menuItem.restaurant_id;
    if (!restaurantId) {
      return res.status(400).json({ message: "Menu item is not linked to any restaurant" });
    }

    let cart = await Cart.findOne({ user: userId, restaurantId });

    if (!cart) {
      cart = new Cart({ user: userId, restaurantId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.menu.toString() === menuId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.subTotal = existingItem.quantity * menuItem.price;
    } else {
      cart.items.push({
        menu:     menuId,
        quantity,
        subTotal: menuItem.price * quantity,
      });
    }

    await cart.save(); // pre-save hook recalculates cart.Total

    const populatedCart = await Cart.findById(cart._id)
      .populate("items.menu", "name price menuImage")
      .populate("restaurantId", "restaurantName restaurantImage");

    res.json({ success: true, message: "Added to cart!", cart: populatedCart });
  } catch (error) {
    console.error("ADD_TO_CART_ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Get all carts for user (one per restaurant)
// ─────────────────────────────────────────────────────────────────────────────
export const getCart = async (req, res) => {
  try {
    // ✅ FIX: req.user.userId
    const userId = req.user.userId;

    const carts = await Cart.find({ user: userId })
      .populate({ path: "items.menu", select: "name price menuImage restaurant_id" })
      .populate("restaurantId", "restaurantName restaurantImage deliveryFee")
      .sort({ updatedAt: -1 });

    const activeCarts = carts.filter((cart) => cart.items?.length > 0);

    if (activeCarts.length === 0) {
      return res.status(200).json({
        user:   userId,
        carts:  [],
        items:  [],
        count:  0,
        Total:  0,
      });
    }

    res.status(200).json({
      user:        userId,
      carts:       activeCarts,
      items:       activeCarts.flatMap((c) => c.items),
      count:       activeCarts.length,
      totalItems:  activeCarts.reduce((acc, c) => acc + c.items.length, 0),
      // ✅ FIX: capital T — matches cart.model.js pre-save hook
      totalAmount: activeCarts.reduce((acc, c) => acc + (c.Total || 0), 0),
    });
  } catch (error) {
    console.error("GET_CART_ERROR:", error);
    res.status(500).json({ message: "Error fetching carts", error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Remove item from cart
// ─────────────────────────────────────────────────────────────────────────────
export const removeFromCart = async (req, res) => {
  try {
    // ✅ FIX: was destructuring { userId } which is always undefined
    const userId = req.user.userId;
    const { menuId, restaurantId } = req.body;

    if (!menuId || !restaurantId) {
      return res.status(400).json({ message: "menuId and restaurantId are required" });
    }

    const cart = await Cart.findOne({ user: userId, restaurantId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => (item.menu._id ?? item.menu).toString() !== menuId
    );

    if (cart.items.length === 0) {
      await Cart.findByIdAndDelete(cart._id);
      return res.status(200).json({ success: true, cart: null, deleted: true });
    }

    await cart.save(); // pre-save hook recalculates Total
    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("REMOVE_FROM_CART_ERROR:", error);
    res.status(500).json({ message: "Error removing item", error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Update item quantity
// ─────────────────────────────────────────────────────────────────────────────
export const updateCart = async (req, res) => {
  try {
    // ✅ FIX: was destructuring { userId } which is always undefined
    const userId = req.user.userId;
    const { menuId, quantity, restaurantId } = req.body;

    if (!menuId || !quantity || !restaurantId) {
      return res.status(400).json({ message: "menuId, quantity, and restaurantId are required" });
    }
    if (quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const cart = await Cart.findOne({ user: userId, restaurantId }).populate("items.menu");
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((i) => i.menu._id.toString() === menuId);
    if (!item) return res.status(404).json({ message: "Item not found in cart" });

    item.quantity = quantity;
    item.subTotal = item.menu.price * quantity;

    await cart.save(); // pre-save hook recalculates Total
    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("UPDATE_CART_ERROR:", error);
    res.status(500).json({ message: "Error updating cart", error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Get cart item count (for navbar badge)
// ─────────────────────────────────────────────────────────────────────────────
export const getCartCount = async (req, res) => {
  try {
    const userId = req.user.userId;

    const carts = await Cart.find({ user: userId });
    const count = carts.reduce((acc, cart) => acc + (cart.items?.length || 0), 0);

    res.json({ success: true, count });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart count" });
  }
};