import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import {
  ChevronLeftOutlined,
  ArticleOutlined,
  FeedOutlined,
  GroupOutlined,
  SettingsOutlined,
  PhonelinkSetup,
  LogoutOutlined,
  SickOutlined,
  AccountCircleOutlined,
  PermIdentityOutlined,
} from "@mui/icons-material";
import { AuthContext } from "contexts/authContext";
import styles from "./styles";

export default function SideDrawer({ open, handleClose, setFirstPage }) {
  const { authObject, setAuthObject } = useContext(AuthContext);

  const logout = () => {
    setAuthObject(null);
    setFirstPage("Login");
  };

  const reportLinks = [
    {
      text: "Today's Report",
      icon: <ArticleOutlined />,
      path: "/",
    },
    {
      text: "Reports",
      icon: <FeedOutlined />,
      path: "/reports",
    },
  ];

  const userLinks = [
    {
      text: "Users List",
      icon: <GroupOutlined />,
      path: "/users",
    },
    {
      text: "Leaves Request",
      icon: <SickOutlined />,
      path: "/leaves",
    },
  ];

  const miscellaneousLinks = [
    {
      text: "Settings",
      icon: <SettingsOutlined />,
      path: "/settings",
    },
    {
      text: "Setup",
      icon: <PhonelinkSetup />,
      path: "/setup",
    },
  ];

  return (
    <Drawer open={open} onClose={() => handleClose()}>
      <ChevronLeftOutlined
        sx={styles.ChevronIcon}
        onClick={() => handleClose()}
      />
      <Grid container direction={"column"} alignItems="center">
        <Grid item>
          <AccountCircleOutlined fontSize="large" />
        </Grid>
        <Grid item>
          <Typography sx={styles.userName}>{authObject.user.name}</Typography>
        </Grid>
      </Grid>
      <Divider />
      <List onClick={() => handleClose()}>
        {reportLinks.map((report, index) => {
          if (authObject.user.role === "Worker" && report.text === "Reports") {
            return <></>;
          }
          return (
            <ListItem key={`report-${index}`}>
              <ListItemButton>
                <NavLink to={report.path} style={styles.Link}>
                  <span style={styles.Icon}>{report.icon}</span>
                  {report.text}
                </NavLink>
              </ListItemButton>
            </ListItem>
          );
        })}
        <Divider />
        {userLinks.map((user, index) => {
          if (authObject.user.role === "Worker" && user.text === "Users List") {
            return <></>;
          }
          return (
            <ListItem key={`user-${index}`}>
              <ListItemButton>
                <NavLink to={user.path} style={styles.Link}>
                  <span style={styles.Icon}>{user.icon}</span>
                  {user.text}
                </NavLink>
              </ListItemButton>
            </ListItem>
          );
        })}
        {authObject.user.role !== "Admin" && (
          <ListItem>
            <ListItemButton>
              <NavLink
                to={`/users/${authObject.user._id}/${authObject.user.organization_id}/details`}
                style={styles.Link}
              >
                <span style={styles.Icon}>
                  <PermIdentityOutlined />
                </span>
                My Details
              </NavLink>
            </ListItemButton>
          </ListItem>
        )}
        <Divider />
        {authObject.user.role === "Admin" &&
          miscellaneousLinks.map((misc, index) => (
            <ListItem key={`misc-${index}`}>
              <ListItemButton>
                <NavLink to={misc.path} style={styles.Link}>
                  <span style={styles.Icon}>{misc.icon}</span>
                  {misc.text}
                </NavLink>
              </ListItemButton>
            </ListItem>
          ))}
        <Divider />
        <ListItem>
          <ListItemButton onClick={logout}>
            <span style={styles.Link}>
              <span style={styles.Icon}>
                <LogoutOutlined />
              </span>
              Logout
            </span>
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
}
