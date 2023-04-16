import React, { useContext, useEffect, useState } from "react";
import { Grid, Input, Typography, Button } from "@mui/material";
import AttendanceCard from "components/AttendanceCard";
import AttendanceChip from "components/AttendanceChip";
import MessageAlert from "components/MessageAlert";
import Progress from "components/Progress";
import apiClient from "apiClient";
import { useParams } from "react-router-dom";
import { AuthContext } from "contexts/authContext";
import { differenceBy } from "lodash";
import { KeyboardArrowDownOutlined } from "@mui/icons-material";

import styles from "./styles";

export default function UserReport() {
  const { id } = useParams();
  const { authObject } = useContext(AuthContext);

  const [report, setReport] = useState({ data: [] });
  const [error, setError] = useState(undefined);
  const [dates, setDates] = useState({ from: "2000-01-01", to: "2000-01-01" });
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
    setDates({ from: "2000-01-01", to: "2000-01-01" });
    setPage(1);
  };

  const getUserReport = () => {
    if (dates.from === "2000-01-01" || dates.to === "2000-01-01") return;

    apiClient
      .post(
        `/report/user/${authObject.user.organization_id}/${id}?page=${page}`,
        {
          from: dates.from,
          to: dates.to,
        }
      )
      .then((res) => {
        if (res.data.error) setError(res.data.error);
        else {
          const newData = differenceBy(res.data.data, report.data, "uas");

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
              color="info"
              size="small"
              onClick={() => getUserReport()}
            >
              Get
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              variant="contained"
              color="error"
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
              <AttendanceCard
                key={`user_report_${index}`}
                report={report}
                index={index}
              />
            ))}
            <Button
              endIcon={<KeyboardArrowDownOutlined />}
              onClick={() => setPage((prev) => prev + 1)}
              disabled={!report.count || report.data.length >= report.count}
            >
              Load More
            </Button>
          </Grid>
        </>
      )}
      {error && (
        <MessageAlert message={error} setMessage={setError} type={"error"} />
      )}
    </Grid>
  );
}
