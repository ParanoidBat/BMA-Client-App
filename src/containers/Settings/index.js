import React, { useContext, useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Switch,
  Button,
} from "@mui/material";
import axios from "axios";
import Variables from "variables";
import { AuthContext } from "contexts/authContext";
import ErrorAlert from "components/ErrorAlert";
import Progress from "components/Progress";
import styles from "./styles";

export default function Settings() {
  const [isSatOff, setIsSatOff] = useState(false);
  const [error, setError] = useState(undefined);
  const [loading, setLoading] = useState(true);

  const { authObject } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get(
        `${Variables.API_URI}/organization/${authObject.user.organization_id}`
      )
      .then((res) => {
        setError(res.data.error);
        setIsSatOff(res.data.data.is_saturday_off);
      })
      .catch((error) => setError(error.message))
      .finally(setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = () => {
    setLoading(true);

    axios
      .put(
        `${Variables.API_URI}/organization/${authObject.user.organization_id}`,
        {
          is_saturday_off: isSatOff,
        }
      )
      .then((res) => setError(res.data.error))
      .catch((error) => setError(error))
      .finally(setLoading(false));
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Card>
          <CardContent sx={styles.cardContent}>
            <Typography variant="h6">Saturday Is Off</Typography>
            <Switch
              checked={isSatOff}
              onChange={(e) => setIsSatOff(e.target.checked)}
            />
          </CardContent>
        </Card>
        <Grid item>
          {loading ? (
            <Progress color={"info"} />
          ) : (
            <Button
              onClick={() => handleSave()}
              sx={styles.button}
              variant="contained"
              color="success"
            >
              Save
            </Button>
          )}
        </Grid>
      </Grid>
      {error && <ErrorAlert error={error} setError={setError} />}
    </Grid>
  );
}
