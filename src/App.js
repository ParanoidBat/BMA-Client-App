import React, { useState, useContext } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import {
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import AppRoutes from "routes/AppRoutes";
import SideDrawer from "components/SideDrawer";
import { AuthContext } from "contexts/authContext";
import Login from "containers/Login";
import Signup from "containers/Signup";

export default function App() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [firstPage, setFirstPage] = useState("Login");

  const { authObject } = useContext(AuthContext);

  const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);
  const handleClose = () => setOpenDrawer(false);

  return (
    <>
      <CssBaseline />
      <Router>
        {!authObject ? (
          firstPage === "Login" ? (
            <Login setFirstPage={setFirstPage} />
          ) : (
            <Signup setFirstPage={setFirstPage} />
          )
        ) : (
          <>
            <AppBar position="fixed">
              <Toolbar>
                <IconButton edge="start" onClick={() => setOpenDrawer(true)}>
                  <MenuIcon sx={{ color: "white" }} />
                </IconButton>
                <Typography component="div" variant="h6">
                  BMA
                </Typography>
              </Toolbar>
            </AppBar>
            <Offset />
            <SideDrawer
              open={openDrawer}
              handleClose={handleClose}
              setFirstPage={setFirstPage}
            />
            <div style={{ padding: "10px" }}>
              <AppRoutes />
            </div>
          </>
        )}
      </Router>
    </>
  );
}
