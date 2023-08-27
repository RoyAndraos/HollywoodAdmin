import { useState } from "react";
import { LabelInfoWrapper, StyledLabel, EditButton } from "./EditRsvp";
import styled from "styled-components";
const NumberFormEdit = ({ reservation, handleChange }) => {
  const [clientNumberEdit, setClientNumberEdit] = useState(false);
  return (
    <LabelInfoWrapper>
      <StyledLabel>Number</StyledLabel>
      {clientNumberEdit ? (
        <StyledInput
          autoFocus
          onChange={(e) => handleChange("number", e.target.value)}
        ></StyledInput>
      ) : reservation.number === "" ? (
        <span>Not Provided</span>
      ) : (
        <span>{reservation.number}</span>
      )}
      <EditButton
        props={clientNumberEdit}
        onClick={() => setClientNumberEdit(!clientNumberEdit)}
      >
        {clientNumberEdit ? "Cancel" : "Edit"}
      </EditButton>
    </LabelInfoWrapper>
  );
};

const StyledInput = styled.input`
  font-size: 1rem;
  outline: none;
  border: none;
  background-color: transparent;
  transition: all 0.2s ease-in-out;
  &:hover {
    cursor: pointer;
  }
`;
export default NumberFormEdit;
