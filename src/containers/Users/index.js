import React, { useState, useContext, useEffect } from "react";
import {
  Grid,
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
  TextField,
  MenuItem,
} from "@mui/material";
import { KeyboardArrowDownOutlined, AddOutlined } from "@mui/icons-material";
import axios from "axios";
import { AuthContext } from "contexts/authContext";
import Progress from "components/Progress";
import MessageAlert from "components/MessageAlert";
import Variables from "variables";
import { NavLink } from "react-router-dom";
import InputModal from "components/InputModal";

import styles from "./styles";

export default function Users() {
  const [usersList, setUsersList] = useState({
    data: [],
  });
  const [userData, setUserData] = useState({});
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const { authObject } = useContext(AuthContext);

  useEffect(() => {
    setLoading(true);

    axios
      .get(
        `${Variables.API_URI}/organization/${authObject.user.organization_id}/users?page=1`
      )
      .then((res) => {
        if (res.data.error) setError(res.data.error);
        else {
          setUsersList({
            data: res.data.data,
            count: res.data.count,
          });
        }
      })
      .catch((error) => setError(error.message))
      .finally(setLoading(false));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const roles = [
    {
      value: "Admin",
      label: "Admin",
    },
    {
      value: "Worker",
      label: "Worker",
    },
    {
      value: "Manager",
      label: "Manager",
    },
  ];

  const validateInput = () => {
    if (!userData.name || userData.name.startsWith(" ")) {
      setError("Invalid Name");
      return false;
    }
    if (!userData.finger_id || userData.finger_id <= 0) {
      setError("Invalid Finger ID");
      return false;
    }
    if (userData.salary && userData.salary < 0) {
      setError("Invalid Salary");
      return false;
    }
    if (!userData.phone || userData.phone.startsWith(" ")) {
      setError("Invalid Phone Number");
      return false;
    }
    if (!userData.password) {
      setError("Invalid Password");
      return false;
    }

    return true;
  };

  const handleDeleteUser = (id) => {
    axios
      .delete(`https://bma-api-v1.herokuapp.com/user/${id}`)
      .then((res) => {
        if (res.data.error) setError(res.data.error);
        else if (res.data.data) {
          const filteredArray = usersList.data.filter((user) => user.id !== id);

          setUsersList((prev) => ({
            ...prev,
            data: filteredArray,
            count: prev.count - 1,
          }));
        }
      })
      .catch((error) => setError(error.message));
  };

  const handleChange = (e) => {
    setUserData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = () => {
    if (!validateInput()) return;

    axios
      .put(
        `${Variables.API_URI}/user/${userData.finger_id}/${authObject.user.organization_id}`,
        {
          ...userData,
        }
      )
      .then((res) => {
        if (res.data.error) setError(res.data.error);
        setUserData({});
      })
      .catch((error) => setError(error.message))
      .finally(setOpenModal(false));
  };

  const handleLoadMore = () => {
    setLoading(true);

    axios
      .get(
        `${Variables.API_URI}/organization/${
          authObject.user.organization_id
        }/users?page=${page + 1}`
      )
      .then((res) => {
        if (res.data.error) setError(res.data.error);
        else {
          setUsersList((prev) => ({
            data: [...prev.data, ...res.data.data],
          }));
          setPage(res.data.page);
        }
      })
      .catch((error) => setError(error.message))
      .finally(setLoading(false));
  };

  return loading ? (
    <Progress color={"info"} />
  ) : (
    <>
      <Grid container direction={"column"}>
        {usersList.data.map((user) => (
          <Card key={`${user.id}`} sx={styles.cardMargin}>
            <CardContent style={{ paddingBottom: 0 }}>
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
                <NavLink style={styles.link} to={`/users/${user.id}`}>
                  Details
                </NavLink>
                <Button
                  color="warning"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  Delete
                </Button>
              </Grid>
            </CardActions>
          </Card>
        ))}
        <Button
          endIcon={<KeyboardArrowDownOutlined />}
          onClick={() => handleLoadMore()}
          disabled={usersList.data.length === usersList.count}
        >
          Load More
        </Button>
        {error && (
          <MessageAlert message={error} setMessage={setError} type={"error"} />
        )}
      </Grid>
      <Button
        variant="contained"
        color="primary"
        sx={styles.fab}
        onClick={() => setOpenModal(true)}
      >
        <AddOutlined fontSize="large" />
      </Button>
      {openModal && (
        <InputModal header={"New User"} onClose={() => setOpenModal(false)}>
          <Grid
            container
            item
            sx={{
              "& *": {
                marginBottom: "3px",
              },
            }}
          >
            <TextField
              fullWidth
              name="name"
              required
              type={"text"}
              value={userData.name ?? ""}
              onChange={handleChange}
              label="name"
            />
            <TextField
              fullWidth
              name="finger_id"
              required
              type={"number"}
              value={userData.finger_id ?? ""}
              onChange={handleChange}
              label="finger ID"
            />
            <TextField
              fullWidth
              name="salary"
              type={"number"}
              value={userData.salary ?? ""}
              label="salary"
              onChange={handleChange}
              inputProps={{
                min: 0,
              }}
              InputProps={{
                startAdornment: <span style={{ marginRight: "5px" }}>Rs.</span>,
              }}
            />
            <TextField
              fullWidth
              name="phone"
              required
              type={"tel"}
              value={userData.phone ?? ""}
              onChange={handleChange}
              label="phone"
            />
            <TextField
              fullWidth
              name="email"
              type={"email"}
              value={userData.email ?? ""}
              onChange={handleChange}
              label="email"
            />
            <TextField
              fullWidth
              name="password"
              required
              type={"password"}
              value={userData.password ?? ""}
              onChange={handleChange}
              label="password"
            />
            <TextField
              fullWidth
              name="address"
              type={"text"}
              value={userData.address ?? ""}
              label="address"
              onChange={handleChange}
            />
            <TextField
              fullWidth
              select
              value={userData.user_role ?? ""}
              name="user_role"
              label="role"
              onChange={handleChange}
            >
              {roles.map((role) => (
                <MenuItem key={role.value} value={role.value}>
                  {role.label}
                </MenuItem>
              ))}
            </TextField>
            <Grid item xs={4}>
              <Button variant="contained" color="success" onClick={handleSave}>
                Save
              </Button>
            </Grid>
          </Grid>
        </InputModal>
      )}
    </>
  );
}
