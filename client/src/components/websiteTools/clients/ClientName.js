import { useState } from "react";
import { BsXSquare } from "react-icons/bs";
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
          </LabelInputEditWrapper>
        ) : (
          <Info>{client.fname}</Info>
        )}
        {client.edit.fname ? (
          <Cancel
            key={`edit-fname-${client._id}`}
            onClick={(e) => {
              handleEditToggle(client._id, "fname", e);
              setEditedName(initialName);
            }}
          />
        ) : (
          <ToggleEdit
            key={`edit-fname-${client._id}`}
            onClick={(e) => {
              handleEditToggle(client._id, "fname", e);
            }}
          />
        )}
        {initialName !== editedName && client.edit.fname && (
          <SaveChanges
            onClick={(e) => {
              handleSaveChange(client._id, "fname", editedName);
              handleEditToggle(client._id, "fname", e);
            }}
          />
        )}
      </LabelInputEditWrapper>
    </Container>
  );
};
export const Container = styled.div`
  width: 100%;
`;
export const Cancel = styled(BsXSquare)`
  background-color: #a70000;
  color: whitesmoke;
  font-size: 1.2rem;
  font-family: "Roboto", sans-serif;
  font-weight: 400;
  margin-left: 20px;
  transition: 0.2s ease-in-out;
  &:hover {
    cursor: pointer;
    background-color: whitesmoke;
    color: #a70000;
  }
`;
export default ClientName;
