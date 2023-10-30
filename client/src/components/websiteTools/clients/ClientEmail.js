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
const ClientEmail = ({ handleSaveChange, handleEditToggle, client }) => {
  const initialEmail = client.email;
  const [editedEmail, setEditedEmail] = useState(initialEmail); // State to track edited name
  return (
    <Container>
      {client.email === "" ? (
        client.edit.email ? (
          <LabelInputEditWrapper>
            <StyledInput
              type="text"
              autoFocus
              placeholder={"example@email.com"}
              onChange={(e) => {
                setEditedEmail(e.target.value);
              }}
            />
            <Cancel
              key={`edit-email-${client._id}`}
              onClick={(e) => {
                handleEditToggle(client._id, "email", e);
                setEditedEmail(initialEmail);
              }}
            />
            {initialEmail !== editedEmail && client.edit.email && (
              <SaveChanges
                onClick={(e) => {
                  handleSaveChange(client._id, "email", editedEmail);
                  handleEditToggle(client._id, "email", e);
                }}
              />
            )}
          </LabelInputEditWrapper>
        ) : (
          <LabelInputEditWrapper>
            <Info>No email</Info>
            <ToggleEdit
              key={`edit-email-${client._id}`}
              onClick={(e) => {
                handleEditToggle(client._id, "email", e);
              }}
            />
          </LabelInputEditWrapper>
        )
      ) : client.edit.email ? (
        <LabelInputEditWrapper>
          <StyledInput
            autoFocus
            placeholder={client.email}
            onChange={(e) => {
              setEditedEmail(e.target.value);
            }}
          />
          <Cancel
            key={`edit-email-${client._id}`}
            onClick={(e) => {
              handleEditToggle(client._id, "email", e);
              setEditedEmail(initialEmail);
            }}
          />
          {initialEmail !== editedEmail && client.edit.email && (
            <SaveChanges
              onClick={(e) => {
                handleSaveChange(client._id, "email", editedEmail);
                handleEditToggle(client._id, "email", e);
              }}
            />
          )}
        </LabelInputEditWrapper>
      ) : (
        <LabelInputEditWrapper>
          <Info>{client.email}</Info>
          <ToggleEdit
            key={`edit-email-${client._id}`}
            onClick={(e) => {
              handleEditToggle(client._id, "email", e);
            }}
          />
        </LabelInputEditWrapper>
      )}
    </Container>
  );
};

export default ClientEmail;
