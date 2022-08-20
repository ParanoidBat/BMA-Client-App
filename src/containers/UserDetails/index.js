import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Variables from "variables";
import Progress from "components/Progress";
import ErrorAlert from "components/ErrorAlert";
import { Grid, Typography, TextField, MenuItem, Button } from "@mui/material";

export default function UserDetails() {
  const [data, setData] = useState();
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`${Variables.API_URI}/user/${id}`)
      .then((res) => {
        setData(res.data.data);
        setError(res.data.error);
      })
      .catch((error) => setError(error));
  });

  const handleUpdate = () => {
    setLoading(true);
    axios
      .put(`${Variables.API_URI}/user/${id}`, {
        ...userData,
      })
      .then((res) => {
        if (res.date.error) setError(res.data.error);
        else setData(res.data.data);
      })
      .catch((error) => setError(error))
      .finally(setLoading(false));
  };

  const handleChange = (e) => {
    setUserData((prev) =>
      setUserData({
        ...prev,
        [e.target.name]: e.target.value,
      })
    );
  };

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

  return (
    data && (
      <Grid container>
        <Grid item xs={12}>
          <Typography gutterBottom textAlign={"center"} variant="h4">
            {data.name}
          </Typography>
        </Grid>
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
            name="salary"
            type={"number"}
            defaultValue={data.salary}
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
            defaultValue={data.phone}
            onChange={handleChange}
            label="phone"
          />
          <TextField
            fullWidth
            name="address"
            type={"text"}
            defaultValue={data.address}
            label="address"
            onChange={handleChange}
          />
          <TextField
            fullWidth
            name="advance"
            type={"number"}
            defaultValue={data.advance}
            onChange={handleChange}
            label="advance"
            inputProps={{
              min: 0,
            }}
            InputProps={{
              startAdornment: <span style={{ marginRight: "5px" }}>Rs.</span>,
            }}
          />
          <TextField
            fullWidth
            select
            value={data.role}
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
        <Grid container item xs={12} justifyContent="space-around">
          <Grid item xs={4}>
            <Button>Report</Button>
          </Grid>
          <Grid item xs={4}>
            {loading ? (
              <Progress color={"success"} />
            ) : (
              <Button
                variant="contained"
                color="success"
                onClick={handleUpdate}
              >
                Update
              </Button>
            )}
          </Grid>
        </Grid>
        {error && <ErrorAlert error={error} setError={() => setError(null)} />}
      </Grid>
    )
  );
}
