import { useContext } from "react";
import { ReservationContext } from "../../../contexts/ReservationContext";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import { NotificationContext } from "../../../contexts/NotficationContext";
import Cookies from "js-cookie";
const SaveDelete = ({ formData, initialFormData }) => {
  // useContext: notification, reservations
  const { setNotification } = useContext(NotificationContext);
  const { reservations, setReservations } = useContext(ReservationContext);

  // function: check if initial state has been changed
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
  const isFormDataDifferent = !isEqual(formData, initialFormData);

  const params = useParams()._id;
  const navigate = useNavigate();

  // function: delete reservation from database and context
  const handleDeleteReservation = (e) => {
    const token = Cookies.get("token");
    const headers = {
      authorization: token,
    };
    e.preventDefault();
    fetch(
      `https://hollywood-fairmount-admin.onrender.com/deleteReservation/${params}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((response) => {
        if (response.status === 200) {
          setNotification("Reservation deleted successfully");
          setReservations(
            reservations.filter((reservation) => reservation._id !== params)
          );
          navigate("/schedule");
        }
      })
      .catch(() => setNotification("Something went wrong"));
  };

  // function: save reservation to database and context
  const handleSaveReservationEdit = (e) => {
    const token = Cookies.get("token");
    const headers = {
      authorization: token,
    };
    e.preventDefault();
    fetch(`https://hollywood-fairmount-admin.onrender.com/updateReservation`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        return res.json();
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
          navigate("/schedule");
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
