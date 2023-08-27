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
      <StyledLabel>Service</StyledLabel>
      {selectedService === "" ? (
        <div>
          {services.map((service) => {
            return (
              <BarberSlot
                style={{ width: "30vw", padding: "15px 0 15px 0;" }}
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
          <BarberSlot
            style={{
              width: "30vw",
              height: "3vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => setSelectedService("")}
          >
            {selectedService.name}
          </BarberSlot>
        </SelectedSlotContainer>
      )}
    </LabelInputWrapper>
  );
};

export default ServiceSelector;
