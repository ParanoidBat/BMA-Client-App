import React, { useState } from "react";
import {
  Grid,
  TextField,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import ErrorAlert from "components/ErrorAlert";
import styles from "./styles";

export default function OrgSignup({ setOrganizationData }) {
  const [data, setData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleNext = () => {
    setError(null);
    if (!data.name || !data.address || !data.phone) {
      setError("Fill in the required fields.");
      return;
    }

    setLoading(true);

    setOrganizationData({
      orgName: data.name,
      orgAddress: data.address,
      orgPhone: data.phone,
      orgEmail: data.email,
    });
  };

  return (
    <Grid container direction={"column"} sx={styles.container}>
      <Typography variant="h5" textAlign={"center"} gutterBottom>
        Organization Information
      </Typography>
      <Grid item xs>
        <TextField
          fullWidth
          label="Organization Name"
          variant="outlined"
          type={"text"}
          name="name"
          value={data?.name}
          required
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs>
        <TextField
          fullWidth
          label="Organization Address"
          variant="outlined"
          type={"text"}
          name="address"
          value={data?.address}
          required
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs>
        <TextField
          fullWidth
          label="Organization Phone"
          variant="outlined"
          type={"tel"}
          name="phone"
          value={data?.phone}
          required
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs>
        <TextField
          fullWidth
          label="Organization Email"
          variant="outlined"
          type={"email"}
          name="email"
          value={data?.email}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item>
        {loading ? (
          <CircularProgress color="info" size={30} />
        ) : (
          <Button variant="contained" color="info" onClick={handleNext}>
            Next
          </Button>
        )}
      </Grid>
      {error && <ErrorAlert error={error} setError={setError} />}
    </Grid>
  );
}
