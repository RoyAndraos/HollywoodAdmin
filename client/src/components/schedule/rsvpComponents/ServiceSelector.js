import { StyledLabel, LabelInputWrapper } from "../RSVP_Form";
import { BarberSlot } from "./BarberSelect";
import { useEffect, useState } from "react";
import { Slot, SlotContainer } from "./SlotSelector";
import Loader from "../../Loader";

const ServiceSelector = ({ selectedService, setSelectedService }) => {
  const [services, setServices] = useState([]);
  const [showDuration, setShowDuration] = useState(false);
  useEffect(() => {
    fetch("http://localhost:4000/getServices", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setServices(data.data);
      });
  }, []);
  if (services.length === 0) {
    return <Loader />;
  }
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
