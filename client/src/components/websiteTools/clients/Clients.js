import { useState } from "react";
import SearchBar from "./SearchBar";
import styled from "styled-components";
import SearchResults from "./SearchResults";
import Cookies from "js-cookie";
// import SearchType from "./SearchType";
const Clients = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); // Define page state
  const [limit, setLimit] = useState(3); // Define limit state
  const token = Cookies.get("token");
  //   const [searchType, setSearchType] = useState("name");
  const handleSearchClick = () => {
    const headers = {
      authorization: token,
    };
    fetch(
      `https://hollywood-fairmount-admin.onrender.com/search/${searchTerm}?page=${page}&limit=${limit}`,
      { headers }
    )
      .then((res) => res.json())
      .then((data) => {
        const newClientsArray = data.data.map((client) => ({
          ...client,
          edit: {
            fname: false,
            lname: false,
            email: false,
            number: false,
            note: false,
          },
        }));
        setSearchResults(newClientsArray);
      });
  };

  return (
    <Wrapper>
      <SearchBar
        setSearchTerm={setSearchTerm}
        handleSearchClick={handleSearchClick}
      />
      <SearchResults
        searchResults={searchResults}
        setSearchResults={setSearchResults}
      />
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
