import React, { useEffect, useState, useContext } from "react";
import { Grid, Chip } from "@mui/material";
import { AuthContext } from "contexts/authContext";
import axios from "axios";
import Progress from "components/Progress";
import ErrorAlert from "components/ErrorAlert";
import AttendanceCard from "components/AttendanceCard";
import Variables from "variables";

export default function TodaysReport() {
  const [report, setReport] = useState();
  const [error, setError] = useState(undefined);
  const [loading, setLoading] = useState(true);

  const { authObject } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get(
        `${Variables.API_URI}/report/today/${authObject.user.organization_id}`
      )
      .then((res) => {
        if (res.data.error) setError(res.data.error);
        else {
          setReport(res.data);
          setLoading(false);
        }
      })
      .catch((error) => setError(error.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return loading ? (
    <Progress color={"info"} />
  ) : (
    <Grid container justifyContent="center">
      <Grid item xs={"auto"}>
        <Chip
          label={`Attendance ${report.totalAttendance ?? "None"}`}
          color={"info"}
          sx={{ fontSize: "1.5rem", padding: "0px 5px", margin: "5px 0px" }}
        />
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
