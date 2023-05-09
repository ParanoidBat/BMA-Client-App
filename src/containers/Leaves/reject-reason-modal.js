import { useState } from "react";
import { Button, Modal, Grid, Typography, TextField } from "@mui/material";
import apiClient from "apiClient";

import styles from "./styles";

export default function RejectReasonModal({ onClose, id, setRefresh }) {
  const [reason, setReason] = useState("");

  const handleReject = () => {
    apiClient
      .put(`/leave/${id}`, {
        status: "Rejected",
        reject_reason: reason,
      })
      .then((res) => {
        if (res.data.data) {
          setRefresh(true);
          onClose();
        }
      });
  };

  return (
    <Modal open onClose={onClose} style={{ border: "none", outline: "none" }}>
      <Grid container sx={styles.modalGrid}>
        <Typography variant="h5" gutterBottom>
          Reject Reason
        </Typography>
        <TextField
          onChange={(e) => setReason(e.target.value)}
          fullWidth
          style={{ marginBottom: 10 }}
        />
        <Button variant="contained" onClick={handleReject}>
          Reject
        </Button>
      </Grid>
    </Modal>
  );
}
