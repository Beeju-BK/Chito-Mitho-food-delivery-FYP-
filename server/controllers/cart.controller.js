import Cart from "../models/cart.model.js";
import Menu from "../models/menu.model.js";
import Restaurant from "../models/restaurant.model.js";

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { menuId, quantity = 1 } = req.body;
    const userId = req.user.userId;

    const menuItem = await Menu.findById(menuId);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu not found" });
    }

    const restaurantId = menuItem.restaurant_id;

    // ✅ SIMPLE & SAFE - No duplicate errors!
    let cart = await Cart.findOne({ user: userId, restaurantId });

    if (!cart) {
      cart = new Cart({ 
        user: userId, 
        restaurantId,
        items: [] 
      });
    }

    // Add/update item
    const existingItem = cart.items.find(item => 
      item.menu.toString() === menuId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.subTotal = existingItem.quantity * menuItem.price;
    } else {
      cart.items.push({
        menu: menuId,
        quantity,
        subTotal: menuItem.price * quantity
      });
    }

    await cart.save();

    const populatedCart = await Cart.findById(cart._id)
      .populate('items.menu', 'name price menuImage')
      .populate('restaurantId', 'name');

    res.json({
      success: true,
      message: "✅ Added to cart!",
      cart: populatedCart
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error.message });
  }
};



export const getCart = async (req, res) => {
  try {
    // 1. SECURE: Get userId from token
    const userId = req.user.userId;

    console.log("🛒 Fetching carts for user:", userId);

    // 2. ✅ Get ALL carts for this user (multi-restaurant support)
    const carts = await Cart.find({ user: userId })
      .populate({
        path: 'items.menu',
        select: 'name price menuImage restaurant_id'
      })
      .populate('restaurantId', 'name')
      .sort({ updatedAt: -1 }); // Most recent first

    // 3. Filter out empty carts
    const activeCarts = carts.filter(cart => cart.items && cart.items.length > 0);

    // 4. BACKWARD COMPATIBLE:
    if (activeCarts.length === 0) {
      return res.status(200).json({
        user: userId,
        carts: [],
        items: [],
        count: 0,
        Total: 0
      });
    }

    // Single cart? Return old format
    if (activeCarts.length === 1) {
      const cart = activeCarts[0];
      return res.status(200).json({
        ...cart.toObject(),
        count: 1,
        carts: [cart]
      });
    }

    // Multiple carts - new format
    res.status(200).json({
      user: userId,
      carts: activeCarts,        // Array of all carts
      items: activeCarts.flatMap(c => c.items), // All items flattened
      count: activeCarts.length,
      totalItems: activeCarts.reduce((acc, cart) => acc + cart.items.length, 0),
      totalAmount: activeCarts.reduce((acc, cart) => acc + cart.Total, 0)
    });

  } catch (error) {
    console.error("GET_CART_ERROR:", error);
    res.status(500).json({ 
      message: "Error fetching carts", 
      error: error.message 
    });
  }
};





// // Remove item
// export const removeFromCart = async (req, res) => {
//   try {
//     const { userId, menuId } = req.body;
//     const cart = await Cart.findOne({ user: userId });
//     if (!cart) return res.status(404).json({ message: "Cart not found" });

//     cart.items = cart.items.filter(
//       (item) => item.menu.toString() !== menuId
//     );

//     cart.Total = cart.items.reduce((acc, item) => acc + item.subTotal, 0);

//     await cart.save();
//     res.status(200).json(cart);
//   } catch (error) {
//     res.status(500).json({ message: "Error removing item", error });
//   }
// };


// // Update item quantity
// export const updateCart = async (req, res) => {
//   try {
//     const { userId } = req.user; // assuming user is authenticated via session/cookie
//     const { menuId, quantity } = req.body;

//     if (!menuId || !quantity) {
//       return res.status(400).json({ message: "menuId and quantity required" });
//     }

//     const cart = await Cart.findOne({ user: userId }).populate("items.menu");
//     if (!cart) return res.status(404).json({ message: "Cart not found" });

