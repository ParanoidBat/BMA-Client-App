import React, { useContext, useState } from "react";
import axios from "axios";
import Variables from "variables";
import Progress from "components/Progress";
import ErrorAlert from "components/ErrorAlert";
import { Grid, TextField, MenuItem, Button } from "@mui/material";
import { AuthContext } from "contexts/authContext";

export default function CreateUser() {
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);

  const { authObject } = useContext(AuthContext);

  const roles = [
    {
      value: "Admin",
      label: "Admin",
    },
    {
      value: "Worker",
      label: "Worker",
    },
    {
      value: "Manager",
      label: "Manager",
    },
  ];

  const handleSave = () => {
    if (!validateInput()) return;

    setLoading(true);
    axios
      .post(`${Variables.API_URI}/user/`, {
        ...userData,
        organizationID: authObject.orgID,
      })
      .then((res) => {
        if (res.data.error) setError(res.data.error);
        setUserData({});
      })
      .catch((error) => setError(error))
      .finally(setLoading(false));
  };

  const handleChange = (e) => {
    setUserData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateInput = () => {
    if (!userData.name || userData.name.startsWith(" ")) {
      setError("Invalid Name");
      return false;
    }
    if (!userData.authID || userData.authID < 0) {
      setError("Invalid Finger ID");
      return false;
    }
    if (userData.salary && userData.salary < 0) {
      setError("Invalid Salary");
      return false;
    }

    return true;
  };

  return (
    <Grid container>
      <Grid
        item
        sx={{
          "& *": {
            marginBottom: "3px",
          },
        }}
      >
        <TextField
          fullWidth
          name="name"
          required
          type={"text"}
          value={userData.name ?? ""}
          onChange={handleChange}
          label="name"
        />
        <TextField
          fullWidth
          name="authID"
          required
          type={"number"}
          value={userData.authID ?? ""}
          onChange={handleChange}
          label="finger ID"
        />
        <TextField
          fullWidth
          name="salary"
          type={"number"}
          value={userData.salary ?? ""}
          label="salary"
          onChange={handleChange}
          inputProps={{
            min: 0,
          }}
          InputProps={{
            startAdornment: <span style={{ marginRight: "5px" }}>Rs.</span>,
          }}
        />
        <TextField
          fullWidth
          name="phone"
          type={"tel"}
          value={userData.phone ?? ""}
          onChange={handleChange}
          label="phone"
        />
        <TextField
          fullWidth
          name="address"
          type={"text"}
          value={userData.address ?? ""}
          label="address"
          onChange={handleChange}
        />
        <TextField
          fullWidth
          select
          value={userData.role ?? ""}
          name="role"
          label="role"
          onChange={handleChange}
        >
          {roles.map((role) => (
            <MenuItem key={role.value} value={role.value}>
              {role.label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={4}>
        {loading ? (
          <Progress color={"success"} />
        ) : (
          <Button variant="contained" color="success" onClick={handleSave}>
            Save
          </Button>
        )}
      </Grid>
      {error && <ErrorAlert error={error} setError={setError} />}
    </Grid>
  );
}
