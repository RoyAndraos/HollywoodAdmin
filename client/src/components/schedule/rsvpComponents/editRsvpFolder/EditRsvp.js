import { useContext, useState } from "react";
import { ReservationContext } from "../../../contexts/ReservationContext";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { Wrapper } from "../../Schedule";
import { FaArrowLeft } from "react-icons/fa";
import BarberFormEdit from "./BarberFormEdit";
import NameFormEdit from "./NameFormEdit";
import ServiceFormEdit from "./ServiceFormEdit";
import TimeSlotEdit from "./TimeSlotEdit";
import SaveDelete from "./SaveDelete";
import NumberFormEdit from "./NumberFormEdit";
import EmailFormEdit from "./EmailFormEdit";
const EditRsvp = () => {
  const { reservations } = useContext(ReservationContext);
  const params = useParams()._id;
  const navigate = useNavigate();
  const thisReservation = reservations.filter(
    (reservation) => reservation._id === params
  );
  const [formData, setFormData] = useState(thisReservation[0]);

  const handleChange = (key, value) => {
    setFormData({
      ...formData,
      [key]: value,
    });
  };

  const handleExit = (e) => {
    e.preventDefault();
    navigate("/dashboard/schedule");
  };
  return (
    <Wrapper style={{ position: "relative" }} key={"edit"}>
      <BackButton onClick={(e) => handleExit(e)}>
        <FaArrowLeft />
      </BackButton>
      <SmallWrapper>
        <IdWrapper>
          <StyledLabel>Reservation id</StyledLabel>
          <Id>{thisReservation[0]._id}</Id>
        </IdWrapper>
        <NameFormEdit
          reservation={thisReservation[0]}
          handleChange={handleChange}
        />
        <BarberFormEdit
          reservation={thisReservation[0]}
          handleChange={handleChange}
        />
        <ServiceFormEdit
          reservation={thisReservation[0]}
          handleChange={handleChange}
        />
        <TimeSlotEdit
          reservation={thisReservation[0]}
          handleChange={handleChange}
          formData={formData}
        />
        <NumberFormEdit
          handleChange={handleChange}
          reservation={thisReservation[0]}
        />
        <EmailFormEdit
          handleChange={handleChange}
          reservation={thisReservation[0]}
        />
        <SaveDelete formData={formData} initialFormData={thisReservation[0]} />
      </SmallWrapper>
    </Wrapper>
  );
};
const SmallWrapper = styled.div`
  font-family: "Roboto", sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  height: 100%;
  width: 50%;
  position: relative;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  align-items: center;
  position: relative;
`;
export const LabelInfoWrapper = styled.div`
  display: grid;
  grid-template-columns: 30% 30% 30%;
  grid-template-rows: 14% 14% 14% 14% 14% 14% 14%;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid #035e3f;
`;

export const EditButton = styled.button`
  height: 40px;
  background-color: #035e3f;
  background-color: ${(props) => {
    return props.props === true ? " #ad0606" : "#035e3f";
  }};
  color: whitesmoke;
  border-radius: 10px;
  border: none;
  margin-left: 20px;
  transition: 0.3s ease-in-out;
  font-weight: 600;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
  &:active {
    transform: scale(0.95);
  }
`;

const BackButton = styled.button`
  position: absolute;
  border: none;
  background-color: transparent;
  font-size: 30px;
  color: #035e3f;
  top: 5vh;
  left: 5vw;
  opacity: 0.6;
  transition: 0.3s ease-in-out;
  transform: scale(1.5);

  &:hover {
    cursor: pointer;
    opacity: 1;
  }
`;

export const StyledLabel = styled.label`
  color: #035e3f;
  font-style: italic;
  font-weight: 600;
`;

const Id = styled.p`
  position: relative;
  font-size: 1rem;
  font-weight: 600;
  color: #035e3f;
  font-family: "Roboto", sans-serif;
`;
const IdWrapper = styled.div`
  display: grid;
  grid-template-columns: 25% 55% 20%;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid #035e3f;
`;
export default EditRsvp;
