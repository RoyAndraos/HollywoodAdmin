import React, { useEffect, useState } from "react";
import styled from "styled-components";
const SearchResults = ({ searchResults }) => {
  const [clientRes, setClientRes] = useState([]);
  useEffect(() => {
    fetch("/clientRes")
      .then((res) => res.json())
      .then((data) => {
        setClientRes(data.data);
      });
  }, []);
  if (searchResults.length === 0) return <div>No results found</div>;
  console.log(searchResults);
  return (
    <Wrapper>
      {searchResults.map((result) => {
        return (
          <ClientWrapper key={result._id}>
            <StyledLabel>Client Name</StyledLabel>
            <Info>
              {result.fname} {result.lname}
            </Info>
            <StyledLabel>Client Email</StyledLabel>
            <Info>{result.email}</Info>
            <StyledLabel>Client Number</StyledLabel>
            {result.number === "" ? (
              <ClientContentWrapper>
                <AddNote>Add number</AddNote>
              </ClientContentWrapper>
            ) : (
              <ClientContentWrapper>
                <Info>{result.number}</Info>
                <AddNote>Edit number</AddNote>
              </ClientContentWrapper>
            )}

            <StyledLabel>Client Reservations</StyledLabel>
            {result.reservations.map((res) => {
              return <Info key={res}>{res}</Info>;
            })}

            <StyledLabel>Client Note</StyledLabel>
            {result.note === "" ? (
              <ClientContentWrapper>
                <AddNote>Add note</AddNote>
              </ClientContentWrapper>
            ) : (
              <ClientContentWrapper>
                <Info>{result.note}</Info>
                <AddNote>Edit note</AddNote>
              </ClientContentWrapper>
            )}
          </ClientWrapper>
        );
      })}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  margin-top: 4vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2vw;
  width: 100%;
`;
const ClientWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 30%;
  padding: 1vw 2vh 0 2vh;
  background-color: #f2f2f2;
  border: 1px solid black;
`;

const ClientContentWrapper = styled.div`
  margin: 20px 0 20px 10px;
`;

const StyledLabel = styled.label`
  font-size: 1.5rem;
  font-weight: bold;
  border-bottom: 1px solid #035e3f;
  color: #035e3f;
  width: 100%;
  margin-top: 20px;
  &:first-of-type {
    margin-top: 0;
  }
`;
const Info = styled.p`
  font-size: 1.2rem;
  font-weight: 400;
  margin-left: 10px;
`;

const AddNote = styled.button`
  background-color: #035e3f;
  color: whitesmoke;
  font-size: 1.2rem;
  font-family: "Roboto", sans-serif;
  border-radius: 0.5rem;
  border: none;
  padding: 0.5rem;
  transition: 0.3s ease-in-out;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;
export default SearchResults;
