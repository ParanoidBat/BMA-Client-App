import React, { useState } from "react";
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
import AppRoutes from "Routes";
import SideDrawer from "components/side_drawer";

export default function App() {
  const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);
  const [openDrawer, setOpenDrawer] = useState(false);
  const handleClose = () => setOpenDrawer(false);

  return (
    <>
      <CssBaseline />
      <Router>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton edge="start" onClick={() => setOpenDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Typography component="div" variant="h6">
              A Drawer
            </Typography>
          </Toolbar>
        </AppBar>
        <Offset />
        <SideDrawer open={openDrawer} handleClose={handleClose} />
        <AppRoutes />
      </Router>
    </>
  );
}
