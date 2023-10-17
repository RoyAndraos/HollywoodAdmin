import { useState } from "react";
import { LabelInfoWrapper, StyledLabel, EditButton } from "./EditRsvp";
import { useContext } from "react";
import { ServicesContext } from "../../../contexts/ServicesContext";
import styled from "styled-components";
const ServiceFormEdit = ({ reservation, handleChange }) => {
  const { services } = useContext(ServicesContext);
  const [serviceEdit, setServiceEdit] = useState(false);
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
        props={serviceEdit}
        onClick={() => {
          if (serviceEdit) {
            handleChange("service", reservation.service.name);
            setServiceEdit(!serviceEdit);
          }
          setServiceEdit(!serviceEdit);
        }}
      >
        {serviceEdit ? "Cancel" : "Edit"}
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
