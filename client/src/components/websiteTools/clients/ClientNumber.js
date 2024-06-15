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
const ClientNumber = ({
  handleSaveChange,
  handleEditToggle,
  client,
  isSearchResult,
}) => {
  const initialNumber = client.number;
  const [editedNumber, setEditedNumber] = useState(initialNumber); // State to track edited name
  return (
    <Container>
      {client.number === "" ? (
        client.edit.number ? (
          <LabelInputEditWrapper>
            <StyledInput
              type="text"
              autoFocus
              onChange={(e) => {
                setEditedNumber(e.target.value);
              }}
            />
            <Cancel
              key={`edit-number-${client._id}`}
              onClick={(e) => {
                handleEditToggle(client._id, "number", e, isSearchResult);
                setEditedNumber(initialNumber);
              }}
            />
            {initialNumber !== editedNumber && client.edit.number && (
              <SaveChanges
                onClick={(e) => {
                  handleSaveChange(
                    client._id,
                    "number",
                    editedNumber,
                    isSearchResult
                  );
                  handleEditToggle(client._id, "number", e, isSearchResult);
                }}
              />
            )}
          </LabelInputEditWrapper>
        ) : (
          <LabelInputEditWrapper>
            <Info>No number</Info>
            <ToggleEdit
              key={`edit-number-${client._id}`}
              onClick={(e) => {
                handleEditToggle(client._id, "number", e, isSearchResult);
              }}
            />
          </LabelInputEditWrapper>
        )
      ) : client.edit.number ? (
        <LabelInputEditWrapper>
          <StyledInput
            autoFocus
            placeholder={client.number}
            onChange={(e) => {
              setEditedNumber(e.target.value);
            }}
          />
          <Cancel
            key={`edit-number-${client._id}`}
            onClick={(e) => {
              handleEditToggle(client._id, "number", e, isSearchResult);
              setEditedNumber(initialNumber);
            }}
          />
          {initialNumber !== editedNumber && client.edit.number && (
            <SaveChanges
              onClick={(e) => {
                handleSaveChange(
                  client._id,
                  "number",
                  editedNumber,
                  isSearchResult
                );
                handleEditToggle(client._id, "number", e, isSearchResult);
              }}
            />
          )}
        </LabelInputEditWrapper>
      ) : (
        <LabelInputEditWrapper>
          <Info>{client.number}</Info>
          <ToggleEdit
            key={`edit-number-${client._id}`}
            onClick={(e) => {
              handleEditToggle(client._id, "number", e, isSearchResult);
            }}
          />
        </LabelInputEditWrapper>
      )}
    </Container>
  );
};

export default ClientNumber;
