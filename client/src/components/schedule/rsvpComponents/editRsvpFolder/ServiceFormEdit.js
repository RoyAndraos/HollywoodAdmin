import { useEffect, useState } from "react";
import { LabelInfoWrapper, StyledLabel, EditButton } from "./EditRsvp";
import styled from "styled-components";
import Loader from "../../../Loader";
const ServiceFormEdit = ({ reservation, handleChange }) => {
  const [services, setServices] = useState([]);
  const [serviceEdit, setServiceEdit] = useState("false");
  useEffect(() => {
    fetch("http://localhost:4000/getServices")
      .then((res) => res.json())
      .then((result) => {
        setServices(result.data);
      });
  }, []);
  if (!services) return <Loader />;
  return (
    <LabelInfoWrapper>
      <StyledLabel>Service </StyledLabel>
      {serviceEdit ? (
        <Select
          id="service"
          open
          defaultValue={reservation.service.name}
          onChange={(e) => {
            const selectedService = services.find(
              (service) => service.name === e.target.value
            );
            handleChange(e.target.id, selectedService);
          }}
        >
          {services.map((service) => {
            return <option key={service._id}>{service.name}</option>;
          })}
        </Select>
      ) : (
        <span>{reservation.service.name}</span>
      )}
      <EditButton
        $props={serviceEdit}
        onClick={() => {
          if (serviceEdit) {
            handleChange("service", reservation.service.name);
            if (serviceEdit === "false") {
              setServiceEdit("true");
            } else {
              setServiceEdit("false");
            }
          }
          if (serviceEdit === "false") {
            setServiceEdit("true");
          } else {
            setServiceEdit("false");
          }
        }}
      >
        {serviceEdit === "true" ? "Cancel" : "Edit"}
      </EditButton>
    </LabelInfoWrapper>
  );
};
const Select = styled.select`
  font-size: 1rem;
  outline: none;
  border: none;
  background-color: transparent;
  transition: all 0.2s ease-in-out;
  &:hover {
    cursor: pointer;
  }
`;
export default ServiceFormEdit;
