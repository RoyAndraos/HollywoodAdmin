import { useContext, useEffect, useState } from "react";
import { ReservationContext } from "../../../contexts/ReservationContext";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import { NotificationContext } from "../../../contexts/NotficationContext";
import Cookies from "js-cookie";
import { isEqual } from "../../../helpers";
const SaveDelete = ({ formData, initialFormData, initialNote, note }) => {
  // useContext: notification, reservations
  const { setNotification } = useContext(NotificationContext);
  const { reservations, setReservations } = useContext(ReservationContext);
  const [hasNoteChanged, setHasNoteChanged] = useState(initialNote !== note);

  const [isFormDataDifferent, setIsFormDataDifferent] = useState(
    !isEqual(formData, initialFormData)
  );

  useEffect(() => {
    // Update hasNoteChanged inside the useEffect
    setHasNoteChanged(initialNote !== note);
    setIsFormDataDifferent(!isEqual(formData, initialFormData));
  }, [note, initialNote, formData, initialFormData]);

  const params = useParams()._id;
  const navigate = useNavigate();

  // function: delete reservation from database and context
  const handleDeleteReservation = (e) => {
    const client_id = reservations.filter(
      (reservation) => reservation._id === params
    )[0].client_id;
    const token = Cookies.get("token");
    const headers = {
      authorization: token,
    };
    e.preventDefault();
    fetch(`https://hollywood-fairmount-admin.onrender.com/deleteReservation`, {
      method: "DELETE",
      body: JSON.stringify({ res_id: params, client_id: client_id }),
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    })
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
    if (hasNoteChanged) {
      fetch(`https://hollywood-fairmount-admin.onrender.com/updateClientNote`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify({ client_id: formData.client_id, note: note }),
      })
        .then((res) => {
          return res.json();
        })
        .then((response) => {
          if (response.status === 200) {
            setNotification("Note updated successfully");
          }
        })
        .catch(() => setNotification("Something went wrong"));
    }
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
        disabled={!isFormDataDifferent && !hasNoteChanged}
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
