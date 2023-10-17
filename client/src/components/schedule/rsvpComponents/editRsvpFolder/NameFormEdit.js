import { useState } from "react";
import { LabelInfoWrapper, StyledLabel, EditButton } from "./EditRsvp";
import styled from "styled-components";
const NameFormEdit = ({ handleChange, reservation }) => {
  const [clientNameEdit, setClientNameEdit] = useState(false);
  return (
    <LabelInfoWrapper>
      <StyledLabel>Client Name </StyledLabel>
      {clientNameEdit ? (
        <NameInput
          placeholder={reservation.clientName}
          autoFocus
          id="name"
          onChange={(e) => {
            handleChange(e.target.id, e.target.value);
          }}
        />
      ) : (
        <span>{reservation.clientName}</span>
      )}
      <EditButton
        props={clientNameEdit}
        onClick={(e) => {
          handleChange(e.target.id, reservation.name);
          setClientNameEdit(!clientNameEdit);
        }}
      >
        {clientNameEdit ? "Cancel" : "Edit"}
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
