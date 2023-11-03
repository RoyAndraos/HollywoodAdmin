import { useState } from "react";
import { LabelInfoWrapper, StyledLabel, EditButton } from "./EditRsvp";
import styled from "styled-components";
const EmailFormEdit = ({ reservation, handleChange }) => {
  const [clientEmailEdit, setClientEmailEdit] = useState("false");
  return (
    <LabelInfoWrapper>
      <StyledLabel>Email </StyledLabel>
      {clientEmailEdit === "true" ? (
        <StyledInput
          autoFocus
          placeholder={reservation.email}
          onChange={(e) => handleChange("email", e.target.value)}
        ></StyledInput>
      ) : reservation.email === "" ? (
        <span>Not Provided</span>
      ) : (
        <span>{reservation.email}</span>
      )}

      <EditButton
        props={clientEmailEdit}
        onClick={() => {
          if (clientEmailEdit === "false") {
            setClientEmailEdit("true");
          } else {
            setClientEmailEdit("false");
          }
        }}
      >
        {clientEmailEdit === "true" ? "Cancel" : "Edit"}
      </EditButton>
    </LabelInfoWrapper>
  );
};

export const StyledInput = styled.input`
  font-size: 1rem;
  outline: none;
  border: none;
  background-color: transparent;
  transition: all 0.2s ease-in-out;
  &:hover {
    cursor: pointer;
  }
`;

export default EmailFormEdit;
