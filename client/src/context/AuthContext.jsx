import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isValidJSON, LocalStorage, requestHandler } from "../utils";
import { loginUser, logoutUser, registerUser } from "../api";

// creating a Auth context to manage authentication
const AuthContext = createContext({});

// create a hook to access the AuthContext
const useAuth = () => useContext(AuthContext);

// create a component that will handle authentication related functions
const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(
    isValidJSON(localStorage.getItem("user"))
      ? JSON.parse(localStorage.getItem("user"))
      : null
  );
  const [token, setToken] = useState(
    isValidJSON(localStorage.getItem("token"))
      ? JSON.parse(localStorage.getItem("token"))
      : null
  );
  const [authMessage, setAuthMessage] = useState(null);
  const [authError, setAuthError] = useState(null);

  const navigate = useNavigate();

  // handle user login
  const login = async (data) => {
    await requestHandler(
      () => loginUser(data),
      setIsLoading,
      (res) => {
        const { data } = res;
        setUser(data.user); // the data.data is an object which contains the user information
        setToken(data.tokens.accessToken);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", JSON.stringify(data.tokens.accessToken));
        navigate("/chat");
      },

      setAuthError
    );
  };

  // handle user registration
  const register = async (data) => {
    await requestHandler(
      () => registerUser(data),
      setIsLoading,
      () => {
        setAuthMessage("registration successfull");
        // alert("Account created successfully, login to use");
        navigate("/login");
      },
      setAuthError
    );
  };

  // handle user logout
  const logout = async () => {
    await requestHandler(
      () => logoutUser(),
      setIsLoading,
      () => {
        setUser(null);
        setToken(null);
        localStorage.clear();
        navigate("/login");
      },
      setAuthError
    );
  };

  // check for saved user and token in local storage
  // useEffect(() => {
  //   setIsLoading(true);
  //   const _token = JSON.parse(localStorage.getItem("token"));
  //   const _user = JSON.parse(localStorage.getItem("user"));
  //   if (_token && _user?._id) {
  //     setUser(_user);
  //     setToken(_token);
  //   }

  //   console.log(user, token);
  //   setIsLoading(false);
  // }, []);

  // Clear authError after 10 seconds
  useEffect(() => {
    if (authError) {
      const timer = setTimeout(() => {
        setAuthError(null);
      }, 2000); // 2 seconds

      return () => clearTimeout(timer);
    }
  }, [authError]);

  // provide the authentication related data function through context
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isLoading,
        authMessage,
        authError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, useAuth, AuthProvider };
