import { useContext, useState } from "react";
import { ReservationContext } from "../../../contexts/ReservationContext";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { getEndTimeEditRsvp } from "../../../helpers";
import { Wrapper } from "../../Schedule";
import { FaArrowLeft } from "react-icons/fa";
import BarberFormEdit from "./BarberFormEdit";
import NameFormEdit from "./NameFormEdit";
const EditRsvp = () => {
  const { reservations, setReservations } = useContext(ReservationContext);
  const [barberEdit, setBarberEdit] = useState(false);
  const [clientNameEdit, setClientNameEdit] = useState(false);
  const [clientNumberEdit, setClientNumberEdit] = useState(false);
  const [clientEmailEdit, setClientEmailEdit] = useState(false);
  const [serviceEdit, setServiceEdit] = useState(false);
  const [timeEdit, setTimeEdit] = useState(false);
  const params = useParams()._id;
  const navigate = useNavigate();
  const thisReservation = reservations.filter(
    (reservation) => reservation._id === params
  );
  const [formData, setFormData] = useState(thisReservation[0]);
  const startTime = thisReservation[0].slot[0].split("-")[1];
  let endTime = "";
  if (thisReservation[0].slot.length === 2) {
    const endTimeStart = thisReservation[0].slot[1].split("-")[1];
    endTime = getEndTimeEditRsvp(endTimeStart);
  }
  if (thisReservation[0].length === 0) {
    return <div>loading</div>;
  }

  const handleChange = (key, value) => {
    setFormData({
      ...formData,
      [key]: value,
    });
  };

  const handleDeleteReservation = (e) => {
    e.preventDefault();
    fetch(`/reservations/${params}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setReservations(
          reservations.filter((reservation) => reservation._id !== params)
        );
        navigate("/schedule");
      })
      .catch((err) => console.log(err));
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
        <NameFormEdit
          reservation={thisReservation[0]}
          setClientNameEdit={setClientNameEdit}
          clientNameEdit={clientNameEdit}
          handleChange={handleChange}
        />
        <BarberFormEdit
          reservation={thisReservation[0]}
          setBarberEdit={setBarberEdit}
          barberEdit={barberEdit}
          handleChange={handleChange}
        />
        <LabelInfoWrapper>
          <StyledLabel>Service: </StyledLabel>
          <span>{thisReservation[0].service.name}</span>
          <EditButton
            props={serviceEdit}
            onClick={() => setServiceEdit(!serviceEdit)}
          >
            {serviceEdit ? "Cancel" : "Edit"}
          </EditButton>
        </LabelInfoWrapper>
        <LabelInfoWrapper>
          <StyledLabel>Time: </StyledLabel>
          {thisReservation[0].slot.length === 1 ? (
            <span>{startTime}</span>
          ) : (
            <span>{startTime + " - " + endTime}</span>
          )}
          <EditButton props={timeEdit} onClick={() => setTimeEdit(!timeEdit)}>
            {timeEdit ? "Cancel" : "Edit"}
          </EditButton>
        </LabelInfoWrapper>
        {thisReservation[0].number !== "" && (
          <LabelInfoWrapper>
            <StyledLabel>Number: </StyledLabel>
            <span>{thisReservation[0].number}</span>
            <EditButton
              props={clientNumberEdit}
              onClick={() => setClientNumberEdit(!clientNumberEdit)}
            >
              {clientNumberEdit ? "Cancel" : "Edit"}
            </EditButton>
          </LabelInfoWrapper>
        )}
        {thisReservation[0].email !== "" && (
          <LabelInfoWrapper>
            <StyledLabel>Email: </StyledLabel>
            <span>{thisReservation[0].clientEmail}</span>
            <EditButton
              props={clientEmailEdit}
              onClick={() => setClientEmailEdit(!clientEmailEdit)}
            >
              {clientEmailEdit ? "Cancel" : "Edit"}
            </EditButton>
          </LabelInfoWrapper>
        )}
        <ButtonWrapper>
          <Delete onClick={(e) => handleDeleteReservation(e)}>Delete</Delete>
          <SaveChanges onClick={(e) => handleDeleteReservation(e)}>
            Save
          </SaveChanges>
        </ButtonWrapper>
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
  height: 80%;
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
  align-items: center;
  width: 100%;
  padding-bottom: 40px;
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
export const StyledLabel = styled.label`
  color: #035e3f;
  font-style: italic;
  font-weight: 600;
`;

export default EditRsvp;
