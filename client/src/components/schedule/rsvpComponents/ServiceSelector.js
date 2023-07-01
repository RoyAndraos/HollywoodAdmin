import { StyledLabel, LabelInputWrapper, BarberSlot } from "../RSVP_Form";
import { SelectedSlotContainer } from "../RSVP_Form";
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
                  setSelectedService(service.name);
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
            {selectedService}
          </BarberSlot>
        </SelectedSlotContainer>
      )}
    </LabelInputWrapper>
  );
};

export default ServiceSelector;
