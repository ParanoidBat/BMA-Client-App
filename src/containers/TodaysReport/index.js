import React, { useEffect, useState } from "react";
import { Grid, Typography, Card, CardContent, Chip } from "@mui/material";
import axios from "axios";
import styles from "./styles";

export default function TodaysReport() {
  const [data, setData] = useState({});
  const dummyData = [
    {
      userName: "batman",
      date: "2022-07-15",
      timeIn: "12:17:15",
      timeOut: null,
    },
    {
      userName: "paro",
      date: "2022-07-15",
      timeIn: "12:18:15",
      timeOut: null,
    },
    {
      userName: "someone",
      date: "2022-07-15",
      timeIn: "12:17:15",
      timeOut: "01:01:10",
    },
  ];
  const percentageAttendance = 80;

  useEffect(() => {
    axios
      .get(
        "https://bma-api-v1.herokuapp.com/report/today/620a53213836b50023b57fa1"
      )
      .then((res) => {
        setData({
          data: res.data.data,
          percentageAttendance: res.data.percentageAttendance,
        });
      });
  }, []);

  return (
    <Grid container justifyContent="center">
      <Grid item xs={"auto"} sx={styles.chipGrid}>
        <Chip
          label={`Attendance ${percentageAttendance}%`}
          color={
            percentageAttendance >= 80
              ? "success"
              : percentageAttendance >= 50
              ? "info"
              : "error"
          }
          sx={styles.chip}
        />
      </Grid>
      <Grid container item direction="column">
        {dummyData.map((datum, index) => (
          <Card key={`${datum.userName}-${index}`} sx={styles.card}>
            <CardContent>
              <Typography
                component="div"
                align="center"
                gutterBottom
                sx={styles.userName}
              >
                {datum.userName}
              </Typography>
              <Grid container item>
                <Grid item xs={4}>
                  <Typography
                    style={{ ...styles.checkInColor, ...styles.infoFont }}
                  >
                    CheckIn
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography sx={styles.infoFont}>{datum.timeIn}</Typography>
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
                    {datum.timeOut ?? "None"}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}
      </Grid>
    </Grid>
  );
}
