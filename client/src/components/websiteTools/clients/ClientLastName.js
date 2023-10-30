import { useState } from "react";
import {
  LabelInputEditWrapper,
  StyledInput,
  Info,
  ToggleEdit,
  SaveChanges,
} from "./SearchResults";
import { Cancel } from "./ClientName";
import { Container } from "./ClientName";
const ClientLastName = ({ handleSaveChange, handleEditToggle, client }) => {
  const initialName = client.lname;
  const [editedName, setEditedName] = useState(initialName); // State to track edited name

  return (
    <Container>
      <LabelInputEditWrapper>
        {client.edit.lname ? (
          <LabelInputEditWrapper>
            <StyledInput
              type="text"
              autoFocus
              placeholder={client.lname}
              onChange={(e) => {
                setEditedName(e.target.value);
              }}
            />
          </LabelInputEditWrapper>
        ) : (
          <Info>{client.lname}</Info>
        )}
        {client.edit.lname ? (
          <Cancel
            key={`edit-lname-${client._id}`}
            onClick={(e) => {
              handleEditToggle(client._id, "lname", e);
              setEditedName(initialName);
            }}
          />
        ) : (
          <ToggleEdit
            key={`edit-lname-${client._id}`}
            onClick={(e) => {
              handleEditToggle(client._id, "lname", e);
            }}
          />
        )}

        {initialName !== editedName && client.edit.lname && (
          <SaveChanges
            onClick={(e) => {
              handleSaveChange(client._id, "lname", editedName);
              handleEditToggle(client._id, "lname", e);
            }}
          />
        )}
      </LabelInputEditWrapper>
    </Container>
  );
};

export default ClientLastName;
