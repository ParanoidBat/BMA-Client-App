import React from "react";
import { Alert } from "@mui/material";
import styles from "./styles";

export default function ErrorAlert({ error, setError }) {
  return (
    <Alert severity="error" sx={styles.position} onClose={() => setError(null)}>
      {error}
    </Alert>
  );
}
