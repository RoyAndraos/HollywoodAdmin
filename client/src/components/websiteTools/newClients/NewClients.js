import React, { useState, useEffect } from "react";
import styled from "styled-components";

const NewClients = () => {
  const [clients, setClients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 20;
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectClient, setSelectClient] = useState(null);
  const [editableClient, setEditableClient] = useState(null);

  useEffect(() => {
    if (selectClient) {
      setEditableClient({ ...selectClient });
    }
  }, [selectClient]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableClient((prev) => ({ ...prev, [name]: value }));
  };
  const handleSave = async () => {
    try {
      const response = await fetch(
        `https://hollywood-fairmount-admin.onrender.com/updateClient`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editableClient),
        }
      );

      if (response.ok) {
        fetchClients(); // Refresh client list
        setSelectClient(null); // Close modal
      } else {
        console.error("Failed to update client");
      }
    } catch (error) {
      console.error("Error updating client:", error);
    }
  };
  const fetchClients = async () => {
    try {
      const response = await fetch(
        `https://hollywood-fairmount-admin.onrender.com/clients?page=${currentPage}&limit=${clientsPerPage}`
      );
      const data = await response.json();
      setClients(data.data);
      setTotalPages(data.numberOfPages);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  useEffect(() => {
    fetchClients();
    // eslint-disable-next-line
  }, [currentPage]);
  const handleSearchClick = () => {
    if (searchTerm === "") {
      fetchClients();
    } else {
      fetch(
        `https://hollywood-fairmount-admin.onrender.com/search/${searchTerm}`
      )
        .then((res) => res.json())
        .then((data) => {
          setClients(data.data);
          setTotalPages(data.numberOfPages);
        });
    }
  };

  const handleDeleteClient = async (clientId) => {
    try {
      const response = await fetch(
        `https://hollywood-fairmount-admin.onrender.com/deleteClient/${clientId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        fetchClients(); // Refresh client list
      } else {
        console.error("Failed to delete client");
      }
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  return (
    <Wrapper>
      <StyledTable>
        <thead>
          <StyledRow>
            <StyledColumn>Name</StyledColumn>
            <StyledColumn>Phone</StyledColumn>
            <StyledColumn>Email</StyledColumn>
            <StyledColumn>Note</StyledColumn>
            <StyledColumn>Reservations</StyledColumn>
          </StyledRow>
        </thead>
        <StyledBody>
          {clients.map((client) => (
            <StyledRow
              key={client._id}
              onClick={(e) => {
                e.preventDefault();
                setSelectClient(client);
              }}
            >
              <StyledColumn>{client.fname + " " + client.lname}</StyledColumn>
              <StyledColumn>{client.number}</StyledColumn>
              <StyledColumn>{client.email}</StyledColumn>
              <StyledColumn>{client.note}</StyledColumn>
              <StyledColumn>{client.reservations.length}</StyledColumn>
            </StyledRow>
          ))}
        </StyledBody>
      </StyledTable>
      <Bottom>
        <StyledInput
          type="text"
          placeholder="Search"
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        />
        <Button
          onClick={(e) => {
            e.preventDefault();
            handleSearchClick();
          }}
        >
          Search
        </Button>
        <Button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </Bottom>
      {selectClient && editableClient && (
        <Selected>
          <ClientWrap>
            <label>First name:</label>
            <StyledInput
              name="fname"
              value={editableClient.fname}
              onChange={handleInputChange}
            />

            <label>Last name:</label>
            <StyledInput
              name="lname"
              value={editableClient.lname}
              onChange={handleInputChange}
            />

            <label>Email:</label>
            <StyledInput
              name="email"
              value={editableClient.email}
              onChange={handleInputChange}
            />

            <label>Phone:</label>
            <StyledInput
              name="number"
              value={editableClient.number}
              onChange={handleInputChange}
            />

            <label>Note:</label>
            <StyledInput
              name="note"
              value={editableClient.note}
              onChange={handleInputChange}
            />
            <ButtonWrap>
              <Button onClick={handleSave} style={{ background: "green" }}>
                Save
              </Button>
              <Button
                onClick={() => setSelectClient(null)}
                style={{ background: "#ad0303" }}
              >
                Cancel
              </Button>
            </ButtonWrap>
            <Button
              onClick={() => {
                handleDeleteClient(editableClient._id);
                setSelectClient(null);
              }}
              style={{ background: "#ad0303", marginTop: "10px" }}
            >
              Delete
            </Button>
          </ClientWrap>
        </Selected>
      )}
    </Wrapper>
  );
};
const ButtonWrap = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
  width: 100%;
`;
const Selected = styled.div`
  position: fixed;
  top: 54%;
  left: 59%;
  width: 75%;
  height: 85%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ClientWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;
const StyledInput = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 200px;
`;
const Button = styled.button`
  padding: 10px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  border-radius: 5px;
  width: 45%;
  transition: background-color 0.3s;
  align-self: center;
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  &:hover {
    background-color: #0056b3;
  }
`;
const Bottom = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 10px;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse; /* Ensures borders don't have gaps */
`;

const StyledRow = styled.tr`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #ccc; /* Adds a bottom border to separate rows */
  cursor: pointer; /* Changes the cursor to a hand */
`;

const StyledColumn = styled.td`
  width: 20%;
  padding: 10px; /* Adds spacing inside cells */
  border-right: 1px solid #ccc; /* Adds a vertical border between columns */
  text-align: left;

  &:last-child {
    border-right: none; /* Removes border from the last column */
  }
`;

const StyledBody = styled.tbody`
  display: flex;
  flex-direction: column;
`;

const Wrapper = styled.div`
  width: 100%;
  height: 88vh;
  overflow: auto; /* Allows scrolling if content overflows */
  padding: 10px; /* Adds spacing around the table */
  font-family: "Roboto", sans-serif;
`;

export default NewClients;
