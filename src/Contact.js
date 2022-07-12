import React, { useState } from "react";
import axios from "axios";

export default function Contact() {
  const [users, setUsers] = useState();

  axios.get("https://bma-api-v1.herokuapp.com/user?page=1").then((res) => {
    setUsers(res.data.data);
  });

  return (
    <div>
      <h3>Contact</h3>
      <p>fgiugebgrebgrieugneljvnierfnj</p>
      <div>
        {users?.map((user, index) => (
          <p key={index}> {user.name} </p>
        ))}
      </div>
    </div>
  );
}
