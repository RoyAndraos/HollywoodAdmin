import { useState, useContext } from "react";
import styled from "styled-components";
import Cookies from "js-cookie";
import { ServicesContext } from "../../contexts/ServicesContext";
import { NotificationContext } from "../../contexts/NotficationContext";
import { objectsAreEqual } from "../../helpers";
const SService = ({ service }) => {
  const { setNotification } = useContext(NotificationContext);
  const { setServices } = useContext(ServicesContext);
  const [serviceEdit, setServiceEdit] = useState(service);
  const [initialService, setInitialService] = useState(service);
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
    </WrapperInner>
  );
};

export const WrapperInner = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 20% 20% 20% 20% 20%;
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
export default SService;
