import { useEffect, useState } from "react";
import styled from "styled-components";
import { ButtonWrapper, CancelButton } from "./BarberProfiles";

const EditProfileForm = ({
  handleChange,
  handleSave,
  handleToggleEditMode,
  barber,
  newBarber,
  setEditModes,
}) => {
  const [text, setText] = useState("Edit");
  useEffect(() => {
    if (barber.given_name === "") {
      setText("Add");
    }
  }, [barber.given_name]);
  return (
    <EditProfileWrapper>
      <InputField $props={(barber.given_name === "").toString()}>
        <SectionTitle>{text} Profile Information</SectionTitle>
        <StyledInput
          type="text"
          key={"fname" + barber._id}
          defaultValue={barber.given_name}
          placeholder="First Name"
          name="given_name"
          onChange={(e) => handleChange(e.target.name, e.target.value)}
        />
        <StyledInput
          type="text"
          key={"lname" + barber._id}
          defaultValue={barber.family_name}
          placeholder="Last Name"
          name="family_name"
          onChange={(e) => handleChange(e.target.name, e.target.value)}
        />
        <StyledInput
          type="text"
          key={"email" + barber._id}
          placeholder="Email"
          defaultValue={barber.email}
          name="email"
          onChange={(e) => handleChange(e.target.name, e.target.value)}
        />
        <StyledTextArea
          type="text"
          key={"description" + barber._id}
          defaultValue={barber.description}
          placeholder="Description"
          name="description"
          onChange={(e) => handleChange(e.target.name, e.target.value)}
        />
        <StyledTextArea
          type="text"
          key={"descriptionFrench" + barber._id}
          defaultValue={barber.description}
          placeholder="Description (French)"
          name="french_description"
          onChange={(e) => handleChange(e.target.name, e.target.value)}
        />
      </InputField>

      {barber.given_name === "" ? (
        <ButtonWrapper key={"add"}>
          <SaveButton
            onClick={() => handleSave()}
            disabled={
              newBarber.given_name === "" ||
              newBarber.family_name === "" ||
              newBarber.email === ""
            }
          >
            Add
          </SaveButton>
        </ButtonWrapper>
      ) : (
        <ButtonWrapper key={"saveCancel" + barber._id}>
          <SaveButton onClick={() => handleSave(barber._id)}>Save</SaveButton>
          <CancelButton
            key={"cancel" + barber._id}
            onClick={() => handleToggleEditMode(barber._id)}
          >
            Cancel
          </CancelButton>
        </ButtonWrapper>
      )}
    </EditProfileWrapper>
  );
};
const StyledTextArea = styled.textarea`
  width: 100%;
  border: 2px solid #035e3f;
  outline: none;
  padding: 0.5rem;
  font-size: 1.2rem;
  font-family: "Roboto", sans-serif;
  font-weight: 400;
  &:last-of-type {
    margin-top: 20px;
  }
`;

const EditProfileWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: baseline;
  width: 80%;
  height: 100%;
`;
const SaveButton = styled.button`
  background-color: #035e3f;
  color: whitesmoke;
  font-size: 1.2rem;
  font-family: "Roboto", sans-serif;
  font-weight: 400;
  border: none;
  padding: 0.5rem 1rem 0.5rem 1rem;
  transition: 0.3s ease-in-out;
  &:hover {
    cursor: pointer;
    background-color: #011c13;
  }
  &:active {
    transform: scale(0.98);
  }
  &:disabled {
    background-color: #011c13;
    color: whitesmoke;
    cursor: default;
  }
`;
const InputField = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  width: 30%;
  height: 100%;
  position: relative;
  top: ${(props) => (props.$props === "true" ? "0" : "30px")};
`;
const StyledInput = styled.input`
  width: 100%;
  border: 2px solid #035e3f;
  outline: none;
  padding: 0.5rem;
  font-size: 1.2rem;
  font-family: "Roboto", sans-serif;
  font-weight: 400;
  margin-bottom: 1rem;
`;
const SectionTitle = styled.h3`
  font-size: 1.5rem;
  font-family: "Roboto", sans-serif;
  font-weight: 400;
  color: black;
  margin-bottom: 1rem;
`;
export default EditProfileForm;
