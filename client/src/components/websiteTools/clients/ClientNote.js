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
const ClientNote = ({
  handleSaveChange,
  handleEditToggle,
  client,
  isSearchResult,
}) => {
  const initialNote = client.note;
  const [editedNote, setEditedNote] = useState(initialNote); // State to track edited name
  return (
    <Container>
      {client.note === "" ? (
        client.edit.note ? (
          <LabelInputEditWrapper>
            <StyledInput
              type="text"
              autoFocus
              placeholder={client.note}
              onChange={(e) => {
                setEditedNote(e.target.value);
              }}
            />
            <Cancel
              key={`edit-note-${client._id}`}
              onClick={(e) => {
                handleEditToggle(client._id, "note", e, isSearchResult);
                setEditedNote(initialNote);
              }}
            />
            {initialNote !== editedNote && client.edit.note && (
              <SaveChanges
                onClick={(e) => {
                  handleSaveChange(
                    client._id,
                    "note",
                    editedNote,
                    isSearchResult
                  );
                  handleEditToggle(client._id, "note", e, isSearchResult);
                }}
              />
            )}
          </LabelInputEditWrapper>
        ) : (
          <LabelInputEditWrapper>
            <Info>No note</Info>
            <ToggleEdit
              key={`edit-note-${client._id}`}
              onClick={(e) => {
                handleEditToggle(client._id, "note", e, isSearchResult);
                setEditedNote("");
              }}
            />
          </LabelInputEditWrapper>
        )
      ) : client.edit.note ? (
        <LabelInputEditWrapper>
          <StyledInput
            type="text"
            autoFocus
            placeholder={client.note}
            onChange={(e) => {
              setEditedNote(e.target.value);
            }}
          />
          <Cancel
            key={`edit-note-${client._id}`}
            onClick={(e) => {
              handleEditToggle(client._id, "note", e, isSearchResult);
              setEditedNote(initialNote);
            }}
          />
          {initialNote !== editedNote && (
            <SaveChanges
              onClick={(e) => {
                handleSaveChange(
                  client._id,
                  "note",
                  editedNote,
                  isSearchResult
                );
                handleEditToggle(client._id, "note", e, isSearchResult);
              }}
            />
          )}
        </LabelInputEditWrapper>
      ) : (
        <LabelInputEditWrapper>
          <Info>{client.note}</Info>
          <ToggleEdit
            key={`edit-note-${client._id}`}
            onClick={(e) => {
              handleEditToggle(client._id, "note", e, isSearchResult);
              setEditedNote("");
            }}
          />
        </LabelInputEditWrapper>
      )}
    </Container>
  );
};

export default ClientNote;
