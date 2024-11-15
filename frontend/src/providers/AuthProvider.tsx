import { ReactNode, useEffect, useState } from "react";
import AuthContext from "../contexts/authContext";

type User = {
  id: number;
  name: string;
  email: string;
};

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  const signIn = (userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("accessToken", authToken);
  };

  const signUp = (userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("accessToken", authToken);
  };

  const signOut = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
  };

  return (
    <AuthContext.Provider
      value={{ token, user, isAuthed: !!user, signUp, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
