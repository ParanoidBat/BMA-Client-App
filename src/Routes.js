import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "Home";
import Contact from "Contact";
import TCP from "TCP";

export default function AppRoutes() {
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/tcp" element={<TCP />} />
    </Routes>
  );
}
