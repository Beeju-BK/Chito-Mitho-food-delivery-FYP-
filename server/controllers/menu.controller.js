import Menu from "../models/menu.model.js";
import Restaurant from "../models/restaurant.model.js";



// add or create
export const addMenu = async (req, res) => {
  try {
    const { name, description, price } = req.body;

    // validation
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: "Name and price are required",
      });
    }

    const parsedPrice = Number(price);
    if (isNaN(parsedPrice)) {
      return res.status(400).json({
        success: false,
        message: "Invalid price",
      });
    }

    // image
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const menuImage = req.file
      ? `${baseUrl}/uploads/${req.file.filename}`
      : null;

    // get restaurant from token
    const restaurant = await Restaurant.findById(req.user.restaurantId);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    const newMenuItem = new Menu({
      restaurant_id: restaurant._id,
      name,
      description,
      price: parsedPrice,
      menuImage,
    });

    await newMenuItem.save();

    return res.status(201).json({
      success: true,
      message: "Menu item added successfully",
      data: newMenuItem,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to add menu item",
      error: error.message,
    });
  }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// update or put
export const updateMenu = async (req, res) => {
  try {
    const { id } = req.params; // menu id
    const { name, description, price } = req.body;

    // validate price if provided
    let parsedPrice;
    if (price !== undefined) {
      parsedPrice = Number(price);
      if (isNaN(parsedPrice)) {
        return res.status(400).json({
          success: false,
          message: "Invalid price",
        });
      }
    }

    // find menu and check ownership 
    const menu = await Menu.findOne({
      _id: id,
      restaurant_id: req.user.restaurantId,
    });

    if (!menu) {
      return res.status(404).json({
        success: false,
        message: "Menu not found or not authorized",
      });
    }

    // image update (optional)
    if (req.file) {
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      menu.menuImage = `${baseUrl}/uploads/${req.file.filename}`;
    }

    // update fields (only if provided)
    if (name) menu.name = name;
    if (description) menu.description = description;
    if (price !== undefined) menu.price = parsedPrice;

    await menu.save();

    return res.status(200).json({
      success: true,
      message: "Menu updated successfully",
      data: menu,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update menu",
      error: error.message,
    });
  }
};


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// delete
export const deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;

    // find menu and check ownership 
    const menu = await Menu.findOne({
      _id: id,
      restaurant_id: req.user.restaurantId,
    });

    if (!menu) {
      return res.status(404).json({
        success: false,
        message: "Menu not found or not authorized",
      });
    }

    await Menu.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Menu deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete menu",
      error: error.message,
    });
  }
};


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const countMenuItem = async (req, res) => {
  try {
    const totalMenuItems = await Menu.countDocuments();
    return res.json({ totalMenuItems })
  } catch (error) {
    res.json({ message: "failed to get total menu item" })
    console.log(error)
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// shows menu to who own the menu
export const getMenu = async (req, res) => {
  try {
    // check auth
    if (!req.user || !req.user.restaurantId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const menuItems = await Menu.find({
      restaurant_id: req.user.restaurantId,
    }).sort({ createdAt: -1 }); // latest first (optional)

    return res.status(200).json({
      success: true,
      count: menuItems.length,
      data: menuItems,
    });
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get menu items",
    });
  }
};


export const getPublicMenu = async (req, res) => {
  try {
    console.log('🔍 Fetching public menus...');
    
    // ✅ 1. Get ONLY ACTIVE restaurants
    const activeRestaurants = await Restaurant.find({ 
      isBlocked: false 
    }).select('_id');

    if (activeRestaurants.length === 0) {
      return res.status(404).json({ 
        message: "No active restaurants available" 
      });
    }

    const activeRestaurantIds = activeRestaurants.map(r => r._id);
    console.log(`✅ ${activeRestaurants.length} active restaurants`);

    // ✅ 2. Get menus from active restaurants ONLY
    const allMenuItem = await Menu.find({ 
      restaurant_id: { $in: activeRestaurantIds }  // ✅ Your field name
    })
    .populate('restaurant_id', 'restaurantName isBlocked')  // ✅ Verify
    .sort({ createdAt: -1 });

    // ✅ 3. Final filter (double-check)
    const validMenus = allMenuItem.filter(menu => 
      menu.restaurant_id && !menu.restaurant_id.isBlocked
    );

    console.log(`✅ ${validMenus.length} valid menus from ${activeRestaurantIds.length} restaurants`);

    if (!validMenus || validMenus.length === 0) {
      return res.status(404).json({ 
        message: "No menu items available" 
      });
    }

    res.status(200).json({
      success: true,
      count: validMenus.length,
      activeRestaurants: activeRestaurants.length,
      data: validMenus
    });
  } catch (error) {
    console.error("❌ Public menu error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get menu items"
    });
  }
};


// ✅ PUBLIC - Get menus by restaurant
export const getRestaurantMenus = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🔍 Looking for menus in restaurant:", id); // DEBUG
    
    const menus = await Menu.find({ restaurant_id: id })
      .select('name description menuImage price category');
    
    console.log("📋 Found menus:", menus.length); // DEBUG
    
    res.json({ 
      success: true, 
      menus,
      count: menus.length 
    });
  } catch (error) {
    console.error("❌ Menu error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch menus",
      error: error.message 
    });
  }
};