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
const SearchResults = ({ searchResults }) => {
  const [clients, setClients] = useState([]);
  const { setNotification } = useContext(NotificationContext);
  const [areYouSure, setAreYouSure] = useState(
    clients.map((client) => {
      return {
        [client._id]: false,
      };
    })
  );

  //get all clients
  useEffect(() => {
    const token = Cookies.get("token");
    const headers = {
      authorization: token,
    };
    fetch("https://hollywood-fairmount-admin.onrender.com/clients", {
      headers,
    })
      .then((res) => res.json())
      .then((data) => {
        setClients(
          data.data.map((client) => ({
            ...client,
            edit: {
              fname: false,
              lname: false,
              email: false,
              number: false,
              note: false,
            },
          }))
        );
      });
  }, []);

  // Function to toggle the edit state for a specific client
  const handleEditToggle = (clientId, field, e) => {
    e.preventDefault();
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
  };

  // Function to save the changes made
  const handleSaveChange = (clientId, field, value) => {
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
  if (!clients && searchResults.length === 0) return <Loader></Loader>;
  if (searchResults.length === 0 && clients)
    return (
      <Wrapper key={"noSearch"}>
        {clients.map((client) => {
          return (
            <ClientWrapper key={client._id}>
              <StyledLabel>First Name</StyledLabel>
              <ClientName
                client={client}
                handleSaveChange={handleSaveChange}
                handleEditToggle={handleEditToggle}
              />
              <StyledLabel>Last Name</StyledLabel>
              <ClientLastName
                client={client}
                handleSaveChange={handleSaveChange}
                handleEditToggle={handleEditToggle}
              />
              <StyledLabel>Email</StyledLabel>
              <ClientEmail
                client={client}
                handleSaveChange={handleSaveChange}
                handleEditToggle={handleEditToggle}
              />
              <StyledLabel>Number</StyledLabel>
              <ClientNumber
                client={client}
                handleSaveChange={handleSaveChange}
                handleEditToggle={handleEditToggle}
              />
              <StyledLabel>Note</StyledLabel>
              <ClientNote
                client={client}
                handleSaveChange={handleSaveChange}
                handleEditToggle={handleEditToggle}
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
      </Wrapper>
    );
  else {
    if (searchResults.length === 0) {
      return <div>...loading</div>;
    } else {
      return (
        <Wrapper key={"search"}>
          {searchResults.map((client) => {
            return (
              <ClientWrapper key={client._id + "searchRes"}>
                <StyledLabel>Name</StyledLabel>
                <ClientName
                  client={client}
                  handleSaveChange={handleSaveChange}
                  handleEditToggle={handleEditToggle}
                />
                <StyledLabel>Email</StyledLabel>
                <ClientEmail
                  client={client}
                  handleSaveChange={handleSaveChange}
                  handleEditToggle={handleEditToggle}
                />
                <StyledLabel>Number</StyledLabel>
                <ClientNumber
                  client={client}
                  handleSaveChange={handleSaveChange}
                  handleEditToggle={handleEditToggle}
                />
                <StyledLabel>Note</StyledLabel>
                <ClientNote
                  client={client}
                  handleSaveChange={handleSaveChange}
                  handleEditToggle={handleEditToggle}
                />
                <StyledLabel>Last Reservation</StyledLabel>
                <ClientReservation client={client} />
                <DeleteClient
                  client={client}
                  onClick={() => {
                    setAreYouSure({ ...areYouSure, [client._id]: !areYouSure });
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
        </Wrapper>
      );
    }
  }
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-evenly;
  padding: 2vw;
  width: 100%;
  flex-wrap: wrap;
  height: 100%;
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
