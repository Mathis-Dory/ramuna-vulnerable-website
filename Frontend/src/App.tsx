import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import FrontPage from "./components/FrontPage/FrontPage.lazy";
import RegisterPageLazy from "./components/RegisterPage/RegisterPage.lazy";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContactPage from "./components/ContactPage/ContactPage.lazy";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </BrowserRouter>
    <div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FrontPage />} />
          <Route path="/register" element={<RegisterPageLazy />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
