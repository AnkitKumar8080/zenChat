import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";
import { SocketProvider } from "./context/SocketContext";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import DesktopOnly from "./components/DesktopOnly";
import WebRtcContextProvider from "./context/WebRtcContext";

function App() {
  const { token, user } = useAuth();

  // const isDesktop = window.innerWidth > 768;
  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            token && user?._id ? (
              <Navigate to="/chat" />
            ) : (
              <Navigate to="/login" />
            )
          }
        ></Route>

        <Route
          exact
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          exact
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <SocketProvider>
                <ChatProvider>
                  <WebRtcContextProvider>
                    <Chat />
                  </WebRtcContextProvider>
                </ChatProvider>
              </SocketProvider>
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
