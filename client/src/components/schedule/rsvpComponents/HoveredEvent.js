import React from "react";
import { useState } from "react";
import { useEffect } from "react";

const HoveredEvent = ({ res }) => {
  const [note, setNote] = useState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    fetch(
      `https://hollywood-fairmount-admin.onrender.com/getClientNote/${res.client_id}`
    )
      .then((res) => res.json())
      .then((result) => {
        setNote(result.data);
      });
    setLoading(false);
  }, [res]);
  if (loading) {
    return <div>...Loading...</div>;
  } else {
    return <div>{note === "" ? "no note" : note}</div>;
  }
};

export default HoveredEvent;
