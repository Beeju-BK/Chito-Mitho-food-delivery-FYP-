import {Routes,Route} from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx"
import Menu from "./pages/Menu.jsx"
import Restaurant from "./pages/Restaurant.jsx";
import Cart from "./pages/Cart.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import CustomerAuth from "./components/auth/CustomerAuth.jsx";


const App = () => {
  

  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/Menu" element={<Menu/>} />
        <Route path="/restaurant" element={<Restaurant/>}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/orders" element={<MyOrders/>}/>
        <Route path="/customer-signup" element={<CustomerAuth/>}/>
      </Routes>
      <Footer/>
    </div>
  )
}

export default App
