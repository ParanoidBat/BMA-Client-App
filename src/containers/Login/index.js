import React, { useContext, useState } from "react";
import {
  Grid,
  Typography,
  Divider,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { AuthContext } from "contexts/authContext";
import { Storage } from "@capacitor/storage";
import ErrorAlert from "components/ErrorAlert";
import Variables from "variables";
import styles from "./styles";

export default function Login({ setFirstPage }) {
  const [credentials, setCredentials] = useState({});
  const [visible, setVisible] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputError, setInputError] = useState({
    email: false,
    password: false,
  });

  const { setAuthObject } = useContext(AuthContext);

  const handleInputChange = (e) => {
    if (inputError[e.target.name])
      setInputError((prev) => ({ ...prev, [e.target.name]: false }));

    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = () => {
    if (!credentials.email_phone) {
      setInputError((prev) => ({ ...prev, email: true }));
      return;
    } else if (!credentials.password) {
      setInputError((prev) => ({ ...prev, password: true }));
      return;
    }

    setLoginError(null);
    setLoading(true);

    const regex = /@/;
    let key = regex.test(credentials.email_phone) ? "email" : "phone";

    axios
      .post(`${Variables.API_URI}/login`, {
        [key]: credentials.email_phone,
        password: credentials.password,
      })
      .then(async (res) => {
        setLoading(false);

        if (res.data.error) {
          setLoginError(res.data.error);
          return;
        }

        const data = res.data.data;

        await Storage.set({
          key: "OrgID",
          value: data.orgID,
        });

        setAuthObject({
          token: data.token,
          id: data.id,
          orgID: data.orgID,
          role: data.role,
        });
      })
      .catch((err) => {
        setLoading(false);
        setLoginError("Error! Try Again.");
      });
  };

  return (
    <Grid container direction={"column"} sx={styles.container}>
      <Grid item xs={6}></Grid>
      <Grid container item xs={6} direction={"column"} sx={styles.contentGrid}>
        <TextField
          error={inputError.email}
          label="Email or Phone"
          variant="outlined"
          name="email_phone"
          value={credentials?.email_phone}
          required
          onChange={handleInputChange}
        />
        <TextField
          error={inputError.password}
          label="Password"
          variant="outlined"
          type={visible ? "text" : "password"}
          name="password"
          value={credentials?.password}
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
        <Grid item xs={2} alignSelf={"center"}>
          {loading ? (
            <CircularProgress color="success" size={30} />
          ) : (
            <Button variant="contained" color="success" onClick={handleLogin}>
              Login
            </Button>
          )}
        </Grid>
        <Grid container item alignItems={"center"}>
          <Grid item xs>
            <Divider />
          </Grid>
          <Grid item xs={3}>
            <Typography textAlign={"center"}>OR</Typography>
          </Grid>
          <Grid item xs>
            <Divider />
          </Grid>
        </Grid>
        <Grid item xs={2} alignSelf="center">
          <Button variant="text" onClick={() => setFirstPage("Signup")}>
            Sign Up
          </Button>
        </Grid>
      </Grid>
      {loginError && <ErrorAlert error={loginError} setError={setLoginError} />}
    </Grid>
  );
}
