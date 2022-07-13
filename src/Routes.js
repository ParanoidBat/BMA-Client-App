import React from "react";
import { Route, Routes } from "react-router-dom";
import Contact from "Contact";
import TCP from "TCP";
import TodaysReport from "containers/TodaysReport";

export default function AppRoutes() {
  return (
    <Routes>
      <Route exact path="/" element={<TodaysReport />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/tcp" element={<TCP />} />
    </Routes>
  );
}
