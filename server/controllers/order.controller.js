


import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";


export const createOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { cartId, shippingAddress, paymentInfo } = req.body;


    // 1.  Verify & get cart
    const cart = await Cart.findOne({
      _id: cartId,
      user: userId
    }).populate('restaurantId items.menu');

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found or access denied"
      });
    }

    if (!cart.items?.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // 2. Calculate totals
    const subtotal = cart.Total || 0;
    const tax = subtotal * 0.13;
    const deliveryFee = cart.restaurantId?.deliveryFee || 100;
    const totalAmount = subtotal + tax + deliveryFee;

    // 3. Create items
    const orderItems = cart.items.map(item => ({
      menu: item.menu._id,
      quantity: item.quantity,
      price: item.menu.price,
      total: item.menu.price * item.quantity
    }));

    // 4Create order
    const order = new Order({
      user: userId,
      restaurant: cart.restaurantId._id,
      items: orderItems,
      subtotal: Math.round(subtotal),
      tax: Math.round(tax),
      deliveryFee: Math.round(deliveryFee),
      totalAmount: Math.round(totalAmount),
      status: "pending",
      shippingAddress: {
        address: shippingAddress.address,
        phone: req.user.phone || ''  // Add phone
      },
      paymentInfo: {
        method: paymentInfo.method,
        transactionId: paymentInfo.transactionId || null
      }
    });

    await order.save();

    // 5. Delete cart
    await Cart.findByIdAndDelete(cartId);

    // 6. FIXED: Convert ObjectId to string
    const populatedOrder = await Order.findById(order._id)
      .populate({
        path: 'items.menu',
        select: 'name description image price'
      })
      .populate('restaurant', 'name logo address deliveryFee')
      .populate('user', 'name phone');

    res.status(201).json({
      success: true,
      message: `✅ Order #${order._id.toString().slice(-6)} placed with ${cart.restaurantId.name}!`, // ✅ FIXED
      orderId: order._id.toString(),  // ✅ String
      order: populatedOrder
    });

  } catch (error) {
    console.error("CREATE_ORDER_ERROR:", error);
    res.status(500).json({
      message: "Failed to create order",
      error: error.message
    });
  }
};


// FIXED: Get orders (NO cart populate needed)
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.userId;


    const orders = await Order.find({ user: userId })
      .populate({
        path: 'items.menu',           // ✅ Populate menu details
        select: 'name description image price category'
      })
      .populate('restaurant', 'name logo address deliveryFee phone')  // ✅ Restaurant details
      .sort({ createdAt: -1 })
      .lean(); // ✅ Faster queries

    res.json({
      success: true,
      orders,
      count: orders.length
    });

  } catch (error) {
    console.error("GET_ORDERS_ERROR:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};


// ✅ One-time migration script
export const migrateOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('cart');


    for (let order of orders) {
      if (order.cart) {
        // Copy cart data to order
        order.restaurant = order.cart.restaurantId;
        order.items = order.cart.items.map(item => ({
          menu: item.menu,
          quantity: item.quantity,
          price: item.menu?.price || item.price,
          total: item.total
        }));
        order.subtotal = order.cart.Total;
        order.totalAmount = order.cart.Total;

        // Clear cart reference
        order.cart = "" ;

        await order.save();
        console.log(`Migrated order ${order._id}`);
      }
    }

    res.json({ message: "Migration complete!" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ✅ Restaurant Owner: Get MY restaurant orders
export const getRestaurantOrders = async (req, res) => {
  try {
    const restaurantId = req.user.restaurantId; // From auth middleware


    const orders = await Order.find({
      restaurant: restaurantId
    })
      .populate({
        path: 'items.menu',
        select: 'name description image price'
      })
      .populate('user', 'name phone email')
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      orders,
      count: orders.length,
      pending: orders.filter(o => o.status === 'pending').length
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Restaurant Owner: Get orders by status
export const getRestaurantOrdersByStatus = async (req, res) => {
  try {
    const restaurantId = req.user.restaurantId;
    const { status } = req.query; // ?status=preparing


    const filter = {
      restaurant: restaurantId
    };
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate('user', 'name phone')
      .populate('items.menu', 'name image')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, orders });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Admin: Get orders for ANY restaurant
export const getOrdersByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;


    const orders = await Order.find({ restaurant: restaurantId })
      .populate({
        path: 'items.menu',
        select: 'name price image'
      })
      .populate('user', 'name phone')
      .populate('restaurant', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, orders, count: orders.length });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Matches YOUR exact schema
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const restaurantId = req.user.restaurantId; // From auth middleware


    console.log('🔍 Update:', { orderId, status, restaurantId });

    // ✅ Query matches your schema
    const order = await Order.findOne({
      _id: orderId,
      restaurant: restaurantId  // ✅ Your schema field
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found or doesn't belong to your restaurant"
      });
    }

    console.log('✅ Current:', order.status, '→ New:', status);

    // ✅ Valid status transitions (matches your enum)
    const transitions = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['preparing', 'cancelled'],
      preparing: ['ready', 'cancelled'],
      ready: ['out_for_delivery', 'cancelled'],
      out_for_delivery: ['delivered', 'cancelled']
    };

    if (!transitions[order.status]?.includes(status)) {
      return res.status(400).json({
        message: `Invalid transition: ${order.status} → ${status}`
      });
    }

    // ✅ Update status
    order.status = status;
    await order.save();

    res.json({
      success: true,
      message: `Status updated to ${status}`,
      order: {
        _id: order._id,
        status: order.status,
        totalAmount: order.totalAmount,
        user: order.user,
        items: order.items,
        shippingAddress: order.shippingAddress
      }
    });

  } catch (error) {
    console.error('❌ UPDATE_ERROR:', error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};