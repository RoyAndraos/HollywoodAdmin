import React, { useContext, useState } from "react";
import { UserContext } from "../../../contexts/UserContext";
import { LabelInfoWrapper, StyledLabel, EditButton } from "./EditRsvp";
import styled from "styled-components";
const BarberFormEdit = ({ reservation, handleChange }) => {
  const { userInfo } = useContext(UserContext);
  const [barberEdit, setBarberEdit] = useState("false");
  return (
    <LabelInfoWrapper>
      <StyledLabel>Barber </StyledLabel>
      {barberEdit ? (
        <Select
          open
          id="barber"
          onChange={(e) => handleChange(e.target.id, e.target.value)}
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
          handleChange("barber", reservation.barber);
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
