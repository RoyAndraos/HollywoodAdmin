import { useState } from "react";
import { LabelInfoWrapper, StyledLabel, EditButton } from "./EditRsvp";
import styled from "styled-components";
const NameFormEdit = ({ handleChange, reservation }) => {
  const [clientLNameEdit, setClientLNameEdit] = useState("false");
  return (
    <LabelInfoWrapper>
      <StyledLabel>Client Last Name </StyledLabel>
      {clientLNameEdit === "true" ? (
        <NameInput
          placeholder={reservation.lname}
          autoFocus
          id="lname"
          onChange={(e) => {
            handleChange(e.target.id, e.target.value);
          }}
        />
      ) : (
        <span>{reservation.lname}</span>
      )}
      <EditButton
        $props={clientLNameEdit}
        onClick={(e) => {
          handleChange(e.target.id, reservation.lname);
          if (clientLNameEdit === "false") {
            setClientLNameEdit("true");
          } else {
            setClientLNameEdit("false");
            handleChange("lname", reservation.lname);
          }
        }}
      >
        {clientLNameEdit === "true" ? "Cancel" : "Edit"}
      </EditButton>
    </LabelInfoWrapper>
  );
};

const NameInput = styled.input`
  border: none;
  background-color: transparent;
  font-size: 1rem;
  outline: none;
`;

export default NameFormEdit;
