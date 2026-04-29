import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Customize from "./pages/Customize";
import Customize2 from "./pages/Customize2";
import Home from "./pages/Home";
import { UserDataContext } from "./context/UserContext";

const App = () => {
  const { userData, loading } = useContext(UserDataContext);

  if (loading) {
    return (
      <div className="w-full h-screen bg-black flex justify-center items-center">
        <div className="w-[45px] h-[45px] border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          userData ? (
            userData.assistantName && userData.assistantImage ? (
              <Navigate to="/home" />
            ) : (
              <Navigate to="/customize" />
            )
          ) : (
            <Navigate to="/signin" />
          )
        }
      />

      <Route
        path="/signin"
        element={!userData ? <Signin /> : <Navigate to="/" />}
      />

      <Route
        path="/signup"
        element={!userData ? <Signup /> : <Navigate to="/" />}
      />

      <Route
        path="/customize"
        element={userData ? <Customize /> : <Navigate to="/signin" />}
      />

      <Route
        path="/customize2"
        element={userData ? <Customize2 /> : <Navigate to="/signin" />}
      />

      <Route
        path="/home"
        element={userData ? <Home /> : <Navigate to="/signin" />}
      />
    </Routes>
  );
};

export default App;