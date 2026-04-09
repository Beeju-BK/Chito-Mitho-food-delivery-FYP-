// import mongoose from "mongoose";

// const OrderSchema = new mongoose.Schema(
//   {
//     cart: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Cart",
//       required: true,
//     },
//     status: {
//   type: String,
//   enum: [
//     "pending",        
//     "confirmed",      
//     "preparing",      
//     "ready",          
//     "out_for_delivery", 
//     "delivered", 
//     "cancelled"      
//   ],
//   default: "pending",
// },
//     shippingAddress: {
//         address:{
//             type: String,
//             required
//         }
//     },
//     paymentInfo: {
//       method: { type: String, enum: ["esawa","khalti"] },
//       transactionId: { type: String },
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Order", OrderSchema);


// import mongoose from "mongoose";

// const OrderSchema = new mongoose.Schema(
//   {
//     cart: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Cart",
//       required: true,
//     },

//     // ✅ add user
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     // ✅ add restaurant
//     restaurant: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Restaurant",
//     //   required: true,
//     },

//     status: {
//       type: String,
//       enum: [
//         "pending",
//         "confirmed",
//         "preparing",
//         "ready",
//         "out_for_delivery",
//         "delivered",
//         "cancelled",
//       ],
//       default: "pending",
//     },

//     shippingAddress: {
//       address: {
//         type: String,
//         required: true, // ✅ fixed
//       },
//     },

//     paymentInfo: {
//       method: {
//         type: String,
//         enum: ["esewa", "khalti"], 
//         required: true,
//       },
//       transactionId: {
//         type: String,
//       },
//     },



//   },
//   { timestamps: true }
// );

// export default mongoose.model("Order", OrderSchema);




// import mongoose from "mongoose";

// const OrderSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     restaurant: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Restaurant",
//       required: true,
//     },

//     // ✅ SIMPLIFIED: Just menu reference + order-specific data
//     items: [
//       {
//         menu: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Menu",
//           required: true,
//         },
//         quantity: {
//           type: Number,
//           required: true,
//           min: 1
//         },
//         price: {
//           type: Number,
//           required: true
//         }, // ✅ SNAPSHOT of price at order time
//         total: {
//           type: Number,
//           required: true
//         }, // ✅ price * quantity
//         notes: String, // ✅ Customer special instructions
//       },
//     ],

//     subtotal: { type: Number, required: true },
//     tax: { type: Number, default: 0 },
//     deliveryFee: { type: Number, default: 0 },
//     totalAmount: { type: Number, required: true },

//     status: {
//       type: String,
//       enum: ["payment_pending", "pending", "confirmed", "preparing", "ready", "out_for_delivery", "delivered", "cancelled"],
//       default: "pending",
//     },

//     shippingAddress: {
//       address: { type: String, required: true },

//     },

//     paymentInfo: {
//       method: { type: String, enum: ["esewa", "khalti", "cash"], required: true },
//       transactionId: String,
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Order", OrderSchema);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


import mongoose from "mongoose";


const OrderSchema = new mongoose.Schema(
{
user: {
type: mongoose.Schema.Types.ObjectId,
ref: "User",
required: true,
},


restaurant: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Restaurant",
  required: true,
},

// ✅ SIMPLIFIED: Just menu reference + order-specific data
items: [
  {
    menu: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Menu",
      required: true,
    },
    quantity: { 
      type: Number, 
      required: true, 
      min: 1 
    },
    price: { 
      type: Number, 
      required: true 
    }, // ✅ SNAPSHOT of price at order time
    total: { 
      type: Number, 
      required: true 
    }, // ✅ price * quantity
    notes: String, // ✅ Customer special instructions
  },
],

subtotal: { type: Number, required: true },
tax: { type: Number, default: 0 },
deliveryFee: { type: Number, default: 0 },
totalAmount: { type: Number, required: true },

status: {
  type: String,
  enum: ["pending", "confirmed", "preparing", "ready", "out_for_delivery", "delivered", "cancelled"],
  default: "pending",
},

shippingAddress: {
  address: { type: String, required: true },
  
},

paymentInfo: {
  method: { type: String, enum: ["esewa", "khalti", "cash"], required: true },
  transactionId: String,
},

},
{ timestamps: true }
);


export default mongoose.model("Order", OrderSchema);
