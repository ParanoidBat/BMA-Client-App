import React from "react";
import { TCP } from "tcp-comm";
import { Button } from "@mui/material";

const Setup = () => {
  const lel = async () => {
    await TCP.sendMessage({ value: "lele" });
  };

  return (
    <div>
      <Button onClick={() => lel()}>Bhej de</Button>
    </div>
  );
};

export default Setup;
