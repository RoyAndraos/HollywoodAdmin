import { useContext, useState, useEffect } from "react";
import { ReservationContext } from "../../../contexts/ReservationContext";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { FaArrowLeft } from "react-icons/fa";
import BarberFormEdit from "./BarberFormEdit";
import NameFormEdit from "./NameFormEdit";
import ServiceFormEdit from "./ServiceFormEdit";
import TimeSlotEdit from "./TimeSlotEdit";
import SaveDelete from "./SaveDelete";
import NumberFormEdit from "./NumberFormEdit";
import EmailFormEdit from "./EmailFormEdit";
import NoteFormEdit from "./NoteFormEdit";
import LastNameFormEdit from "./LastNameFormEdit";
const EditRsvp = () => {
  const { reservations } = useContext(ReservationContext);
  const [timeEdit, setTimeEdit] = useState("Edit");

  const params = useParams()._id;
  const navigate = useNavigate();
  const thisReservation = reservations.filter(
    (reservation) => reservation._id === params
  );
  const [formData, setFormData] = useState(thisReservation[0]);
  const [note, setNote] = useState("");
  const [initialNote, setInitialNote] = useState("");
  const handleChangeNote = (e) => {
    setNote(e.target.value);
  };
  useEffect(() => {
    fetch(
      `https://hollywood-fairmount-admin.onrender.com/getClientNote/${thisReservation[0].client_id}`
    )
      .then((res) => res.json())
      .then((result) => {
        setInitialNote(result.data);
      });
  }, [thisReservation]);

  const handleChange = (key, value) => {
    setFormData({
      ...formData,
      [key]: value,
    });
  };

  const handleExit = (e) => {
    e.preventDefault();
    navigate("/schedule");
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
        <LastNameFormEdit
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
          timeEdit={timeEdit}
          setTimeEdit={setTimeEdit}
          setFormData={setFormData}
        />
        <NumberFormEdit
          handleChange={handleChange}
          reservation={thisReservation[0]}
        />
        <EmailFormEdit
          handleChange={handleChange}
          reservation={thisReservation[0]}
        />
        <NoteFormEdit
          handleChange={handleChangeNote}
          reservation={thisReservation[0]}
          note={note}
          initialNote={initialNote}
          setNote={setNote}
        />
        <SaveDelete
          formData={formData}
          initialFormData={thisReservation[0]}
          initialNote={initialNote}
          note={note}
        />
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
  align-items: center;
  position: relative;
  @media (max-width: 768px) {
    width: 90%;
    top: 10%;
  }
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
  height: 35px;
  background-color: #035e3f;
  width: 100px;
  background-color: ${(props) => {
    return props.props === "true" ? " #ad0606" : "#035e3f";
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
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: whitesmoke;
  height: 91.5vh;
  @media (max-width: 768px) {
    height: 80vh;
    padding-bottom: 10vh;
  }
`;
export default EditRsvp;
