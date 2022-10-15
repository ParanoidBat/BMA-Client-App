import React, { useState } from "react";
import OrgSignup from "components/OrgSignup";
import UserSignup from "components/UserSignup";
import { ChevronLeft } from "@mui/icons-material";
import { Button, Grid } from "@mui/material";

export default function Signup({ setFirstPage }) {
  const [organizationID, setOrganizationID] = useState(null);

  return (
    <>
      <Grid>
        <Button onClick={() => setFirstPage("Login")}>
          <ChevronLeft /> Login
        </Button>
      </Grid>
      {!organizationID ? (
        <OrgSignup setOrganizationID={setOrganizationID} />
      ) : (
        <UserSignup
          organizationID={organizationID}
          setFirstPage={setFirstPage}
        />
      )}
    </>
  );
}
