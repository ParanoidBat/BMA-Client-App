import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { Drawer, List, ListItem, ListItemButton, Divider } from "@mui/material";
import {
  ChevronLeftOutlined,
  ArticleOutlined,
  FeedOutlined,
  GroupOutlined,
  PersonAddAltOutlined,
  SettingsOutlined,
  PhonelinkSetup,
  LogoutOutlined,
  SickOutlined,
} from "@mui/icons-material";
import { AuthContext } from "contexts/authContext";
import styles from "./styles";

export default function SideDrawer({ open, handleClose, setFirstPage }) {
  const { setAuthObject } = useContext(AuthContext);

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
      text: "Leave Requests",
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
      <Divider />
      <List onClick={() => handleClose()}>
        {reportLinks.map((report, index) => (
          <ListItem key={`report-${index}`}>
            <ListItemButton>
              <NavLink to={report.path} style={styles.Link}>
                <span style={styles.Icon}>{report.icon}</span>
                {report.text}
              </NavLink>
            </ListItemButton>
          </ListItem>
        ))}
        <Divider />
        {userLinks.map((user, index) => (
          <ListItem key={`user-${index}`}>
            <ListItemButton>
              <NavLink to={user.path} style={styles.Link}>
                <span style={styles.Icon}>{user.icon}</span>
                {user.text}
              </NavLink>
            </ListItemButton>
          </ListItem>
        ))}
        <Divider />
        {miscellaneousLinks.map((misc, index) => (
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
