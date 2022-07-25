import React, { useState } from "react";
import OrgSignup from "components/OrgSignup";
import UserSignup from "components/UserSignup";

export default function Signup({ setFirstPage }) {
  const [organizationID, setOrganizationID] = useState(null);

  return !organizationID ? (
    <OrgSignup setOrganizationID={setOrganizationID} />
  ) : (
    <UserSignup organizationID={organizationID} setFirstPage={setFirstPage} />
  );
}
