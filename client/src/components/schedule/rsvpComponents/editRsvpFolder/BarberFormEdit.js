import { useEffect, useState } from "react";
import { LabelInfoWrapper, StyledLabel, EditButton } from "./EditRsvp";
import styled from "styled-components";
import Loader from "../../../Loader";
const BarberFormEdit = ({ reservation, handleChange }) => {
  const [userInfo, setUserInfo] = useState([]);
  const [barberEdit, setBarberEdit] = useState("false");
  useEffect(() => {
    fetch("https://hollywood-fairmount-admin.onrender.com/api/barbers")
      .then((res) => res.json())
      .then((result) => {
        setUserInfo(result.barbers);
      });
  }, []);
  if (!userInfo) {
    return <Loader />;
  }
  return (
    <LabelInfoWrapper>
      <StyledLabel>Barber </StyledLabel>
      {barberEdit === "true" ? (
        <Select
          open
          id="barber"
          onChange={(e) => handleChange("barber", e.target.value)}
        >
          {userInfo.map((barber) => {
            return <option key={barber._id}>{barber.given_name}</option>;
          })}
        </Select>
      ) : (
        <span>{reservation.barber}</span>
      )}
      <EditButton
        props={barberEdit}
        onClick={() => {
          if (barberEdit === "false") {
            setBarberEdit("true");
          } else {
            setBarberEdit("false");
          }
        }}
      >
        {barberEdit === "true" ? "Cancel" : "Edit"}
      </EditButton>
    </LabelInfoWrapper>
  );
};

const Select = styled.select`
  font-size: 1rem;
  outline: none;
  border: none;
  background-color: transparent;
  transition: all 0.2s ease-in-out;
  &:hover {
    cursor: pointer;
  }
`;

export default BarberFormEdit;
