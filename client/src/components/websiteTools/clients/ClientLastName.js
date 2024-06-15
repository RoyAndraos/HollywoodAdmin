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
const ClientLastName = ({
  handleSaveChange,
  handleEditToggle,
  client,
  isSearchResult,
}) => {
  const initialName = client.lname;
  const [editedName, setEditedName] = useState(initialName); // State to track edited name
  return (
    <Container>
      <LabelInputEditWrapper>
        {client.lname.length !== 0 ? (
          client.edit.lname ? (
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
          )
        ) : (
          <LabelInputEditWrapper>
            {" "}
            {client.edit.lname ? (
              <StyledInput
                type="text"
                autoFocus
                placeholder={client.lname}
                onChange={(e) => {
                  setEditedName(e.target.value);
                }}
              />
            ) : (
              <Info>Not Provided</Info>
            )}
          </LabelInputEditWrapper>
        )}
        {client.edit.lname ? (
          <Cancel
            key={`edit-lname-${client._id}`}
            onClick={(e) => {
              handleEditToggle(client._id, "lname", e, isSearchResult);
              setEditedName(initialName);
            }}
          />
        ) : (
          <ToggleEdit
            key={`edit-lname-${client._id}`}
            onClick={(e) => {
              handleEditToggle(client._id, "lname", e, isSearchResult);
            }}
          />
        )}

        {initialName !== editedName && client.edit.lname && (
          <SaveChanges
            onClick={(e) => {
              handleSaveChange(client._id, "lname", editedName, isSearchResult);
              handleEditToggle(client._id, "lname", e, isSearchResult);
            }}
          />
        )}
      </LabelInputEditWrapper>
    </Container>
  );
};

export default ClientLastName;
