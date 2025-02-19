import React, { useState, useEffect } from "react";

const NewClients = () => {
  const [clients, setClients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 20;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/clients?page=${currentPage}&limit=${clientsPerPage}`
        );
        const data = await response.json();
        setClients(data.data);
        setTotalPages(data.numberOfPages);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };
    fetchClients();
  }, [currentPage]);
  return (
    <div>
      <h2>Clients</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Note</th>
            <th>Reservations</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id}>
              <td>{client.fname + client.lname}</td>
              <td>{client.number}</td>
              <td>{client.email}</td>
              <td>{client.note}</td>
              <td>{client.reservations.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default NewClients;
