import React, { useContext, useEffect, useState } from "react";
import {
  Tab,
  Tabs,
  Grid,
  Chip,
  Alert,
  Typography,
  Card,
  CardContent,
  Input,
  Button,
} from "@mui/material";
import { KeyboardArrowDownOutlined } from "@mui/icons-material";
import axios from "axios";
import { AuthContext } from "contexts/authContext";
import Progress from "components/Progress";

import styles from "./styles";

export default function Reports() {
  const [value, setValue] = useState(0);
  const [reports, setReports] = useState({
    data: [],
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState({});
  const [page, setPage] = useState(1);

  const { authObject } = useContext(AuthContext);

  useEffect(() => {
    getReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, page]);

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
      if (!dates.from || !dates.to) {
        setError("Select Both Dates");
        return;
      }
      setLoading(true);

      axios
        .post(
          `https://bma-api-v1.herokuapp.com/report/${reportFor}/${authObject.orgID}?page=${page}`,
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
              percentageAttendance: res.data.percentageAttendance,
              page: res.data.page,
              count: res.data.count,
            }));
            setLoading(false);
          }
        })
        .catch((error) => setError(error));
    } else {
      axios
        .get(
          `https://bma-api-v1.herokuapp.com/report/${reportFor}/${authObject.orgID}?page=${page}`
        )
        .then((res) => {
          if (res.data.error) setError(res.data.error);
          else {
            setReports((prev) => ({
              data: [...prev.data, ...res.data.data],
              percentageAttendance: res.data.percentageAttendance,
              page: res.data.page,
              count: res.data.count,
            }));
            setLoading(false);
          }
        })
        .catch((error) => setError(error));
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
              onClick={() => getReports(3)}
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
          <Grid item sx={styles.chipGrid}>
            <Chip
              label={`Attendance ${reports.percentageAttendance}%`}
              color={
                reports.percentageAttendance >= 80
                  ? "success"
                  : reports.percentageAttendance >= 50
                  ? "info"
                  : "error"
              }
              sx={styles.chip}
            />
          </Grid>
          <Grid container item direction="column">
            {reports.data.map((report, index) => (
              <Card key={`${report.userName}-${index}`} sx={styles.card}>
                <CardContent>
                  <Typography
                    component="div"
                    align="center"
                    gutterBottom
                    sx={styles.userName}
                  >
                    {report.userName}
                  </Typography>
                  <Grid container item>
                    <Grid item xs={4}>
                      <Typography style={{ ...styles.infoFont }}>
                        Date
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography sx={styles.infoFont}>
                        {report.date}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container item>
                    <Grid item xs={4}>
                      <Typography
                        style={{ ...styles.checkInColor, ...styles.infoFont }}
                      >
                        CheckIn
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography sx={styles.infoFont}>
                        {report.timeIn}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container item>
                    <Grid item xs={4}>
                      <Typography
                        style={{ ...styles.checkOutColor, ...styles.infoFont }}
                      >
                        CheckOut
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography sx={styles.infoFont}>
                        {report.timeOut ?? "None"}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
            <Button
              endIcon={<KeyboardArrowDownOutlined />}
              onClick={() => setPage((prev) => prev + 1)}
              disabled={reports.data.length === reports.count}
            >
              Load More
            </Button>
          </Grid>
        </>
      )}
      {error && (
        <Alert
          severity="error"
          sx={styles.alert}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}
    </Grid>
  );
}
