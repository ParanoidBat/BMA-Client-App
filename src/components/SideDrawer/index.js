import React from "react";
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
} from "@mui/icons-material";
import styles from "./styles";

export default function SideDrawer({ open, handleClose, setAppBarTitle }) {
  const reportLinks = [
    {
      text: "Today's Report",
      icon: <ArticleOutlined />,
      path: "/today-report",
    },
    {
      text: "Reports",
      icon: <FeedOutlined />,
      path: "/contact",
    },
  ];

  const userLinks = [
    {
      text: "Users List",
      icon: <GroupOutlined />,
      path: "#",
    },
    {
      text: "New User",
      icon: <PersonAddAltOutlined />,
      path: "#",
    },
  ];

  const miscellaneousLinks = [
    {
      text: "Settings",
      icon: <SettingsOutlined />,
      path: "#",
    },
    {
      text: "Setup",
      icon: <PhonelinkSetup />,
      path: "/tcp",
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
            <ListItemButton onClick={() => setAppBarTitle(report.text)}>
              <NavLink to={report.path} style={styles.Link}>
                {report.icon} {report.text}
              </NavLink>
            </ListItemButton>
          </ListItem>
        ))}
        <Divider />
        {userLinks.map((user, index) => (
          <ListItem key={`user-${index}`}>
            <ListItemButton onClick={() => setAppBarTitle(user.text)}>
              <NavLink to={user.path} style={styles.Link}>
                {user.icon} {user.text}
              </NavLink>
            </ListItemButton>
          </ListItem>
        ))}
        <Divider />
        {miscellaneousLinks.map((misc, index) => (
          <ListItem key={`misc-${index}`}>
            <ListItemButton onClick={() => setAppBarTitle(misc.text)}>
              <NavLink to={misc.path} style={styles.Link}>
                {misc.icon} {misc.text}
              </NavLink>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
