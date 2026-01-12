
import { NavLink } from "react-router-dom"
import { IoSearch } from "react-icons/io5";
import { FaCartShopping } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
const Navbar = () => {
  return (
    <div className="flex items-center pl-5 bg-gray-300">
      <div>
        <h1 className="text-2xl font-bold">Chito Mitho</h1>
      </div>

      <div className="flex  items-center ml-15 gap-6 font-bold">
        <NavLink to={"/"} >Home</NavLink>
        <NavLink to={"/restaurant"}>Restaurant</NavLink>
      </div>

      <div className="flex  items-center ml-70  ">
        <input  type="text" placeholder="Search here..." className="w-70 pl-1.5 border-0 outline-0 bg-white"/>
        <button ><IoSearch/></button>
      </div>

      <div className="flex  items-center h-12 ml-100">
        <label htmlFor="cartIcon"><FaCartShopping/></label>
        <p className="mb-5 text-red-600">0</p>
      </div>

      <div className="ml-10">
        
        <NavLink to={"/signup"}>
          <button className="flex items-center font-bold border "><FaUser/>sign in</button>
        </NavLink>
      </div>
    </div>
  )
}

export default Navbar