//     const item = cart.items.find((i) => i.menu._id.toString() === menuId);
//     if (!item) return res.status(404).json({ message: "Item not found in cart" });

//     item.quantity = quantity;
//     item.subTotal = item.menu.price * quantity;

//     cart.Total = cart.items.reduce((acc, i) => acc + i.subTotal, 0);

//     await cart.save();
//     res.status(200).json(cart);
//   } catch (error) {
//     res.status(500).json({ message: "Error updating cart", error });
//   }
// };
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const removeFromCart = async (req, res) => {
  try {
    const { userId } = req.user; // authenticated user
    const { menuId, restaurantId } = req.body; // restaurantId to find the right cart

    if (!restaurantId) {
      return res.status(400).json({ message: "restaurantId is required" });
    }

    // Find cart for this user and restaurant
    const cart = await Cart.findOne({ user: userId, restaurant: restaurantId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Remove item
    cart.items = cart.items.filter((item) => item.menu.toString() !== menuId);

    // Recalculate total
    cart.total = cart.items.reduce((acc, item) => acc + item.subTotal, 0);

    await cart.save();
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: "Error removing item", error: error.message });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { userId } = req.user; // authenticated user
    const { menuId, quantity, restaurantId } = req.body;

    if (!menuId || !quantity || !restaurantId) {
      return res.status(400).json({ message: "menuId, quantity, and restaurantId are required" });
    }

    // Find cart for this user + restaurant
    const cart = await Cart.findOne({ user: userId, restaurant: restaurantId }).populate("items.menu");
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((i) => i.menu._id.toString() === menuId);
    if (!item) return res.status(404).json({ message: "Item not found in cart" });

    // Update quantity & subtotal
    item.quantity = quantity;
    item.subTotal = item.menu.price * quantity;

    // Update cart total
    cart.total = cart.items.reduce((acc, i) => acc + i.subTotal, 0);

    await cart.save();
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: "Error updating cart", error: error.message });
  }
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// // Remove item - BODY only (no params)
// export const removeFromCart = async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     const { restaurantId, menuId } = req.body; // From BODY ✅

//     if (!restaurantId || !menuId) {
//       return res.status(400).json({ message: "restaurantId and menuId required in body" });
//     }

//     const cart = await Cart.findOne({ 
//       user: userId, 
//       restaurantId 
//     }).populate('items.menu');

//     if (!cart) {
//       return res.status(404).json({ message: "Cart not found" });
//     }

//     cart.items = cart.items.filter(item => item.menu._id.toString() !== menuId);

//     if (cart.items.length === 0) {
//       await Cart.findByIdAndDelete(cart._id);
//       return res.json({ success: true, message: "Cart cleared" });
//     }

//     cart.Total = cart.items.reduce((acc, item) => acc + (item.subTotal || 0), 0);
//     await cart.save();

//     res.json({ success: true, message: "Item removed", cart });

//   } catch (error) {
//     res.status(500).json({ message: "Error removing item" });
//   }
// };

// // Update quantity - BODY only (no params)
// export const updateCart = async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     const { restaurantId, menuId, quantity } = req.body;

//     if (!restaurantId || !menuId || quantity === undefined) {
//       return res.status(400).json({ message: "restaurantId, menuId, quantity required" });
//     }

//     const cart = await Cart.findOne({ user: userId, restaurantId }).populate('items.menu');
//     if (!cart) return res.status(404).json({ message: "Cart not found" });

//     const itemIndex = cart.items.findIndex(item => item.menu._id.toString() === menuId);
//     if (itemIndex === -1) return res.status(404).json({ message: "Item not found" });

//     cart.items[itemIndex].quantity = quantity;
//     cart.items[itemIndex].subTotal = cart.items[itemIndex].menu.price * quantity;
//     cart.Total = cart.items.reduce((acc, item) => acc + (item.subTotal || 0), 0);

//     await cart.save();
//     res.json({ success: true, message: "Updated", cart });

//   } catch (error) {
//     res.status(500).json({ message: "Error updating cart" });
//   }
// };