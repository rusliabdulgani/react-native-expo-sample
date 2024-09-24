import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  Children,
  ReactNode,
  SetStateAction,
  Dispatch,
} from "react";
import { getCurrentUser } from "@/lib/appwrite";
import { Models } from "react-native-appwrite";

type UserContext = {
  isLogin: boolean;
  setIsLogin: Dispatch<SetStateAction<boolean>>;
  user: Models.Document | null;
  setUser: Dispatch<SetStateAction<Models.Document | null>>;
  isLoading: boolean;
};

const GlobalContext = createContext<UserContext>({
  isLogin: false,
  setIsLogin: () => {},
  user: null,
  setUser: () => {},
  isLoading: false,
});

export const useGlobalContext = () => useContext(GlobalContext);

type Children = {
  children: React.ReactNode;
};

export const GlobalProvider = ({ children }: Children) => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [user, setUser] = useState<Models.Document | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    getCurrentUser()
      .then((response) => {
        if (response) {
          setIsLogin(true);
          setUser(response);
        } else {
          setIsLogin(false);
          setUser(null);
        }
      })
      .catch((error) => {
        console.log("error...", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);
  return (
    <GlobalContext.Provider
      value={{
        isLogin,
        setIsLogin,
        user,
        setUser,
        isLoading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
