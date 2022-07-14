import React from "react";
import { Route, Routes } from "react-router-dom";
import TCP from "TCP";
import TodaysReport from "containers/TodaysReport";

export default function AppRoutes() {
  return (
    <Routes>
      <Route exact path="/" element={<TodaysReport />} />
      <Route path="/tcp" element={<TCP />} />
    </Routes>
  );
}
