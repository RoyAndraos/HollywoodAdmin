import { useState, useContext } from "react";
import styled from "styled-components";
import Cookies from "js-cookie";
import { NotificationContext } from "../../contexts/NotficationContext";
import { objectsAreEqual } from "../../helpers";

const SService = ({ service, setServices }) => {
  const { setNotification } = useContext(NotificationContext);
  const [serviceEdit, setServiceEdit] = useState(service);
  const [initialService] = useState(service);
  // const { role } = useContext(LoginRoleContext);
  const handleChange = (key, value) => {
    setServiceEdit({ ...serviceEdit, [key]: value });
  };
  const handleSaveChanges = () => {
    const token = Cookies.get("token");
    const headers = {
      authorization: token,
    };
    fetch(`https://hollywood-fairmount-admin.onrender.com/updateServices`, {
      method: "PATCH",
      body: JSON.stringify(serviceEdit),
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setNotification("Service updated successfully");
        // if (role === "admin") {
        setServices((prevServices) => {
          return prevServices.map((service) => {
            if (service._id === result.data._id) {
              return result.data;
            } else {
              return service;
            }
          });
        });
      })
      .catch((err) => setNotification("Something went wrong"));
  };
  const handleDelete = (id) => {
    const token = Cookies.get("token");
    const headers = {
      authorization: token,
    };
    fetch(
      `https://hollywood-fairmount-admin.onrender.com/deleteService/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      }
    )
      .then((res) => res.json())
      .then((result) => {
        setNotification("Service deleted successfully");
        setServices((prevServices) => {
          return prevServices.filter((service) => service._id !== result._id);
        });
      })
      .catch((err) => setNotification("Something went wrong"));
  };
  return (
    <WrapperInner key={service._id + "inner"}>
      <StyledInput
        type="text"
        defaultValue={service.name}
        name="name"
        onChange={(e) => {
          handleChange(e.target.name, e.target.value);
        }}
      />
      <StyledInput
        type="text"
        defaultValue={service.english}
        name={"english"}
        onChange={(e) => {
          handleChange(e.target.name, e.target.value);
        }}
      />
      <StyledInput
        type="text"
        defaultValue={service.price}
        name="price"
        onChange={(e) => {
          handleChange(e.target.name, e.target.value);
        }}
      />
      <StyledInput
        type="text"
        defaultValue={service.duration}
        name="duration"
        onChange={(e) => {
          handleChange(e.target.name, e.target.value);
        }}
      />
      <StyledButton
        onClick={() => {
          handleSaveChanges();
        }}
        disabled={objectsAreEqual(serviceEdit, initialService)}
      >
        Save Changes
      </StyledButton>
      <DeleteButton
        onClick={() => {
          handleDelete(service._id);
        }}
      >
        Delete
      </DeleteButton>
    </WrapperInner>
  );
};

export const WrapperInner = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 16.6% 16.6% 16.6% 16.6% 16.6% 16.6%;

  height: 11.1%;
  align-items: center;
`;
const StyledInput = styled.input`
  font-size: 1rem;
  cursor: pointer;
  height: 100%;
  text-align: center;
`;
const StyledButton = styled.button`
  font-size: 1rem;
  cursor: pointer;
  background-color: #035e3f;
  border: none;
  outline: none;
  height: 45%;
  transition: all 0.2s ease-in-out;
  color: whitesmoke;
  border-radius: 10px;
  width: 60%;
  margin-left: 20%;
  &:hover {
    background-color: #e9e9e9;
  }
  &:active {
    transform: scale(0.95);
  }
  &:disabled {
    background-color: #e9e9e9;
    color: #a90000;
    cursor: not-allowed;
  }
`;
const DeleteButton = styled.button`
  font-size: 1rem;
  cursor: pointer;
  background-color: #a90000;
  border: none;
  outline: none;
  height: 45%;
  transition: all 0.2s ease-in-out;
  color: whitesmoke;
  border-radius: 10px;
  width: 60%;
  margin-left: 5%;
`;
export default SService;
