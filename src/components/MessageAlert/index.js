import { Alert } from "@mui/material";
import styles from "./styles";

export default function MessageAlert({ message, setMessage, type }) {
  return (
    <Alert
      severity={type}
      sx={styles.position}
      onClose={() => setMessage(undefined)}
    >
      {message}
    </Alert>
  );
}
