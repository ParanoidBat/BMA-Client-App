import React from "react";
import { Modal, Grid, Typography } from "@mui/material";

import styles from "./styles";

export default function InputModal({ children, onClose, header }) {
  return (
    <Modal
      open
      onClose={() => onClose()}
      sx={{ border: "none", outline: "none" }}
    >
      <Grid container sx={styles.main}>
        <Grid item xs={12}>
          <Typography variant="h5" textAlign={"center"}>
            {header}
          </Typography>
        </Grid>
        {children}
      </Grid>
    </Modal>
  );
}
