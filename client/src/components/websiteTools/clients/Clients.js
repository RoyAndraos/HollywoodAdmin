import { useState } from "react";
import SearchBar from "./SearchBar";
import styled from "styled-components";
import SearchResults from "./SearchResults";
import Cookies from "js-cookie";
import Loader from "../../Loader";
// import SearchType from "./SearchType";
const Clients = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); // Define page state
  const [limit, setLimit] = useState(3); // Define limit state
  const [totalNumberOfPagesSearch, setTotalNumberOfPagesSearch] = useState(0); // Define totalNumberOfPages state
  const token = Cookies.get("token");

  const handleNextPage = () => {
    setLoading(true);
    const headers = {
      authorization: token,
    };
    setPage(page + 1);
    fetch(
      `https://hollywood-fairmount-admin.onrender.com/search/${searchTerm}?page=${
        page + 1
      }&limit=${limit}`,
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
        setTotalNumberOfPagesSearch(data.numberOfPages);
        setLoading(false);
        setSearchResults(newClientsArray);
      });
  };

  const handlePreviousPage = () => {
    setPage(Math.max(page - 1, 1)); // Ensure page is not less than 1
    const headers = {
      authorization: token,
    };
    setLoading(true);

    fetch(
      `https://hollywood-fairmount-admin.onrender.com/search/${searchTerm}?page=${
        page - 1
      }&limit=${limit}`,
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
        setLoading(false);
        setSearchResults(newClientsArray);
      });
  };

  //   const [searchType, setSearchType] = useState("name");
  const handleSearchClick = () => {
    const headers = {
      authorization: token,
    };
    setLoading(true);
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
        setLoading(false);
        setSearchResults(newClientsArray);
      });
  };

  return (
    <Wrapper>
      <SearchBar
        setSearchTerm={setSearchTerm}
        handleSearchClick={handleSearchClick}
      />
      {loading ? (
        <Loader />
      ) : (
        <SearchResults
          searchResults={searchResults}
          setSearchResults={setSearchResults}
          handleNextPage={handleNextPage}
          handlePreviousPage={handlePreviousPage}
        />
      )}
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
