import { useState } from "react";
import {
  LabelInputEditWrapper,
  StyledInput,
  Info,
  ToggleEdit,
  SaveChanges,
} from "./SearchResults";
import { Container } from "./ClientName";
const ClientNote = ({ handleSaveChange, handleEditToggle, client }) => {
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
              onChange={(e) => {
                setEditedNote(e.target.value);
              }}
            />
            <ToggleEdit
              key={`edit-note-${client._id}`}
              onClick={(e) => {
                handleEditToggle(client._id, "note", e);
              }}
            />
            {initialNote !== editedNote && client.edit.note && (
              <SaveChanges
                onClick={(e) => {
                  handleSaveChange(client._id, "note", editedNote);
                  handleEditToggle(client._id, "note", e);
                }}
              />
            )}
          </LabelInputEditWrapper>
        ) : (
          <LabelInputEditWrapper>
            <Info style={{ fontSize: "1rem" }}>No note</Info>
            <ToggleEdit
              key={`edit-note-${client._id}`}
              onClick={(e) => {
                handleEditToggle(client._id, "note", e);
              }}
            />
          </LabelInputEditWrapper>
        )
      ) : client.edit.note ? (
        <LabelInputEditWrapper>
          <StyledInput
            type="text"
            autoFocus
            onChange={(e) => {
              setEditedNote(e.target.value);
            }}
          />
          <ToggleEdit
            key={`edit-note-${client._id}`}
            onClick={(e) => {
              handleEditToggle(client._id, "note", e);
            }}
          />
          {initialNote !== editedNote && client.edit.note && (
            <SaveChanges
              onClick={(e) => {
                handleSaveChange(client._id, "note", editedNote);
                handleEditToggle(client._id, "note", e);
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
              handleEditToggle(client._id, "note", e);
            }}
          />
        </LabelInputEditWrapper>
      )}
    </Container>
  );
};

export default ClientNote;
