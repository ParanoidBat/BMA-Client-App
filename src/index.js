import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AuthContextProvider from "contexts/authContext";

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);

root.render(
  <AuthContextProvider>
    <App />
  </AuthContextProvider>
);
