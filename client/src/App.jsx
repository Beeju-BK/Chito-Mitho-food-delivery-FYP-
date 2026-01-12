import {Routes,Route} from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/Home.jsx"
import SignUpPage from "./pages/SignUp.jsx";

const App = () => {
  

  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/signup" element={<SignUpPage/>}/>
      </Routes>
      
    </div>
  )
}

export default App
