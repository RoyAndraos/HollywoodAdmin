import React, { useContext } from "react";
import { UserContext } from ".././contexts/UserContext";
const BarberProfiles = () => {
  const { userInfo } = useContext(UserContext);
  console.log(userInfo);
  return (
    <div>
      {userInfo.map((barber) => {
        return <div key={barber._id}>{barber.given_name}</div>;
      })}
    </div>
  );
};

export default BarberProfiles;
