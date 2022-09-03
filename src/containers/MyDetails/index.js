import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Variables from "variables";
import ErrorAlert from "components/ErrorAlert";
import { Grid, Typography, Button } from "@mui/material";

import styles from "./styles";

export default function UserDetails() {
  const [data, setData] = useState();
  const [error, setError] = useState(null);
  const [percentAttendance, setPercentAttendance] = useState(0);

  const { id, orgID } = useParams();

  useEffect(() => {
    axios
      .get(`${Variables.API_URI}/user/${id}`)
      .then((res) => {
        setData(res.data.data);
        setError(res.data.error);
      })
      .catch((error) => setError(error));

    axios
      .get(`${Variables.API_URI}/user/percent_attendance/${id}/${orgID}`)
      .then((res) => {
        setPercentAttendance(res.data.data);
        setError(res.data.error);
      })
      .catch((error) => setError(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigate = useNavigate();

  return (
    data && (
      <Grid container>
        <Grid item xs={12}>
          <Typography gutterBottom textAlign={"center"} variant="h4">
            {data.name}
          </Typography>
        </Grid>
        <Grid container item xs={12}>
          <Grid item xs={4}>
            <Typography variant="h5">Salary</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography gutterBottom variant="h6">
              Rs.{data.salary}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h5">Net Salary</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography gutterBottom variant="h6">
              Rs.{(data.salary * percentAttendance) / 100}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h5">Phone</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography gutterBottom variant="h6">
              {data.phone}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h5">Address</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography gutterBottom variant="h6">
              {data.address ?? "None"}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h5">Advance</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography gutterBottom variant="h6">
              Rs.{data.advance}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h5">Role</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography gutterBottom variant="h6">
              {data.role}
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={4} sx={styles.button}>
          <Button
            variant={"contained"}
            onClick={() => navigate(`/users/${id}/report`)}
          >
            Report
          </Button>
        </Grid>
        {error && <ErrorAlert error={error} setError={setError} />}
      </Grid>
    )
  );
}
