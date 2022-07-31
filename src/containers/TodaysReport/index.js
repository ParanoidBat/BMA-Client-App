import React, { useEffect, useState, useContext } from "react";
import { Grid, Typography, Card, CardContent, Chip } from "@mui/material";
import { AuthContext } from "contexts/authContext";
import axios from "axios";
import Progress from "components/Progress";

import styles from "./styles";
import ErrorAlert from "components/ErrorAlert";

export default function TodaysReport() {
  const [report, setReport] = useState();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authObject } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get(`https://bma-api-v1.herokuapp.com/report/today/${authObject.orgID}`)
      .then((res) => {
        if (res.data.error) setError(res.data.error);
        else {
          setReport(res.data);
          setLoading(false);
        }
      })
      .catch((error) => setError(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return loading ? (
    <Progress color={"info"} />
  ) : (
    <Grid container justifyContent="center">
      <Grid item xs={"auto"} sx={styles.chipGrid}>
        <Chip
          label={`Attendance ${report.percentageAttendance}%`}
          color={
            report.percentageAttendance >= 80
              ? "success"
              : report.percentageAttendance >= 50
              ? "info"
              : "error"
          }
          sx={styles.chip}
        />
      </Grid>
      <Grid container item direction="column">
        {report.data.map((reportObj, index) => (
          <Card key={`${reportObj.userName}-${index}`} sx={styles.card}>
            <CardContent>
              <Typography
                component="div"
                align="center"
                gutterBottom
                sx={styles.userName}
              >
                {reportObj.userName}
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
                  <Typography sx={styles.infoFont}>
                    {reportObj.timeIn}
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
                    {reportObj.timeOut ?? "None"}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}
      </Grid>
      {error && <ErrorAlert error={error} setError={setError} />}
    </Grid>
  );
}
