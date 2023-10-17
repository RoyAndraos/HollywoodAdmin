import { useState } from "react";
import {
  LabelInputEditWrapper,
  StyledInput,
  Info,
  ToggleEdit,
  SaveChanges,
} from "./SearchResults";
import styled from "styled-components";
const ClientName = ({ handleSaveChange, handleEditToggle, client }) => {
  const initialName = client.fname;
  const [editedName, setEditedName] = useState(initialName); // State to track edited name

  return (
    <Container>
      <LabelInputEditWrapper>
        {client.edit.fname ? (
          <LabelInputEditWrapper>
            <StyledInput
              type="text"
              autoFocus
              placeholder={client.fname}
              onChange={(e) => {
                setEditedName(e.target.value);
              }}
            />
            {initialName !== editedName && client.edit.fname && (
              <SaveChanges
                onClick={(e) => {
                  handleSaveChange(client._id, "fname", editedName);
                  handleEditToggle(client._id, "fname", e);
                }}
              />
            )}
          </LabelInputEditWrapper>
        ) : (
          <Info>{client.fname}</Info>
        )}
        <ToggleEdit
          key={`edit-fname-${client._id}`}
          onClick={(e) => {
            handleEditToggle(client._id, "fname", e);
          }}
        />
      </LabelInputEditWrapper>
    </Container>
  );
};
export const Container = styled.div`
  width: 100%;
`;
export default ClientName;
