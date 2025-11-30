import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./assets/scss/main.scss";
import Login from "./components/pages/Login";
import Chatroom from "./components/pages/Chatroom";
import { Link, Routes, Route, Navigate } from "react-router-dom";
import FindId from "./components/pages/FindId";
import FindPassword from "./components/pages/FindPassword";
import SignUp from "./components/pages/SignUp";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      <Routes>
        {/* PrivateRoute */}
        <Route
          path="/"
          element={isLoggedIn ? <Chatroom /> : <Navigate to="/login" replace />}
        />
        {/* Login 페이지 */}
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route path="/find-id" element={<FindId />} />
        <Route path="/find-password" element={<FindPassword />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/chatroom" element={<Chatroom />} />
      </Routes>
    </>
  );
}

export default App;
