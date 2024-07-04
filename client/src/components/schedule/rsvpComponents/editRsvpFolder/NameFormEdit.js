import { useState } from "react";
import { LabelInfoWrapper, StyledLabel, EditButton } from "./EditRsvp";
import styled from "styled-components";
const NameFormEdit = ({ handleChange, reservation }) => {
  const [clientNameEdit, setClientNameEdit] = useState("false");
  return (
    <LabelInfoWrapper>
      <StyledLabel>Client Name </StyledLabel>
      {clientNameEdit === "true" ? (
        <NameInput
          placeholder={reservation.fname}
          autoFocus
          id="fname"
          onChange={(e) => {
            handleChange(e.target.id, e.target.value);
          }}
        />
      ) : (
        <span>{reservation.fname}</span>
      )}
      <EditButton
        $props={clientNameEdit}
        onClick={() => {
          if (clientNameEdit === "false") {
            setClientNameEdit("true");
          } else {
            setClientNameEdit("false");
            handleChange("fname", reservation.fname);
          }
        }}
      >
        {clientNameEdit === "true" ? "Cancel" : "Edit"}
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
