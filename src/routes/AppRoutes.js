import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import Setup from "containers/Setup";
import TodaysReport from "containers/TodaysReport";
import Reports from "containers/Reports";
import Users from "containers/Users";
import UserDetails from "containers/UserDetails";
import UserReport from "containers/UserReport";
import Settings from "containers/Settings";
import Leaves from "containers/Leaves";
import NotFound from "containers/NotFound";
import MyDetails from "containers/MyDetails";
import { AuthContext } from "contexts/authContext";

export default function AppRoutes() {
  const { authObject } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={<TodaysReport />} />
      <Route path="/users/:id/:orgID/details" element={<MyDetails />} />
      <Route path="/users/:id/report" element={<UserReport />} />
      <Route path="/leaves" element={<Leaves />} />
      {authObject.user.user_role !== "Worker" && (
        <>
          <Route path="/users/:id" element={<UserDetails />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/users" element={<Users />} />
          {authObject.user.user_role === "Admin" && (
            <>
              <Route path="/setup" element={<Setup />} />
              <Route path="/settings" element={<Settings />} />
            </>
          )}
        </>
      )}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
