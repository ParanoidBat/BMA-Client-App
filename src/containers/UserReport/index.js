import React, { useContext, useEffect, useState } from "react";
import { Grid, Input, Typography, Button } from "@mui/material";
import AttendanceCard from "components/AttendanceCard";
import AttendanceChip from "components/AttendanceChip";
import ErrorAlert from "components/ErrorAlert";
import Progress from "components/Progress";
import Variables from "variables";
import { useParams } from "react-router-dom";
import { AuthContext } from "contexts/authContext";
import { differenceBy } from "lodash";
import { KeyboardArrowDownOutlined } from "@mui/icons-material";
import axios from "axios";

import styles from "./styles";

export default function UserReport() {
  const { id } = useParams();
  const { authObject } = useContext(AuthContext);

  const [report, setReport] = useState({ data: [] });
  const [error, setError] = useState(null);
  const [dates, setDates] = useState({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUserReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleDateChange = (e) => {
    setDates((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleClear = () => {
    setDates({ to: "", from: "" });
    setPage(1);
  };

  const getUserReport = () => {
    if (!dates.from || !dates.to) return;

    axios
      .post(
        `${Variables.API_URI}/report/user/${authObject.user.organizationID}/${id}?page=${page}`,
        {
          from: dates.from,
          to: dates.to,
        }
      )
      .then((res) => {
        if (res.data.error) setError(res.data.error);
        else {
          const newData = differenceBy(res.data.data, report.data, "_id");

          setReport((prev) => ({
            data: [...prev.data, ...newData],
            percentageAttendance: res.data.percentageAttendance,
            page: res.data.page,
            count: res.data.count,
          }));
        }
      })
      .finally(setLoading(false));
  };

  return (
    <Grid container justifyContent={"center"}>
      <Grid container item justifyContent={"space-around"}>
        <Grid item xs={4} sx={styles.dateGrid}>
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
        <Grid item xs={4} sx={styles.dateGrid}>
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
        <Grid
          container
          item
          xs={12}
          justifyContent="space-around"
          sx={styles.marginTop}
        >
          <Grid item xs={3}>
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={() => getUserReport()}
            >
              Get
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => handleClear()}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Grid>
      {loading ? (
        <Progress color="info" />
      ) : (
        <>
          <Grid item>
            <AttendanceChip percentage={report.percentageAttendance} />
          </Grid>
          <Grid container item direction="column">
            {report.data.map((report, index) => (
              <AttendanceCard report={report} index={index} />
            ))}
            <Button
              endIcon={<KeyboardArrowDownOutlined />}
              onClick={() => setPage((prev) => prev + 1)}
              disabled={report.data.length === report.count}
            >
              Load More
            </Button>
          </Grid>
        </>
      )}
      {error && <ErrorAlert error={error} onClose={setError} />}
    </Grid>
  );
}
