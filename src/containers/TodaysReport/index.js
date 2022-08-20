import React, { useEffect, useState, useContext } from "react";
import { Grid } from "@mui/material";
import { AuthContext } from "contexts/authContext";
import axios from "axios";
import Progress from "components/Progress";
import ErrorAlert from "components/ErrorAlert";
import AttendanceCard from "components/AttendanceCard";
import AttendanceChip from "components/AttendanceChip";
import Variables from "variables";

export default function TodaysReport() {
  const [report, setReport] = useState();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authObject } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get(`${Variables.API_URI}/report/today/${authObject.orgID}`)
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
      <Grid item xs={"auto"}>
        <AttendanceChip percentage={report.percentageAttendance} />
      </Grid>
      <Grid container item direction="column">
        {report.data.map((reportObj, index) => (
          <AttendanceCard report={reportObj} index={index} />
        ))}
      </Grid>
      {error && <ErrorAlert error={error} setError={setError} />}
    </Grid>
  );
}
