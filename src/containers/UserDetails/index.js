import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Variables from "variables";
import Progress from "components/Progress";
import ErrorAlert from "components/ErrorAlert";
import { Grid, Typography, TextField, MenuItem, Button } from "@mui/material";
import { AuthContext } from "contexts/authContext";

export default function UserDetails() {
  const [data, setData] = useState();
  const [error, setError] = useState(undefined);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);
  const [percentAttendance, setPercentAttendance] = useState(0);

  const { id } = useParams();
  const { authObject } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${Variables.API_URI}/user/${id}`)
      .then((res) => {
        setData(res.data.data);
        setError(res.data.error);
      })
      .catch((error) => setError(error.message));

    axios
      .get(
        `${Variables.API_URI}/user/percent_attendance/${id}/${authObject.user.organization_id}`
      )
      .then((res) => {
        setPercentAttendance(res.data.data);
        setError(res.data.error);
      })
      .catch((error) => setError(error.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleUpdate = () => {
    setLoading(true);
    axios
      .put(`${Variables.API_URI}/user/${id}`, {
        ...userData,
      })
      .then((res) => {
        if (res.data.error) setError(res.data.error);
        else setData(res.data.data);
      })
      .catch((error) => setError(error))
      .finally(setLoading(false));
  };

  const handleChange = (e) => {
    setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

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
            disabled={authObject.user.user_role === "Worker"}
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
            label="net salary"
            disabled
            defaultValue={(data.salary * percentAttendance) / 100}
            InputProps={{
              startAdornment: <span style={{ marginRight: "5px" }}>Rs.</span>,
            }}
          />
          <TextField
            fullWidth
            name="phone"
            type={"tel"}
            defaultValue={data.phone}
            disabled={authObject.user.user_role === "Worker"}
            onChange={handleChange}
            label="phone"
          />
          <TextField
            fullWidth
            name="address"
            type={"text"}
            defaultValue={data.address}
            disabled={authObject.user.user_role === "Worker"}
            label="address"
            onChange={handleChange}
          />
          <TextField
            fullWidth
            name="advance"
            type={"number"}
            defaultValue={data.advance}
            disabled={authObject.user.user_role === "Worker"}
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
            value={data.user_role}
            name="user_role"
            label="role"
            disabled={authObject.user.user_role === "Worker"}
            onChange={handleChange}
          >
            {roles.map((role) => (
              <MenuItem key={role.value} value={role.value}>
                {role.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid
          container
          item
          xs={12}
          justifyContent={
            authObject.user.user_role !== "Worker"
              ? "space-around"
              : "flex-start"
          }
        >
          <Grid item xs={4}>
            <Button
              variant={"contained"}
              onClick={() => navigate(`/users/${id}/report`)}
            >
              Report
            </Button>
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
        {error && <ErrorAlert error={error} setError={setError} />}
      </Grid>
    )
  );
}
