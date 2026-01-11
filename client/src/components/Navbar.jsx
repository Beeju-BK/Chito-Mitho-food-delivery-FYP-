
import { NavLink } from "react-router-dom"
import { IoSearch } from "react-icons/io5";
import { FaCartShopping } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
const Navbar = () => {
  return (
    <div className="nav-container flex">
      <div className="nav-heading">
        <h1 className="text-2xl font-bold">Chito Mitho</h1>
      </div>

      <div className="nav-link  ">
        <NavLink to={"/"}>Home</NavLink>
        <NavLink to={"/restaurant"}>Restaurant</NavLink>
      </div>

      <div className="nav-search flex">
        <input type="text" placeholder="Search here..." />
        <label htmlFor="searchIcon"><IoSearch/></label>
      </div>

      <div className="nav-cart flex">
        <label htmlFor="cartIcon"><FaCartShopping/></label>
        <p>0</p>
      </div>

      <div className="">
        <button className="flex"><FaUser/>sign in</button>
      </div>
    </div>
  )
}

export default Navbar
