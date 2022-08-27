import React, { useContext, useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
} from "@mui/material";
import Variables from "variables";
import axios from "axios";
import Progress from "components/Progress";
import ErrorAlert from "components/ErrorAlert";
import { AuthContext } from "contexts/authContext";
import moment from "moment";

import styles from "./styles";

export default function Leaves() {
  const [leaves, setLeaves] = useState();
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authObject } = useContext(AuthContext);

  useEffect(() => {
    let query;
    if (authObject.role !== "Worker") {
      query = `${Variables.API_URI}/leave?id=${authObject.orgID}${
        status ? `&status=${status}` : ""
      }`;
    } else query = `${Variables.API_URI}/leave/${authObject.id}`;

    axios
      .get(query)
      .then((res) => {
        setLeaves(res.data.data);
      })
      .catch((error) => setError(error))
      .finally(setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const getStatusColor = (val) => {
    return val === "Pending"
      ? "#ee9800"
      : val === "Accepted"
      ? "#2e7d32"
      : "#d32f2f";
  };
  const getStatusShadowColor = (val) => {
    return val === "Pending"
      ? "#cc660033"
      : val === "Accepted"
      ? "#2a7a1133"
      : "#d02a2a33";
  };

  const handleButtonClick = (value, id) => {
    axios
      .put(`${Variables.API_URI}/leave/${id}`, {
        status: value,
      })
      .then((res) => {
        if (res.data.data) {
          const updatedData = leaves.map((leave) =>
            leave._id === id ? res.data.data : leave
          );

          setLeaves(updatedData);
        }
      })
      .catch((error) => setError(error));
  };

  const handleChipClick = (state) => {
    if (state === status) setStatus("");
    else setStatus(state);
  };

  return loading ? (
    <Progress color={"info"} />
  ) : (
    <Grid container direction={"column"}>
      <Grid
        container
        item
        justifyContent={"space-evenly"}
        sx={styles.chipsContainer}
      >
        {["Pending", "Accepted", "Rejected"].map((state, index) => (
          <Chip
            key={`${state}-${index}`}
            label={state}
            color="primary"
            variant={status === state ? "filled" : "outlined"}
            onClick={() => handleChipClick(state)}
          />
        ))}
      </Grid>
      {leaves?.map((leave, index) => (
        <Card key={index} sx={styles.cardMargin}>
          <CardContent>
            <Typography
              variant="h5"
              textAlign={"center"}
              gutterBottom
              sx={styles.nameFont}
            >
              {leave.userID.name}
            </Typography>
            <Grid container item>
              <Grid item xs={3}>
                <Typography sx={styles.infoFont}>From:</Typography>
              </Grid>
              <Grid item xs={"auto"}>
                <Typography sx={styles.infoFont}>
                  {moment(leave.from).format("DD MMM, YYYY")}
                </Typography>
              </Grid>
            </Grid>
            <Grid container item>
              <Grid item xs={3}>
                <Typography sx={styles.infoFont}>To:</Typography>
              </Grid>
              <Grid item xs={"auto"}>
                <Typography sx={styles.infoFont}>
                  {moment(leave.to).format("DD MMM, YYYY")}
                </Typography>
              </Grid>
            </Grid>
            <Typography
              textAlign={"center"}
              sx={styles.status}
              style={{
                color: getStatusColor(leave.status),
                backgroundColor: getStatusShadowColor(leave.status),
              }}
            >
              {leave.status}
            </Typography>
          </CardContent>
          {authObject.role !== "Worker" && (
            <CardActions>
              <Grid container item justifyContent={"space-around"}>
                <Grid item>
                  <Button
                    variant="contained"
                    color="success"
                    disabled={leave.status !== "Pending"}
                    onClick={() => handleButtonClick("Accepted", leave._id)}
                  >
                    Accept
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="error"
                    disabled={leave.status !== "Pending"}
                    onClick={() => handleButtonClick("Rejected", leave._id)}
                  >
                    Reject
                  </Button>
                </Grid>
              </Grid>
            </CardActions>
          )}
        </Card>
      ))}
      {error && <ErrorAlert error={error} setError={setError} />}
    </Grid>
  );
}
