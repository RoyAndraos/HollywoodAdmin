import React from "react";
import styled from "styled-components";
const SearchType = ({ setSearchType, searchType }) => {
  return (
    <Wrapper>
      <Option
        key={"name"}
        name={"name"}
        isselected={searchType === "name" ? "true" : "false"}
        onClick={() => {
          setSearchType("name");
        }}
      >
        Name
      </Option>
      <Option
        onClick={() => {
          setSearchType("email");
        }}
        key={"email"}
        name={"email"}
        isselected={searchType === "email" ? "true" : "false"}
      >
        Email
      </Option>
      <Option
        onClick={() => {
          setSearchType("number");
        }}
        key={"number"}
        name={"number"}
        isselected={searchType === "number" ? "true" : "false"}
      >
        Phone Number
      </Option>
      <Option
        onClick={() => {
          setSearchType("reservation");
        }}
        key={"reservation"}
        name={"reservation"}
        isselected={searchType === "reservation" ? "true" : "false"}
      >
        Reservation
      </Option>
      <Option
        key={"note"}
        name={"note"}
        isselected={searchType === "note" ? "true" : "false"}
        onClick={() => {
          setSearchType("note");
        }}
      >
        Note
      </Option>
    </Wrapper>
  );
};
const Option = styled.div`
  background-color: #035e3f;
  color: whitesmoke;
  border-radius: 5px;
  width: 130px;
  text-align: center;
  padding: 5px 0 5px 0;
  margin-left: 5px;
  transition: 0.3s ease-in-out;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
  ${(props) =>
    props.isselected === "true" &&
    `
        background-color: #011c13;
        transform: scale(0.98) translateX(-1%);
    `}
`;
const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 60%;
  margin: 3vh;
`;
export default SearchType;
