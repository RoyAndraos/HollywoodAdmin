import {
  StyledLabel,
  LabelInputWrapper,
  SelectedSlotContainer,
} from "../RSVP_Form";
import { BarberSlot } from "./BarberSelect";
import { ServicesContext } from "../../contexts/ServicesContext";
import { useContext } from "react";
const ServiceSelector = ({ selectedService, setSelectedService }) => {
  const { services } = useContext(ServicesContext);
  return (
    <LabelInputWrapper>
      <StyledLabel>Service:</StyledLabel>
      {selectedService === "" ? (
        <div>
          {services.map((service) => {
            return (
              <BarberSlot
                key={service._id}
                onClick={() => {
                  setSelectedService(service);
                }}
              >
                {service.name}
              </BarberSlot>
            );
          })}
        </div>
      ) : (
        <SelectedSlotContainer>
          <BarberSlot onClick={() => setSelectedService("")}>
            {selectedService.name}
          </BarberSlot>
        </SelectedSlotContainer>
      )}
    </LabelInputWrapper>
  );
};

export default ServiceSelector;