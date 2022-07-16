import React from "react";
import { Route, Routes } from "react-router-dom";
import TCP from "TCP";
import TodaysReport from "containers/TodaysReport";
import Login from "containers/Login";

export default function AppRoutes() {
  return (
    <Routes>
      <Route exact path="/" element={<TodaysReport />} />
      <Route path="/login" element={<Login />} />
      <Route path="/tcp" element={<TCP />} />
    </Routes>
  );
}
