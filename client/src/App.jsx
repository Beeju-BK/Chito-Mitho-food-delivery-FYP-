import {Routes,Route} from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/Home.jsx"

const App = () => {
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path="/" element={<HomePage/>} />
      </Routes>
      
    </div>
  )
}

export default App
