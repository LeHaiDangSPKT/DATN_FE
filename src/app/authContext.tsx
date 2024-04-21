"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithRedirect,
  FacebookAuthProvider,
} from "firebase/auth";
import { auth } from "../../firebase.config";
import { APILoginSocial } from "@/services/Auth";

interface AuthContextProps {
  user: any; // Thay any bằng kiểu dữ liệu phù hợp với user
  googleSignIn: () => void;
  facebookSignIn: () => void;
  logOut: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any>(null);

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  };

  const facebookSignIn = () => {
    const provider = new FacebookAuthProvider();
    signInWithRedirect(auth, provider);
  };

  const logOut = async () => {
    await signOut(auth);
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log(currentUser);
      if (currentUser != null) {
        const data = await APILoginSocial({
          fullName: currentUser?.providerData[0].displayName || "",
          email: currentUser?.providerData[0].email || "",
          avatar: currentUser?.providerData[0].photoURL || "",
          password: currentUser?.uid || "",
        });
        if (data.status === 200 || data.status === 201) {
          if (!localStorage.getItem("user")) {
            localStorage.setItem("user", JSON.stringify(data.metadata.data));
            window.location.href = "/";
          }
        }
      } else {
        signOut(auth);
      }
    });
    return () => unsubscribe();
  }, []);
  return (
    <AuthContext.Provider
      value={{ user, googleSignIn, facebookSignIn, logOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};
