
import { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import Loading from "./shared/Loading";
import PageNotFound from "../pages/PageNotFound";
const ProtectedRoute = ({ children }) => {
  const { user, loading, verifyUser } = useContext(AuthContext);

  useEffect(() => {
    verifyUser();
  }, []);

  if (loading) return <Loading/>;
  
  if (!user.role == "admin") {
    return <PageNotFound/> ;
  }

  // if(!user.role == "admin"){
  //   return <PageNotFound/>
  // }

  return children;
};

export default ProtectedRoute;





