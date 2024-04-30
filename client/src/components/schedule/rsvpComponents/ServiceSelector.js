import { StyledLabel, LabelInputWrapper } from "../RSVP_Form";
import { BarberSlot } from "./BarberSelect";
import { ServicesContext } from "../../contexts/ServicesContext";
import { useContext } from "react";
const ServiceSelector = ({ selectedService, setSelectedService }) => {
  console.log(selectedService);
  const { services } = useContext(ServicesContext);
  return (
    <LabelInputWrapper>
      <StyledLabel>Service</StyledLabel>
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
        <BarberSlot
          key={selectedService.name}
          onClick={() => setSelectedService("")}
          style={{
            background: "#035e3f",
            border: "transparent solid 1px",
            color: "whitesmoke",
          }}
        >
          {selectedService.name}
        </BarberSlot>
      )}
    </LabelInputWrapper>
  );
};

export default ServiceSelector;
