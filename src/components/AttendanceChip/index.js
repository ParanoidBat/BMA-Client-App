import React from "react";
import { Chip } from "@mui/material";

import styles from "./styles";

export default function AttendanceChip({ percentage }) {
  return (
    <Chip
      label={`Attendance ${percentage ?? 0}%`}
      color={percentage >= 80 ? "success" : percentage >= 50 ? "info" : "error"}
      sx={styles.chip}
    />
  );
}
