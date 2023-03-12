import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import FrontPage from "./components/FrontPage/FrontPage.lazy";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FrontPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
