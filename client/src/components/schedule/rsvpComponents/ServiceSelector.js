import { StyledLabel, LabelInputWrapper } from "../RSVP_Form";
import { BarberSlot } from "./BarberSelect";
import { ServicesContext } from "../../contexts/ServicesContext";
import { useContext, useState } from "react";
import { Slot, SlotContainer } from "./SlotSelector";

const ServiceSelector = ({ selectedService, setSelectedService }) => {
  const { services } = useContext(ServicesContext);
  const [showDuration, setShowDuration] = useState(false);
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
          <BarberSlot
            onClick={() => {
              setShowDuration(true);
            }}
          >
            block
          </BarberSlot>
          {showDuration && (
            <SlotContainer>
              <Slot
                onClick={() => {
                  setSelectedService({ name: "block", duration: "2" });
                }}
              >
                30 min{" "}
              </Slot>
              <Slot
                onClick={() => {
                  setSelectedService({ name: "block", duration: "4" });
                }}
              >
                1 hr
              </Slot>
              <Slot
                onClick={() => {
                  setSelectedService({ name: "block", duration: "6" });
                }}
              >
                1.5 hr
              </Slot>
              <Slot
                onClick={() => {
                  setSelectedService({ name: "block", duration: "8" });
                }}
              >
                2 hr
              </Slot>
              <Slot
                onClick={() => {
                  setSelectedService({ name: "block", duration: "10" });
                }}
              >
                2.5 hr
              </Slot>
              <Slot
                onClick={() => {
                  setSelectedService({ name: "block", duration: "12" });
                }}
              >
                3 hr
              </Slot>
              <Slot
                onClick={() => {
                  setSelectedService({ name: "block", duration: "16" });
                }}
              >
                4 hr
              </Slot>
              <Slot
                onClick={() => {
                  setSelectedService({ name: "block", duration: "20" });
                }}
              >
                5 hr
              </Slot>
              <Slot
                onClick={() => {
                  setSelectedService({ name: "block", duration: "24" });
                }}
              >
                6 hr
              </Slot>

              <Slot onClick={() => setShowDuration(false)}>cancel</Slot>
            </SlotContainer>
          )}
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
