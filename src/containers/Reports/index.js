import React, { useContext, useEffect, useState } from "react";
import { Tab, Tabs, Grid, Typography, Input, Button } from "@mui/material";
import { KeyboardArrowDownOutlined } from "@mui/icons-material";
import axios from "axios";
import { AuthContext } from "contexts/authContext";
import Progress from "components/Progress";
import MessageAlert from "components/MessageAlert";
import AttendanceCard from "components/AttendanceCard";
import Variables from "variables";
import AttendanceChip from "components/AttendanceChip";

import styles from "./styles";

export default function Reports() {
  const [value, setValue] = useState(0);
  const [reports, setReports] = useState({
    data: [],
  });
  const [error, setError] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState({ from: "2000-01-01", to: "2000-01-01" });
  const [page, setPage] = useState(1);

  const { authObject } = useContext(AuthContext);

  useEffect(() => {
    getReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const ranges = ["weekly", "monthly", "3 months", "custom"];

  const handleTabChange = (event, value) => {
    setValue(value);
    setPage(1);
    setReports({ data: [] });
  };

  const handleDateChange = (e) => {
    setDates((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getReports = () => {
    let reportFor = ranges[value];
    if (reportFor === "3 months") reportFor = "three";
    if (reportFor === "custom") {
      if (dates.from === "2000-01-01" || dates.to === "2000-01-01") {
        setError("Select Valid Dates");
        return;
      }
      setLoading(true);

      axios
        .post(
          `${Variables.API_URI}/report/${reportFor}/${authObject.user.organization_id}?page=1`,
          {
            from: dates.from,
            to: dates.to,
          }
        )
        .then((res) => {
          if (res.data.error) setError(res.data.error);
          else {
            setReports({
              data: res.data.data,
              percentageAttendance: res.data.percentageAttendance,
              count: res.data.count,
            });
            setPage(res.data.page);
          }
        })
        .catch((error) => setError(error.message))
        .finally(setLoading(false));
    } else {
      axios
        .get(
          `${Variables.API_URI}/report/${reportFor}/${authObject.user.organization_id}?page=1`
        )
        .then((res) => {
          if (res.data.error) setError(res.data.error);
          else {
            setReports({
              data: res.data.data,
              percentageAttendance: res.data.percentageAttendance,
              count: res.data.count,
            });
            setPage(res.data.page);
          }
        })
        .catch((error) => setError(error.message))
        .finally(setLoading(false));
    }
  };

  const handleLoadMore = () => {
    let reportFor = ranges[value];
    if (reportFor === "3 months") reportFor = "three";
    if (reportFor === "custom") {
      if (!dates.from || !dates.to) {
        setError("Select Both Dates");
        return;
      }
      setLoading(true);

      axios
        .post(
          `${Variables.API_URI}/report/${reportFor}/${
            authObject.user.organization_id
          }?page=${page + 1}`,
          {
            from: dates.from,
            to: dates.to,
          }
        )
        .then((res) => {
          if (res.data.error) setError(res.data.error);
          else {
            setReports((prev) => ({
              data: [...prev.data, ...res.data.data],
            }));
            setPage(res.data.page);
          }
        })
        .catch((error) => setError(error.message))
        .finally(setLoading(false));
    } else {
      axios
        .get(
          `${Variables.API_URI}/report/${reportFor}/${
            authObject.user.organization_id
          }?page=${page + 1}`
        )
        .then((res) => {
          if (res.data.error) setError(res.data.error);
          else {
            setReports((prev) => ({
              data: [...prev.data, ...res.data.data],
            }));
            setPage(res.data.page);
          }
        })
        .catch((error) => setError(error.message))
        .finally(setLoading(false));
    }
  };

  return (
    <Grid container justifyContent={"center"}>
      <Tabs value={value} onChange={handleTabChange} sx={styles.fixedTabs}>
        {ranges.map((range, index) => {
          return <Tab label={range} key={`${range}-${index}`} />;
        })}
      </Tabs>
      {ranges[value] === "custom" && (
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
          <Grid item xs={10} sx={styles.marginTop}>
            <Button
              variant="contained"
              color="info"
              size="small"
              onClick={() => getReports()}
            >
              Get
            </Button>
          </Grid>
        </Grid>
      )}
      {loading ? (
        <Progress color="info" />
      ) : (
        <>
          <Grid item>
            <AttendanceChip percentage={reports.percentageAttendance} />
          </Grid>
          <Grid container item direction="column">
            {reports.data.map((report, index) => (
              <AttendanceCard report={report} index={index} />
            ))}
            <Button
              endIcon={<KeyboardArrowDownOutlined />}
              onClick={() => handleLoadMore()}
              disabled={!reports.count || reports.data.length === reports.count}
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
