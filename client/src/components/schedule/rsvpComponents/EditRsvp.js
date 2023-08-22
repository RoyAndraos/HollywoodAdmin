import { useContext } from "react";
import { ReservationContext } from "../../contexts/ReservationContext";
import { useParams } from "react-router-dom";
import styled from "styled-components";

const EditRsvp = () => {
  const { reservations, setReservations } = useContext(ReservationContext);
  const params = useParams()._id;
  const thisReservation = reservations.filter(
    (reservation) => reservation._id === params
  );
  console.log(thisReservation[0].slot[0]);
  const startTime = thisReservation[0].slot[0].split("-")[1];
  const endTime = thisReservation[0].slot[1].split("-")[1];
  console.log(startTime, endTime);
  if (thisReservation[0].length === 0) {
    return <div>loading</div>;
  }
  return (
    <Wrapper>
      <SmallWrapper>
        <LabelInfoWrapper>
          <label>Client Name: </label>
          <span>{thisReservation[0].name}</span>
        </LabelInfoWrapper>
        <LabelInfoWrapper>
          <label>Barber: </label>
          <span>{thisReservation[0].barber}</span>
        </LabelInfoWrapper>
        <LabelInfoWrapper>
          <label>Time: </label>
          <span>{}</span>
        </LabelInfoWrapper>
        <LabelInfoWrapper>
          <label>Service: </label>
          <span>{thisReservation[0].service.name}</span>
        </LabelInfoWrapper>
        {thisReservation[0].number !== "" && (
          <LabelInfoWrapper>
            <label>Number: </label>
            <span>{thisReservation[0].number}</span>
          </LabelInfoWrapper>
        )}
        {thisReservation[0].email !== "" && (
          <LabelInfoWrapper>
            <label>Email: </label>
            <span>{thisReservation[0].email}</span>
          </LabelInfoWrapper>
        )}
      </SmallWrapper>
    </Wrapper>
  );
};
const Wrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  border: 1px solid #035e3f;
  height: 70vh;
  width: 50vw;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
`;
const SmallWrapper = styled.div`
  font-family: "Roboto", sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 80%;
  align-items: first baseline;
`;
const LabelInfoWrapper = styled.div``;

export default EditRsvp;
