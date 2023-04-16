import React, { useEffect, useState, useContext } from "react";
import { Grid, Chip } from "@mui/material";
import { AuthContext } from "contexts/authContext";
import Progress from "components/Progress";
import MessageAlert from "components/MessageAlert";
import AttendanceCard from "components/AttendanceCard";
import Variables from "variables";
import apiClient from "apiClient";

export default function TodaysReport() {
  const [report, setReport] = useState();
  const [error, setError] = useState(undefined);
  const [loading, setLoading] = useState(true);

  const { authObject } = useContext(AuthContext);

  useEffect(() => {
    apiClient
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
          <AttendanceCard
            key={`daily_report_${index}`}
            report={reportObj}
            index={index}
          />
        ))}
      </Grid>
      {error && (
        <MessageAlert message={error} setMessage={setError} type={"error"} />
      )}
    </Grid>
  );
}
