import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import FrontPage from "./components/FrontPage/FrontPage.lazy";
import RegisterPageLazy from "./components/RegisterPage/RegisterPage.lazy";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/register" element={<RegisterPageLazy />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
