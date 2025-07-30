import React from "react";
import { useState } from "react";
import { useEffect } from "react";

const HoveredEvent = ({ res }) => {
  const [note, setNote] = useState();
  const [loading, setLoading] = useState(true);
  console.log(loading);
  useEffect(() => {
    setLoading(true);
    if (res.client === "Blocked") {
      setLoading(false);
      return;
    }
    fetch(
      `https://hollywood-fairmount-admin.onrender.com/getClientNote/${res.client_id}`
    )
      .then((res) => res.json())
      .then((result) => {
        setNote(result.data);
        setLoading(false);
      });
  }, [res]);
  if (loading) {
    return <div>...Loading...</div>;
  } else if (res.client === "Blocked") {
    return <div>Blocked</div>;
  } else {
    return <div>{note === "" ? "no note" : note}</div>;
  }
};

export default HoveredEvent;
