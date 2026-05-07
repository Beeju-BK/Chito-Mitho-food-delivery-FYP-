

import "./App.css";
import { Toaster } from 'react-hot-toast';
import { Routes, Route } from "react-router-dom";
import PrivateLayout from "./layouts/PrivateLayout.jsx";
import PublicLayout from "./layouts/PublicLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PageNotFound from "./pages/PageNotFound.jsx";
import Home from "./pages/Home.jsx";
import Menu from "./pages/Menu.jsx";
import Restaurant from "./pages/Restaurant.jsx";
import Cart from "./pages/Cart.jsx";
import ProfileSettings from "./components/customers/ProfileSettings.jsx";
import Orders from "./pages/Orders.jsx";
import VerifyPayment from "./pages/VerifyPayment.jsx";

// vendor 
import RestaurantAuth from "./components/restaurant/RestaurantAuth.jsx";
import RestaurantDashboard from "./pages/RestaurantDashboard.jsx";

// admin
import AdminDashboard from "./pages/AdminDashboard.jsx";

// deliveryman
import DeliverymanAuth from "./components/Deliveryman/DeliverymanAuth.jsx";
import DeliverymanDashboard from "./pages/DeliverymanDashboard.jsx";
import DeliverymanOrders from "./pages/DeliverymanOrders.jsx"
import DeliverymanProfile from "./pages/DeliverymanProfile.jsx"
const App = () => {
  return (
    <>
      {/* ✅ PERFECT - Toaster at top level */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#363636',
            fontWeight: 500,
          },
          success: {
            style: {
              background: '#10b981',
              color: '#fff',
            },
          },
          error: {
            style: {
              background: '#ef4444',
              color: '#fff',
            },
          },
        }}
      />

      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/restaurant" element={<Restaurant />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile-settings" element={<ProfileSettings />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/verify-payment" element={<VerifyPayment />} />
        </Route>

        {/* Private routes */}
        <Route element={<PrivateLayout />}>
          <Route path="/register" element={<RestaurantAuth />} />
          <Route path="deliveryman/register" element={<DeliverymanAuth />} />
          {/* ✅ FIXED: Typo "dashbaord" → "dashboard" */}
          <Route
            path="/restaurant/dashboard"
            element={
              <ProtectedRoute>
                <RestaurantDashboard />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* ✅ FIXED: Admin route structure */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="deliveryman/dashboard" element={<DeliverymanDashboard />} />

        <Route path="/deliveryman/orders" element={<DeliverymanOrders />} />
        <Route path="/deliveryman/profile" element={<DeliverymanProfile />} />
        {/* Catch-all route for 404 */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};

export default App;