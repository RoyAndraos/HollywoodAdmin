import { useEffect, useState, useCallback } from "react";
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
  const [pageSearch, setPageSearch] = useState(1); // Define page state
  const [totalNumberOfPagesSearch, setTotalNumberOfPagesSearch] = useState(0); // Define totalNumberOfPages state
  const [clients, setClientsState] = useState([]);
  const token = Cookies.get("token");
  // Wrap setClients with useCallback
  const setClients = useCallback((clients) => {
    setClientsState(clients);
  }, []);
  useEffect(() => {
    const headers = {
      authorization: token,
    };
    if (searchTerm === "") return;
    setLoading(true);
    fetch(
      `https://hollywood-fairmount-admin.onrender.com/search/${searchTerm}?page=${
        pageSearch + 1
      }&limit=9`,
      { headers }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.data.length === 0) {
          setLoading(false);
          setSearchResults("No results found");
          return;
        }
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
        setClients(newClientsArray);
      });
    // eslint-disable-next-line
  }, [pageSearch]);
  //   const [searchType, setSearchType] = useState("name");
  const handleSearchClick = () => {
    const headers = {
      authorization: token,
    };
    setLoading(true);
    fetch(
      `https://hollywood-fairmount-admin.onrender.com/search/${searchTerm}?page=${pageSearch}&limit=9`,
      { headers }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.data.length === 0) {
          setLoading(false);
          setSearchResults("No results found");
          return;
        }
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
        setTotalNumberOfPagesSearch(data.numberOfPages);
        setSearchResults(newClientsArray);
        setClients(newClientsArray);
      });
  };

  return (
    <Wrapper>
      <SearchBar
        setSearchTerm={setSearchTerm}
        handleSearchClick={handleSearchClick}
      />
      {loading ? (
        <div>
          <Loader />
        </div>
      ) : (
        <SearchResults
          clients={clients}
          setClients={setClients}
          searchResults={searchResults}
          setSearchResults={setSearchResults}
          totalNumberOfPagesSearch={totalNumberOfPagesSearch}
          pageSearch={pageSearch}
          setPageSearch={setPageSearch}
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
