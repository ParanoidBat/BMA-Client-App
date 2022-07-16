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

export default function App() {
  const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [appBarTitle, setAppBarTitle] = useState("Today's Report");
  const handleClose = () => setOpenDrawer(false);
  const { authObject } = useContext(AuthContext);

  return (
    <>
      <CssBaseline />
      <Router>
        {!authObject.token ? (
          <Login />
        ) : (
          <>
            <AppBar position="fixed">
              <Toolbar>
                <IconButton edge="start" onClick={() => setOpenDrawer(true)}>
                  <MenuIcon sx={{ color: "white" }} />
                </IconButton>
                <Typography component="div" variant="h6">
                  {appBarTitle}
                </Typography>
              </Toolbar>
            </AppBar>
            <Offset />
            <SideDrawer
              open={openDrawer}
              handleClose={handleClose}
              setAppBarTitle={setAppBarTitle}
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
