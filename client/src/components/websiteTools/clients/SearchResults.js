import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import { AiOutlineEdit } from "react-icons/ai";
import { BsCheckSquare } from "react-icons/bs";
import ClientName from "./ClientName";
import ClientEmail from "./ClientEmail";
import ClientNumber from "./ClientNumber";
import ClientNote from "./ClientNote";
import ClientReservation from "./ClientReservation";
import ClientLastName from "./ClientLastName";
import Cookies from "js-cookie";
import { NotificationContext } from "../../contexts/NotficationContext";
import Loader from "../../Loader";
const SearchResults = ({
  searchResults,
  totalNumberOfPagesSearch,
  pageSearch,
  setPageSearch,
  clients,
  setClients,
  setSearchResults,
}) => {
  const { setNotification } = useContext(NotificationContext);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalNumberOfPagesAllClients, setTotalNumberOfPagesAllClients] =
    useState(0);
  const [areYouSure, setAreYouSure] = useState(
    clients.map((client) => {
      return {
        [client._id]: false,
      };
    })
  );
  useEffect(() => {
    const token = Cookies.get("token");
    const headers = {
      authorization: token,
    };
    setLoading(true);
    fetch(
      `https://hollywood-fairmount-admin.onrender.com/clients?page=${page}&limit=9`,
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
        setTotalNumberOfPagesAllClients(data.numberOfPages);
        setLoading(false);
        setClients(newClientsArray);
      });
  }, [page, setClients]);

  // Function to toggle the edit state for a specific client
  const handleEditToggle = (clientId, field, e, isSearchResult) => {
    e.preventDefault();
    if (isSearchResult) {
      setSearchResults((prevSearchResults) => {
        return prevSearchResults.map((client) => {
          if (client._id === clientId) {
            return {
              ...client,
              edit: {
                ...client.edit,
                [field]: !client.edit[field],
              },
            };
          }
          return client;
        });
      });
    } else {
      setClients((prevClients) => {
        return prevClients.map((client) => {
          if (client._id === clientId) {
            return {
              ...client,
              edit: {
                ...client.edit,
                [field]: !client.edit[field],
              },
            };
          }
          return client;
        });
      });
    }
  };

  // Function to save the changes made
  const handleSaveChange = (clientId, field, value, isSearchResult) => {
    const token = Cookies.get("token");
    const headers = {
      authorization: token,
    };
    fetch("https://hollywood-fairmount-admin.onrender.com/updateClient", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify([
        {
          [field]: value,
        },
        clientId,
      ]),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          if (isSearchResult) {
            setSearchResults((prevSearchResults) => {
              return prevSearchResults.map((client) => {
                if (client._id === clientId) {
                  return {
                    ...client,
                    [field]: value,
                  };
                }
                return client;
              });
            });
          } else {
            setClients((prevClients) => {
              return prevClients.map((client) => {
                if (client._id === clientId) {
                  return {
                    ...client,
                    [field]: value,
                  };
                }
                return client;
              });
            });
          }

          setNotification("Client updated successfully");
        } else {
          setNotification("Something went wrong");
        }
      });
  };

  // Function to delete a client
  const handleDeleteClient = (clientId) => {
    fetch(
      `https://hollywood-fairmount-admin.onrender.com/deleteClient/${clientId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: Cookies.get("token"),
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          setClients((prevClients) => {
            return prevClients.filter(
              (prevClient) => prevClient._id !== data._id
            );
          });

          setNotification("Client deleted successfully");
        } else {
          setNotification("Something went wrong");
        }
      });
  };
  const getPagination = (totalPages, currentPage) => {
    const visiblePages = 3;
    let pages = [];

    if (totalPages <= visiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 2) {
        pages = [1, 2, 3, "...", totalPages];
      } else if (currentPage >= totalPages - 1) {
        pages = [1, "...", totalPages - 2, totalPages - 1, totalPages];
      } else {
        pages = [
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        ];
      }
    }

    return pages;
  };

  const paginationAllClients = getPagination(
    totalNumberOfPagesAllClients,
    page
  );
  const paginationSearch = getPagination(totalNumberOfPagesSearch, pageSearch);
  if (clients.length === 0 && searchResults.length === 0)
    return (
      <div>
        <Loader />
      </div>
    );
  if (loading)
    return (
      <div>
        <Loader />
      </div>
    );
  if (searchResults === "No results found") {
    return (
      <Wrapper>
        <p>No results found</p>
      </Wrapper>
    );
  }
  if (
    searchResults.length === 0 &&
    clients &&
    searchResults !== "No results found"
  )
    return (
      <Wrapper key={"noSearch"}>
        <PaginationWrapper>
          <PageNumber
            onClick={() => {
              setPage(page - 1);
            }}
            disabled={page === 1 || totalNumberOfPagesAllClients === 1}
          >
            {"<"}
          </PageNumber>
          {paginationAllClients.map((pageNumber, index) => {
            if (pageNumber === "...") {
              return (
                <PageNumber
                  style={{ border: "none", fontWeight: 700 }}
                  key={index + "..."}
                >
                  ...
                </PageNumber>
              );
            }
            return (
              <PageNumber
                key={pageNumber}
                onClick={() => {
                  setPage(pageNumber);
                }}
                $selectedPage={pageNumber === page}
              >
                {pageNumber}
              </PageNumber>
            );
          })}
          <PageNumber
            onClick={() => {
              setPage(page + 1);
            }}
            disabled={
              page === totalNumberOfPagesAllClients ||
              totalNumberOfPagesAllClients === 1
            }
          >
            {">"}
          </PageNumber>
        </PaginationWrapper>
        <AllClientsWrapper>
          {clients.map((client) => {
            return (
              <ClientWrapper key={client._id}>
                <StyledLabel>First Name</StyledLabel>
                <ClientName
                  client={client}
                  handleSaveChange={handleSaveChange}
                  handleEditToggle={handleEditToggle}
                  isSearchResult={false}
                />
                <StyledLabel>Last Name</StyledLabel>
                <ClientLastName
                  client={client}
                  handleSaveChange={handleSaveChange}
                  handleEditToggle={handleEditToggle}
                  isSearchResult={false}
                />
                <StyledLabel>Email</StyledLabel>
                <ClientEmail
                  client={client}
                  handleSaveChange={handleSaveChange}
                  handleEditToggle={handleEditToggle}
                  isSearchResult={false}
                />
                <StyledLabel>Number</StyledLabel>
                <ClientNumber
                  client={client}
                  handleSaveChange={handleSaveChange}
                  handleEditToggle={handleEditToggle}
                  isSearchResult={false}
                />
                <StyledLabel>Note</StyledLabel>
                <ClientNote
                  client={client}
                  handleSaveChange={handleSaveChange}
                  handleEditToggle={handleEditToggle}
                  isSearchResult={false}
                />
                <StyledLabel>Last Reservation</StyledLabel>
                <ClientReservation client={client} />
                <DeleteClient
                  client={client}
                  onClick={() => {
                    setAreYouSure({
                      ...areYouSure,
                      [client._id]: !areYouSure[client._id],
                    });
                  }}
                >
                  Delete Client
                </DeleteClient>
                {areYouSure[client._id] && (
                  <div>
                    <p>Are you sure you want to delete this client?</p>
                    <Yes
                      onClick={() => {
                        handleDeleteClient(client._id);
                      }}
                    >
                      Yes
                    </Yes>
                    <No
                      onClick={() => {
                        setAreYouSure(!areYouSure);
                      }}
                    >
                      No
                    </No>
                  </div>
                )}
              </ClientWrapper>
            );
          })}
        </AllClientsWrapper>
      </Wrapper>
    );
  else {
    if (searchResults.length === 0) {
      return (
        <div>
          <Loader />
        </div>
      );
    } else {
      return (
        <Wrapper key={"search"}>
          <PaginationWrapper>
            <PageNumber
              onClick={() => {
                setPageSearch(pageSearch - 1);
              }}
              disabled={pageSearch === 1}
            >
              {"<"}
            </PageNumber>
            {paginationSearch.map((pageNumber, index) => {
              if (pageNumber === "...") {
                return (
                  <PageNumber
                    key={index + "..."}
                    style={{ border: "none", fontWeight: 700 }}
                  >
                    ...
                  </PageNumber>
                );
              }
              return (
                <PageNumber
                  key={pageNumber}
                  onClick={() => {
                    setPageSearch(pageNumber);
                  }}
                  $selectedPage={pageNumber === pageSearch}
                >
                  {pageNumber}
                </PageNumber>
              );
            })}
            <PageNumber
              onClick={() => {
                setPageSearch(pageSearch + 1);
              }}
              disabled={
                pageSearch === totalNumberOfPagesSearch ||
                totalNumberOfPagesSearch === 1
              }
            >
              {">"}
            </PageNumber>
          </PaginationWrapper>
          <AllClientsWrapper>
            {searchResults.map((client) => {
              return (
                <ClientWrapper key={client._id + "searchRes"}>
                  <StyledLabel>Name</StyledLabel>
                  <ClientName
                    client={client}
                    handleSaveChange={handleSaveChange}
                    handleEditToggle={handleEditToggle}
                    isSearchResult={true}
                  />
                  <StyledLabel>Last Name</StyledLabel>
                  <ClientLastName
                    client={client}
                    handleSaveChange={handleSaveChange}
                    handleEditToggle={handleEditToggle}
                    isSearchResult={true}
                  />
                  <StyledLabel>Email</StyledLabel>
                  <ClientEmail
                    client={client}
                    handleSaveChange={handleSaveChange}
                    handleEditToggle={handleEditToggle}
                    isSearchResult={true}
                  />
                  <StyledLabel>Number</StyledLabel>
                  <ClientNumber
                    client={client}
                    handleSaveChange={handleSaveChange}
                    handleEditToggle={handleEditToggle}
                    isSearchResult={true}
                  />
                  <StyledLabel>Note</StyledLabel>
                  <ClientNote
                    client={client}
                    handleSaveChange={handleSaveChange}
                    handleEditToggle={handleEditToggle}
                    isSearchResult={true}
                  />
                  <StyledLabel>Last Reservation</StyledLabel>
                  <ClientReservation client={client} />
                  <DeleteClient
                    client={client}
                    onClick={() => {
                      setAreYouSure({
                        ...areYouSure,
                        [client._id]: !areYouSure[client._id],
                      });
                    }}
                  >
                    Delete Client
                  </DeleteClient>
                  {areYouSure[client._id] && (
                    <div>
                      <p>Are you sure you want to delete this client?</p>
                      <Yes
                        onClick={() => {
                          handleDeleteClient(client._id);
                        }}
                      >
                        Yes
                      </Yes>
                      <No
                        onClick={() => {
                          setAreYouSure(!areYouSure);
                        }}
                      >
                        No
                      </No>
                    </div>
                  )}
                </ClientWrapper>
              );
            })}
          </AllClientsWrapper>
        </Wrapper>
      );
    }
  }
};
const PaginationWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 10px;
  width: 100%;
`;
const AllClientsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-around;
`;

const PageNumber = styled.button`
  background-color: ${(props) => (props.$selectedPage ? "black" : "white")};
  color: ${(props) => (props.$selectedPage ? "white" : "black")};
  border: 1px solid black;
  border-radius: 5px;
  cursor: pointer;
  &:disabled {
    cursor: not-allowed;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 2vw;
  flex-wrap: wrap;
  width: 100%;
`;
const ClientWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 25%;
  margin: 2vh 0 2vh 0;
  padding: 1vw 2vh 0.5vh 2vh;
  background-color: #f2f2f2;
  border: 1px solid black;
`;

export const LabelInputEditWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 90%;
`;
export const ToggleEdit = styled(AiOutlineEdit)`
  font-size: 1.3rem;
  transition: 0.3s ease-in;
  color: grey;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;

export const StyledLabel = styled.label`
  font-size: 1.2rem;
  font-weight: bold;
  border-bottom: 1px solid #035e3f;
  color: #035e3f;
  width: 100%;
  margin-top: 20px;
  &:first-of-type {
    margin-top: 0;
  }
`;
export const Info = styled.p`
  font-size: 1.2rem;
  font-weight: 400;
  margin-left: 5%;
  width: 80%;
  cursor: pointer;
`;

export const StyledInput = styled.input`
  font-size: 1.2rem;
  margin: 7% 0 5% 5%;
  width: 80%;
  outline: none;
`;

export const SaveChanges = styled(BsCheckSquare)`
  background-color: #035e3f;
  color: whitesmoke;
  font-size: 1.2rem;
  font-family: "Roboto", sans-serif;
  font-weight: 400;
  transition: 0.2s ease-in-out;
  margin-left: 5%;
  &:hover {
    cursor: pointer;
    background-color: whitesmoke;
    color: #035e3f;
  }
`;
const DeleteClient = styled.button`
  background-color: #a70000;
  color: whitesmoke;
  font-size: 1.2rem;
  font-family: "Roboto", sans-serif;
  font-weight: 400;
  transition: 0.2s ease-in-out;
  margin-top: 10px;
  border: 2px solid transparent;
  padding: 5px 10px;
  border-radius: 5px;
  &:hover {
    cursor: pointer;
    background-color: whitesmoke;
    color: #a70000;
    border: 2px solid #a70000;
    font-weight: 600;
  }
`;

const Yes = styled.button`
  background-color: #a70000;
  color: whitesmoke;
  font-size: 1.2rem;
  font-family: "Roboto", sans-serif;
  font-weight: 400;
  cursor: pointer;
  transition: 0.2s ease-in-out;
  border: 2px solid transparent;
  padding: 3px 10px;
  border-radius: 5px;
  &:hover {
    background-color: whitesmoke;
    color: #a70000;
    border: 2px solid #a70000;
  }
`;
const No = styled.button`
  background-color: #035e3f;
  color: whitesmoke;
  font-size: 1.2rem;
  font-family: "Roboto", sans-serif;
  font-weight: 400;
  margin-left: 10px;
  cursor: pointer;
  border: 2px solid transparent;
  padding: 3px 10px;
  border-radius: 5px;
  transition: 0.2s ease-in-out;
  &:hover {
    background-color: whitesmoke;
    color: #035e3f;
    border: 2px solid #035e3f;
  }
`;
export default SearchResults;
