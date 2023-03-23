import React from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import moment from "moment";

import styles from "./styles";

export default function AttendanceCard({ report, index, displayName = true }) {
  return (
    <Card key={`${report.user_name}-${index}`} sx={styles.card}>
      <CardContent style={{ paddingBottom: 0 }}>
        {displayName && (
          <Typography
            component="div"
            align="center"
            gutterBottom
            sx={styles.userName}
          >
            {report.user_name}
          </Typography>
        )}
        <Grid container item>
          <Grid item xs={4}>
            <Typography style={{ ...styles.infoFont }}>Date</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography sx={styles.infoFont}>
              {moment(report.created, "YYYY-MM-DD").format("DD MMM, YYYY")}
            </Typography>
          </Grid>
        </Grid>
        <Grid container item>
          <Grid item xs={4}>
            <Typography style={{ ...styles.checkInColor, ...styles.infoFont }}>
              CheckIn
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography sx={styles.infoFont}>{report.check_in}</Typography>
          </Grid>
        </Grid>
        <Grid container item>
          <Grid item xs={4}>
            <Typography style={{ ...styles.checkOutColor, ...styles.infoFont }}>
              CheckOut
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography sx={styles.infoFont}>
              {report.check_out ?? "None"}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
