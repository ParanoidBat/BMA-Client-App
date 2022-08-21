import React, { useState } from "react";
import {
  Grid,
  Typography,
  TextField,
  CircularProgress,
  InputAdornment,
  IconButton,
  Button,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import ErrorAlert from "components/ErrorAlert";
import Variables from "variables";
import axios from "axios";

import styles from "./styles";

export default function UserSignup({ organizationID, setFirstPage }) {
  const [data, setData] = useState({});
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignup = () => {
    setError(null);
    if (!data.name || !data.email || !data.password) {
      setError("Fill in the required fields.");
      return;
    }

    setLoading(true);

    return axios
      .post(`${Variables.API_URI}/user`, {
        name: data.name,
        phone: data.phone,
        address: data.address,
        email: data.email,
        password: data.password,
        organizationID,
        role: "Admin",
        authID: 0,
      })
      .then((res) => {
        if (!res.data.data) {
          setError("Something went wrong.");
        } else setFirstPage("Login");
      })
      .catch((err) => setError(err));
  };

  return (
    <Grid container direction={"column"} sx={styles.container}>
      <Typography variant="h5" textAlign={"center"} gutterBottom>
        User Information
      </Typography>
      <Grid item xs>
        <TextField
          label="User Name"
          variant="outlined"
          type={"text"}
          name="name"
          fullWidth
          value={data?.name}
          required
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs>
        <TextField
          label="User Phone"
          variant="outlined"
          type={"tel"}
          name="phone"
          fullWidth
          value={data?.phone}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs>
        <TextField
          label="User Address"
          variant="outlined"
          type={"text"}
          name="address"
          fullWidth
          value={data?.address}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs>
        <TextField
          label="Email"
          variant="outlined"
          type={"email"}
          name="email"
          fullWidth
          value={data?.email}
          required
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs>
        <TextField
          label="Password"
          variant="outlined"
          type={visible ? "text" : "password"}
          name="password"
          fullWidth
          value={data?.password}
          required
          onChange={handleInputChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  onClick={() => {
                    setVisible(!visible);
                  }}
                >
                  {visible ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item>
        {loading ? (
          <CircularProgress color="success" size={30} />
        ) : (
          <Button variant="contained" color="success" onClick={handleSignup}>
            Sign Up
          </Button>
        )}
      </Grid>
      {error && <ErrorAlert error={error} setError={setError} />}
    </Grid>
  );
}
