import React from "react";
import { CircularProgress } from "@mui/material";

import styles from "./styles";

export default function Progress({ color }) {
  return <CircularProgress color={color} sx={styles.position} />;
}
