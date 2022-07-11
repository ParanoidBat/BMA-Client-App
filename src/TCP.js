import React from "react";
import { TCP } from "tcp-comm";

const TCPComm = () => {
  const lel = async () => {
    await TCP.sendMessage({ value: "lele" });
  };

  return (
    <div>
      <button onClick={() => lel()}>Bhej de</button>
    </div>
  );
};

export default TCPComm;
