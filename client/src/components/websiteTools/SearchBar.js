import React from "react";
import styled from "styled-components";
const SearchBar = ({ setSearchTerm, handleSearchClick }) => {
  return (
    <Wrapper>
      <StyledInput
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
      ></StyledInput>
      <SearchButton
        onClick={() => {
          handleSearchClick();
        }}
      >
        Search
      </SearchButton>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 40%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 4vh;
`;
const StyledInput = styled.input`
  width: 65%;
  font-size: 1.2rem;
  padding: 0.5rem;
  border-radius: 10px;
  border: 2px solid #035e3f;
  text-align: left;
`;
const SearchButton = styled.button`
  width: 25%;
  background-color: #035e3f;
  color: whitesmoke;
  border: none;
  border-radius: 10px;
  font-size: 1.2rem;
  font-weight: 600;
  padding: 0.65rem 1rem 0.65rem 1rem;
  text-align: center;
  transition: 0.3s ease-in-out;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;
export default SearchBar;
