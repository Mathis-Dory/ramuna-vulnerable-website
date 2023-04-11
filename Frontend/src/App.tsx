import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import FrontPageLazy from "./components/FrontPage/FrontPage.lazy";
import RegisterPageLazy from "./components/SignUpPage/SignUpPage.lazy";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContactPageLazy from "./components/ContactPage/ContactPage.lazy";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FrontPageLazy />} />
          <Route path="/contact" element={<ContactPageLazy />} />
          <Route path="/register" element={<RegisterPageLazy />} />
        </Routes>
      </BrowserRouter>
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
    </div>
  );
}

export default App;
