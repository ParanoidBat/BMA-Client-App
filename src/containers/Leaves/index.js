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
import apiClient from "apiClient";
import Progress from "components/Progress";
import MessageAlert from "components/MessageAlert";
import InputModal from "components/InputModal";
import RejectReasonModal from "./reject-reason-modal";
import { AuthContext } from "contexts/authContext";
import moment from "moment";
import { findIndex } from "lodash";

import styles from "./styles";

export default function Leaves() {
  const [leaves, setLeaves] = useState();
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(undefined);
  const [dates, setDates] = useState({ from: "2000-01-01", to: "2000-01-01" });
  const [reason, setReason] = useState("");
  const [rejectedLeaveID, setRejectedLeaveID] = useState(0);

  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const [refresh, setRefresh] = useState(true);

  const { authObject } = useContext(AuthContext);

  useEffect(() => {
    let query;

    if (authObject.user.user_role !== "Worker") {
      query = `/leave?id=${authObject.user.organization_id}${
        status ? `&status=${status}` : ""
      }`;
    } else query = `/leave/${authObject.user.id}`;

    if (refresh) {
      apiClient
        .get(query)
        .then((res) => {
          setLeaves(res.data.data);
        })
        .catch((error) => setError(error.message))
        .finally(setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, refresh]);

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
    const index = findIndex(
      leaves,
      (leave) => leave.leave_status === "Pending"
    );

    if (index === -1) return false;
    return true;
  };

  const handleStatusUpdate = (value, id) => {
    apiClient
      .put(`/leave/${id}`, {
        status: value,
      })
      .then((res) => {
        if (res.data.data) {
          const updatedData = leaves.map((leave) =>
            leave.id === id ? res.data.data : leave
          );

          setLeaves(updatedData);
        }
      })
      .catch((error) => setError(error.message));
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

  const handleReject = (id) => {
    setRejectedLeaveID(id);
    setRefresh(false);
    setOpenRejectModal(true);
  };

  const handleApplyButton = () => {
    if (dates.from === "2000-01-01" || dates.to === "2000-01-01") return;

    if (dates.from > dates.to) {
      [dates.from, dates.to] = [dates.to, dates.from];
    }

    apiClient
      .post(`/leave`, {
        userID: authObject.user.id,
        orgID: authObject.user.organization_id,
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
      .catch((error) => setError(error.message))
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
          {authObject.user.user_role !== "Worker" &&
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
                {leave.name}
              </Typography>
              <Grid container item>
                <Grid item xs={4}>
                  <Typography sx={styles.infoFont} fontWeight={"bold"}>
                    From:
                  </Typography>
                </Grid>
                <Grid item xs={"auto"}>
                  <Typography sx={styles.infoFont}>
                    {moment(leave.from_date).format("DD MMM, YYYY")}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container item>
                <Grid item xs={4}>
                  <Typography sx={styles.infoFont} fontWeight={"bold"}>
                    To:
                  </Typography>
                </Grid>
                <Grid item xs={"auto"}>
                  <Typography sx={styles.infoFont}>
                    {moment(leave.to_date).format("DD MMM, YYYY")}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container item>
                <Grid item xs={4}>
                  <Typography sx={styles.infoFont} fontWeight={"bold"}>
                    Applied:
                  </Typography>
                </Grid>
                <Grid item xs={"auto"}>
                  <Typography sx={styles.infoFont}>
                    {moment(leave.created_on).format("DD MMM, YYYY")}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container item>
                <Grid item xs={4}>
                  <Typography sx={styles.infoFont} fontWeight={"bold"}>
                    Reason:
                  </Typography>
                </Grid>
                <Grid item xs={"auto"}>
                  <Typography sx={{ ...styles.infoFont, ...styles.reasonText }}>
                    {leave.reason}
                  </Typography>
                </Grid>
              </Grid>
              {leave.reject_reason ? (
                <Grid container item>
                  <Grid item xs={4}>
                    <Typography sx={styles.infoFont} fontWeight={"bold"}>
                      Response:
                    </Typography>
                  </Grid>
                  <Grid item xs={"auto"}>
                    <Typography
                      sx={{ ...styles.infoFont, ...styles.reasonText }}
                    >
                      {leave.reject_reason}
                    </Typography>
                  </Grid>
                </Grid>
              ) : null}
              <Typography
                textAlign={"center"}
                sx={styles.status}
                style={{
                  color: getStatusColor(leave.leave_status),
                  backgroundColor: getStatusShadowColor(leave.leave_status),
                }}
              >
                {leave.leave_status}
              </Typography>
            </CardContent>
            {authObject.user.user_role !== "Worker" && (
              <CardActions>
                <Grid container item justifyContent={"space-around"}>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="success"
                      disabled={leave.leave_status !== "Pending"}
                      onClick={() => handleStatusUpdate("Accepted", leave.id)}
                    >
                      Accept
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="error"
                      disabled={leave.leave_status !== "Pending"}
                      onClick={() => handleReject(leave.id)}
                    >
                      Reject
                    </Button>
                  </Grid>
                </Grid>
              </CardActions>
            )}
          </Card>
        ))}
        {error && (
          <MessageAlert message={error} setMessage={setError} type={"error"} />
        )}
      </Grid>
      {authObject.user.user_role !== "Admin" && !hasPendingLeave() && (
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
      {openRejectModal && (
        <RejectReasonModal
          id={rejectedLeaveID}
          onClose={() => setOpenRejectModal(false)}
          setRefresh={setRefresh}
        />
      )}
    </>
  );
}
