import { useContext } from "react";
import { ReservationContext } from "../../../contexts/ReservationContext";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import { NotificationContext } from "../../../contexts/NotficationContext";
const SaveDelete = ({ formData, initialFormData }) => {
  const { setNotification } = useContext(NotificationContext);
  const isEqual = (objA, objB) => {
    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);

    if (keysA.length !== keysB.length) {
      return false;
    }

    for (const key of keysA) {
      if (objA[key] !== objB[key]) {
        return false;
      }
    }

    return true;
  };

  const params = useParams()._id;
  const navigate = useNavigate();
  const { reservations, setReservations } = useContext(ReservationContext);
  const handleDeleteReservation = (e) => {
    e.preventDefault();
    fetch(`/deleteReservation/${params}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        res.json();
      })
      .then((response) => {
        if (response.status === 200) {
          setNotification("Reservation deleted successfully");
          setReservations(
            reservations.filter((reservation) => reservation._id !== params)
          );
          navigate("/dashboard/schedule");
        }
      })
      .catch(() => setNotification("Something went wrong"));
  };
  const isFormDataDifferent = !isEqual(formData, initialFormData);
  const handleSaveReservationEdit = (e) => {
    e.preventDefault();
    fetch(`/updateReservation`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        res.json();
      })
      .then((response) => {
        if (response.status === 200) {
          setReservations(
            reservations.map((reservation) => {
              if (reservation._id === params) {
                return formData;
              }
              return reservation;
            })
          );
          setNotification("Reservation updated successfully");
          navigate("/dashboard/schedule");
        }
      })
      .catch(() => setNotification("Something went wrong"));
  };
  return (
    <ButtonWrapper>
      <Delete onClick={(e) => handleDeleteReservation(e)}>Delete</Delete>
      <SaveChanges
        onClick={(e) => handleSaveReservationEdit(e)}
        disabled={!isFormDataDifferent}
      >
        Save
      </SaveChanges>
    </ButtonWrapper>
  );
};
const Delete = styled.button`
  background-color: #ad0606;
  border: none;
  border-radius: 10px;
  color: whitesmoke;
  padding: 10px;
  transition: 0.3s ease-in-out;
  width: 100px;
  font-size: 1.1rem;

  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
  &:active {
    transform: scale(0.95);
  }
`;

const SaveChanges = styled.button`
  background-color: #035e3f;
  border: none;
  border-radius: 10px;
  color: whitesmoke;
  padding: 10px;
  width: 100px;
  font-size: 1.1rem;
  transition: 0.3s ease-in-out;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
  &:active {
    transform: scale(0.95);
  }
  &:disabled {
    background-color: grey;
    color: whitesmoke;
    border: 2px solid transparent;
    cursor: default;
    &:hover {
      cursor: default;
      opacity: 1;
    }
  }
`;
const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 80%;
`;
export default SaveDelete;
