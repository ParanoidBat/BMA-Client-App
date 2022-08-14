import React from "react";
import { Route, Routes } from "react-router-dom";
import Setup from "containers/Setup";
import TodaysReport from "containers/TodaysReport";
import Reports from "containers/Reports";
import Users from "containers/Users";
import UserDetails from "containers/UserDetails";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<TodaysReport />} />
      <Route path="/setup" element={<Setup />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/users" element={<Users />} />
    </Routes>
  );
}
