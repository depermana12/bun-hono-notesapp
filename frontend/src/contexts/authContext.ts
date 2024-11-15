import { createContext } from "react";

type User = {
  id: number;
  name: string;
  email: string;
};

type AuthContextType = {
  token: string | null;
  user: User | null;
  isAuthed: boolean;
  signUp: (user: User, AccessToken: string) => void;
  signIn: (user: User, AccessToken: string) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export default AuthContext;
