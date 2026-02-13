import {Routes,Route} from "react-router-dom";
import PrivateLayout from "./layouts/PrivateLayout.jsx";
import PublicLayout from "./layouts/PublicLayout.jsx";
import Home from "./pages/Home.jsx"
import Menu from "./pages/Menu.jsx"
import Restaurant from "./pages/Restaurant.jsx";
import Cart from "./pages/Cart.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import UserSignin from "./components/auth/UserSignin.jsx";
import CustomerSignup from "./components/auth/CustomerSignup.jsx";
import RestaurantRegistration from "./components/auth/RestaurantRegistration.jsx"
import DeliveryPartnerRegistration from "./components/auth/DeliveryPartnerRegistration.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
const App = () => {
  

  return (
    <div>
      
      <Routes element={<PublicLayout/>}>
        <Route path="/" element={<Home/>} />
        <Route path="/Menu" element={<Menu/>} />
        <Route path="/restaurant" element={<Restaurant/>}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/orders" element={<MyOrders/>}/>
        <Route path="/signin" element={<UserSignin/>}/>
        <Route path="/signup" element={<CustomerSignup/>}/>
        <Route path="/restaurant-registration" element={<RestaurantRegistration/>}/>
        <Route path="/Delivery-partner-registration" element={<DeliveryPartnerRegistration/>}/>
        
      </Routes>

      <Routes element={<PrivateLayout/>}>
        <Route path="/admin" element={<AdminDashboard/>}/>
      </Routes>
    </div>
  )
}

export default App
