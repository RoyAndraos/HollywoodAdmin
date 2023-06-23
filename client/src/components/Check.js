import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import { ReservationContext } from "./ReservationContext";
const Check = () => {
  const { user } = useAuth0();
  const { setUserInfo } = useContext(UserContext);
  const { setReservations } = useContext(ReservationContext);
  const navigate = useNavigate();
  useEffect(() => {
    fetch("/checkIfAdmin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((result) => {
        switch (result.status) {
          case 200:
            fetch(`/getUserInfo`)
              .then((res) => res.json())
              .then((result) => {
                setUserInfo(result.userInfo);
                setReservations(result.reservations);
              })
              .then(() => navigate("/dashboard/schedule"));
            break;
          case 404:
            navigate("/404");
        }
      });
  }, []);
  return <div>Check</div>;
};

export default Check;
