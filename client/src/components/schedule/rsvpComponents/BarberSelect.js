import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import { LabelInputWrapper } from "../RSVP_Form";
import { BarberSlot } from "../RSVP_Form";
import { StyledLabel } from "../RSVP_Form";
const BarberSelect = ({ selectedBarberForm, setBarber }) => {
  const { userInfo } = useContext(UserContext);
  return (
    <LabelInputWrapper>
      <StyledLabel>Barber:</StyledLabel>
      <div>
        {Object.keys(selectedBarberForm).length === 0 ? (
          userInfo.map((barber) => (
            <BarberSlot
              key={barber.given_name}
              onClick={() => {
                setBarber(barber);
              }}
            >
              {barber.given_name}
            </BarberSlot>
          ))
        ) : (
          <BarberSlot onClick={() => setBarber({})}>
            {selectedBarberForm.given_name}
          </BarberSlot>
        )}
      </div>
    </LabelInputWrapper>
  );
};

export default BarberSelect;
