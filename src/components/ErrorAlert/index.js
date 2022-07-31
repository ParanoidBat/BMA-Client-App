import React from "react";
import { Alert } from "@mui/material";

export default function ErrorAlert({ error, setError }) {
  return (
    <Alert severity="error" onClose={() => setError(null)}>
      {error}
    </Alert>
  );
}
