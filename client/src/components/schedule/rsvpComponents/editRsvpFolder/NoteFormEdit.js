import { useState } from "react";
import { LabelInfoWrapper, StyledLabel, EditButton } from "./EditRsvp";
import { StyledInput } from "./EmailFormEdit";

const NoteFormEdit = ({ note, handleChange, initialNote, setNote }) => {
  const [noteEdit, setNoteEdit] = useState("false");

  return (
    <LabelInfoWrapper>
      <StyledLabel>Note</StyledLabel>
      {noteEdit === "false" ? (
        initialNote !== "" ? (
          <span>{initialNote}</span>
        ) : (
          <span>No Note</span>
        )
      ) : (
        <StyledInput
          autoFocus
          defaultValue={note}
          onChange={(e) => {
            handleChange(e);
          }}
        ></StyledInput>
      )}
      <EditButton
        $props={noteEdit}
        onClick={() => {
          if (noteEdit === "false") {
            setNoteEdit("true");
          } else {
            setNote(initialNote);
            setNoteEdit("false");
          }
        }}
      >
        {noteEdit === "true" ? "Cancel" : "Edit"}
      </EditButton>
    </LabelInfoWrapper>
  );
};

export default NoteFormEdit;
