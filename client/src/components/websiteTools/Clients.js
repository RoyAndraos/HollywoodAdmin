import { useState } from "react";
import SearchBar from "./SearchBar";
import styled from "styled-components";
import SearchResults from "./SearchResults";
// import SearchType from "./SearchType";
const Clients = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  //   const [searchType, setSearchType] = useState("name");
  const handleSearchClick = () => {
    fetch(`/search/${searchTerm}`)
      .then((res) => res.json())
      .then((data) => {
        setSearchResults(data.data);
      });
  };

  return (
    <Wrapper>
      {/* <SearchType setSearchType={setSearchType} searchType={searchType} /> */}
      <SearchBar
        setSearchTerm={setSearchTerm}
        handleSearchClick={handleSearchClick}
      />
      <SearchResults searchResults={searchResults} />
    </Wrapper>
  );
};
const Wrapper = styled.div`
  margin-top: 1vh;
  width: 100%;
  height: 88vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Roboto", sans-serif;
`;
export default Clients;
