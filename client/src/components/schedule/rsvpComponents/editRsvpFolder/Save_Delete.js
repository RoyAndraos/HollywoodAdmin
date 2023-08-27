import { useContext } from "react";
import { ReservationContext } from "../../../contexts/ReservationContext";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
const Save_Delete = ({ formData }) => {
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
        setReservations(
          reservations.filter((reservation) => reservation._id !== params)
        );
        navigate("/dashboard/schedule");
      })
      .catch((err) => console.log(err));
  };
  const handleSaveReservationEdit = (e) => {
    e.preventDefault();
    fetch(`/updateReservation`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    }).then(() => {
      setReservations(
        reservations.map((reservation) => {
          if (reservation._id === params) {
            return formData;
          }
          return reservation;
        })
      );
      navigate("/dashboard/schedule");
    });
  };
  return (
    <ButtonWrapper>
      <Delete onClick={(e) => handleDeleteReservation(e)}>Delete</Delete>
      <SaveChanges onClick={(e) => handleSaveReservationEdit(e)}>
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
`;
const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 80%;
`;
export default Save_Delete;
