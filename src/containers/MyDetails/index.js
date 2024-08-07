import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "apiClient";
import MessageAlert from "components/MessageAlert";
import { Grid, Typography, Button } from "@mui/material";

import styles from "./styles";

export default function UserDetails() {
  const [data, setData] = useState();
  const [error, setError] = useState(undefined);
  const [percentAttendance, setPercentAttendance] = useState(0);

  const { id, orgID } = useParams();

  useEffect(() => {
    apiClient
      .get(`/user/${id}`)
      .then((res) => {
        setData(res.data.data);
        setError(res.data.error);
      })
      .catch((error) => setError(error));

    apiClient
      .get(`/user/percent_attendance/${id}/${orgID}`)
      .then((res) => {
        setPercentAttendance(res.data.data);
        setError(res.data.error);
      })
      .catch((error) => setError(error.message));
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
              {data.user_role}
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Button
            variant={"contained"}
            sx={styles.button}
            onClick={() => navigate(`/users/${id}/report`)}
          >
            Report
          </Button>
        </Grid>
        {error && (
          <MessageAlert message={error} setMessage={setError} type={"error"} />
        )}
      </Grid>
    )
  );
}
