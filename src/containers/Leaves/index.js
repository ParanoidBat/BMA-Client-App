import React, { useContext, useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Input,
} from "@mui/material";
import { AddOutlined } from "@mui/icons-material";
import Variables from "variables";
import axios from "axios";
import Progress from "components/Progress";
import ErrorAlert from "components/ErrorAlert";
import InputModal from "components/InputModal";
import { AuthContext } from "contexts/authContext";
import moment from "moment";
import { findIndex } from "lodash";

import styles from "./styles";

export default function Leaves() {
  const [leaves, setLeaves] = useState();
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [reason, setReason] = useState("");

  const { authObject } = useContext(AuthContext);

  useEffect(() => {
    let query;
    if (authObject.user.role !== "Worker") {
      query = `${Variables.API_URI}/leave?id=${authObject.user.organizationID}${
        status ? `&status=${status}` : ""
      }`;
    } else query = `${Variables.API_URI}/leave/${authObject.user._id}`;

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

  const hasPendingLeave = () => {
    const index = findIndex(leaves, (leave) => leave.status === "Pending");

    if (index === -1) return false;
    return true;
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

  const handleDateChange = (e) => {
    setDates((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleApplyButton = () => {
    if (dates.from > dates.to) {
      [dates.from, dates.to] = [dates.to, dates.from];
    }

    axios
      .post(`${Variables.API_URI}/leave`, {
        userID: authObject.user._id,
        orgID: authObject.user.organizationID,
        from: dates.from,
        to: dates.to,
        reason,
      })
      .then((res) => {
        if (res.data.error) setError(res.data.error);
        else {
          setLeaves((prev) => {
            return [...prev, res.data.data];
          });
        }
      })
      .catch((error) => setError(error))
      .finally(setOpenModal(false));
  };

  return loading ? (
    <Progress color={"info"} />
  ) : (
    <>
      <Grid container direction={"column"}>
        <Grid
          container
          item
          justifyContent={"space-evenly"}
          sx={styles.chipsContainer}
        >
          {authObject.user.role !== "Worker" &&
            ["Pending", "Accepted", "Rejected"].map((state, index) => (
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
              <Grid container item>
                <Grid item xs={3}>
                  <Typography sx={styles.infoFont}>Applied:</Typography>
                </Grid>
                <Grid item xs={"auto"}>
                  <Typography sx={styles.infoFont}>
                    {moment(leave.createdOn).format("DD MMM, YYYY")}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container item>
                <Grid item xs={3}>
                  <Typography sx={styles.infoFont}>Reason:</Typography>
                </Grid>
                <Grid item xs={"auto"}>
                  <Typography sx={{ ...styles.infoFont, ...styles.reasonText }}>
                    {leave.reason}
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
            {authObject.user.role !== "Worker" && (
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
      {authObject.user.role !== "Admin" && !hasPendingLeave() && (
        <Button
          variant="contained"
          color="primary"
          sx={styles.fab}
          onClick={() => setOpenModal(true)}
        >
          <AddOutlined fontSize="large" />
        </Button>
      )}
      {openModal && (
        <InputModal onClose={() => setOpenModal(false)} header="Apply Leave">
          <Grid container item direction="column">
            <Grid item xs={3} sx={styles.dateGrid}>
              <Typography sx={styles.fontBold}>From</Typography>
              <Input
                type="date"
                name="from"
                disableUnderline
                value={dates.from}
                sx={styles.input}
                onChange={handleDateChange}
              />
            </Grid>
            <Grid item xs={3} sx={styles.dateGrid}>
              <Typography sx={styles.fontBold}>To</Typography>
              <Input
                type="date"
                name="to"
                disableUnderline
                value={dates.to}
                sx={styles.input}
                onChange={handleDateChange}
              />
            </Grid>
            <Grid item xs={3} sx={styles.dateGrid}>
              <Typography sx={styles.fontBold}>Reason</Typography>
              <Input
                type="text"
                name="reason"
                disableUnderline
                value={reason}
                sx={styles.input}
                onChange={(e) => setReason(e.target.value)}
              />
            </Grid>
            <Grid item sx={styles.marginTop}>
              <Button
                variant="contained"
                color="success"
                size="small"
                onClick={handleApplyButton}
              >
                Apply
              </Button>
            </Grid>
          </Grid>
        </InputModal>
      )}
    </>
  );
}
