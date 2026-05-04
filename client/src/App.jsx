import "./App.css";

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
import Orders from "./pages/Orders.jsx"

// vendor 
import RestaurantAuth from "./components/restaurant/RestaurantAuth.jsx";
import RestaurantDashboard from "./pages/RestaurantDashboard.jsx";

//admin
import AdminDashboard from "./pages/AdminDashboard.jsx";

const App = () => {
  return (
    
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/restaurant" element={<Restaurant />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile-settings" element={<ProfileSettings/>}/>
          <Route path="/orders" element={<Orders/>}/>


          {/* <Route path="/orders"  element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
          <Route path="/profile" element={<ViewProfile />} /> 
            */}
          
        </Route>

        {/* Private routes */}
        <Route element={<PrivateLayout />}>
          <Route path="/register" element={<RestaurantAuth />} />

          <Route path="/restaurant/dashbaord" element={<ProtectedRoute>
            <RestaurantDashboard/>
          </ProtectedRoute>} />
        </Route>

        <Route path="/admin/dashboard" element={
          
            <AdminDashboard/>
          
        }>
        </Route>
        {/* Catch-all route for 404 */}
        <Route path="*" element={<PageNotFound/>} />
      </Routes>
    
  );
};

export default App;