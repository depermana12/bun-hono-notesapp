import AuthContext from "../contexts/authContext";
import { useContext } from "react";

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must use inside AuthProvider");
  }
  return context;
};

export default useAuth;