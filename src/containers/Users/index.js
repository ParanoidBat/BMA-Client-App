import React, { useState, useContext, useEffect } from "react";
import {
  Grid,
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import { KeyboardArrowDownOutlined } from "@mui/icons-material";
import axios from "axios";
import { AuthContext } from "contexts/authContext";
import Progress from "components/Progress";
import ErrorAlert from "components/ErrorAlert";
import Variables from "variables";
import { NavLink } from "react-router-dom";

export default function Users() {
  const [usersList, setUsersList] = useState({
    data: [],
  });
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authObject } = useContext(AuthContext);

  useEffect(() => {
    setLoading(true);

    axios
      .get(
        `${Variables.API_URI}/organization/${authObject.orgID}/users?page=${page}`
      )
      .then((res) => {
        if (res.data.error) setError(res.data.error);
        else {
          setUsersList((prev) => ({
            data: [...prev.data, ...res.data.data],
            page: res.data.page,
            count: res.data.count,
          }));
          setLoading(false);
        }
      })
      .catch((error) => setError(error));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleDeleteUser = (id) => {
    axios
      .delete(`https://bma-api-v1.herokuapp.com/user/${id}`)
      .then((res) => {
        if (res.data.error) setError(res.data.error);
        else if (res.data.data) {
          const filteredArray = usersList.data.filter(
            (user) => user._id !== id
          );
          setUsersList((prev) => ({
            ...prev,
            data: filteredArray,
          }));
        }
      })
      .catch((error) => setError(error));
  };

  return loading ? (
    <Progress color={"info"} />
  ) : (
    <Grid container direction={"column"}>
      {usersList.data.map((user) => (
        <Card key={`${user._id}`}>
          <CardContent>
            <Typography variant="h5" textAlign={"center"} gutterBottom>
              {user.name}
            </Typography>
            <Grid container item xs={10}>
              <Grid item xs={3}>
                <Typography>Salary</Typography>
              </Grid>
              <Grid item xs={7}>
                <Typography>PKR {user.salary}</Typography>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <Grid container item justifyContent={"space-around"}>
              <NavLink to={`/users/${user._id}`}>Details</NavLink>
              <Button
                color="warning"
                onClick={() => handleDeleteUser(user._id)}
              >
                Delete
              </Button>
            </Grid>
          </CardActions>
        </Card>
      ))}
      <Button
        endIcon={<KeyboardArrowDownOutlined />}
        onClick={() => setPage((prev) => prev + 1)}
        disabled={usersList.data.length === usersList.count}
      >
        Load More
      </Button>
      {error && <ErrorAlert error={error} setError={setError} />}
    </Grid>
  );
}
