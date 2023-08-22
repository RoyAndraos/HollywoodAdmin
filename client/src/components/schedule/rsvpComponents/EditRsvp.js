import { useContext } from "react";
import { ReservationContext } from "../../contexts/ReservationContext";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import {getEndTimeEditRsvp} from "../.././helpers"
import {Wrapper} from ".././Schedule"
const EditRsvp = () => {
  const { reservations, setReservations } = useContext(ReservationContext);
  const params = useParams()._id;
  const navigate = useNavigate()
  const thisReservation = reservations.filter(
    (reservation) => reservation._id === params
  );
  const startTime = thisReservation[0].slot[0].split("-")[1];
  let endTime = "";
  if(thisReservation[0].slot.length === 2) {
  const endTimeStart = thisReservation[0].slot[1].split("-")[1];
  endTime = getEndTimeEditRsvp(endTimeStart);
}
  if (thisReservation[0].length === 0) {
    return <div>loading</div>;
  }
  const handleDeleteReservation = (e) => {
    e.preventDefault();
    fetch(`/reservations/${params}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setReservations(reservations.filter((reservation) => reservation._id !== params));
        navigate("/schedule")
      })
      .catch((err) => console.log(err));
  }
  return (
    <Wrapper key={"edit"}>
      <SmallWrapper>
        <LabelInfoWrapper>
          <label>Client Name: </label>
          <span>{thisReservation[0].name}</span>
          <EditButton>Edit</EditButton>
        </LabelInfoWrapper>
        <LabelInfoWrapper>
          <label>Barber: </label>
          <span>{thisReservation[0].barber}</span>
          <EditButton>Edit</EditButton>
        </LabelInfoWrapper>
        <LabelInfoWrapper>
          <label>Time: </label>
          {thisReservation[0].slot.length === 1 ? 
          <span>{startTime}</span> : 
          <span>{startTime + " - " + endTime}</span>}
          <EditButton>Edit</EditButton>
        </LabelInfoWrapper>
        <LabelInfoWrapper>
          <label>Service: </label>
          <span>{thisReservation[0].service.name}</span>
          <EditButton>Edit</EditButton>
        </LabelInfoWrapper>
        {thisReservation[0].number !== "" && (
          <LabelInfoWrapper>
            <label>Number: </label>
            <span>{thisReservation[0].number}</span>
          <EditButton>Edit</EditButton>
          </LabelInfoWrapper>
        )}
        {thisReservation[0].email !== "" && (
          <LabelInfoWrapper>
            <label>Email: </label>
            <span>{thisReservation[0].email}</span>
          <EditButton>Edit</EditButton>
          </LabelInfoWrapper>
        )}
        <LabelInfoWrapper>
          <Delete onClick={(e)=>handleDeleteReservation(e)}>Delete</Delete>
        </LabelInfoWrapper>
      </SmallWrapper>
    </Wrapper>
  );
};
const SmallWrapper = styled.div`
  font-family: "Roboto", sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 80%;
  width: 80%;
  position: relative; 
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  align-items: first baseline;
`;
const LabelInfoWrapper = styled.div`
  display: grid;
  grid-template-columns: 30% 30% 30%;
  width: 400px;
`;

const EditButton = styled.button`
  height:40px;
  background-color: #035e3f;
  color: whitesmoke;
  border-radius: 10px;
  border: none;
  margin-left: 20px;
  transition: 0.3s ease-in-out;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
  &:active {
    transform: scale(0.95);
  }
`

const Delete = styled.button`
  background-color: #ad0606;
  border: none;
  border-radius: 10px;
  color: whitesmoke;
  padding: 10px;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
  &:active {
    transform: scale(0.95);
  }
`
export default EditRsvp;
