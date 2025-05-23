import React, { useContext } from "react";
import { ServicesContext } from "../../contexts/ServicesContext";
import SService from "./SService";
import { WrapperInner } from "./SService";
import styled from "styled-components";
// import { EmployeeServicesContext } from "../../contexts/EmployeeServicesContext";
// import { LoginRoleContext } from "../../contexts/LoginRoleContext";
const Services = () => {
  const { services } = useContext(ServicesContext);
  // const { servicesEmp } = useContext(EmployeeServicesContext);
  // const { role } = useContext(LoginRoleContext);
  return (
    <Wrapper>
      <WrapperInner>
        <Info>French</Info>
        <Info>English</Info>
        <Info>Price</Info>
        <Info>Duration (1=15minutes)</Info>
      </WrapperInner>
      {
        // role !== "admin"
        //   ? servicesEmp.map((service) => {
        //       return (
        //         <SService service={service} key={service._id} serviceId={"emp"} />
        //       );
        //     })
        services.map((service) => {
          return (
            <SService
              service={service}
              key={service._id}
              // serviceId={"owner"}
            />
          );
        })
      }
    </Wrapper>
  );
};
const Wrapper = styled.div`
  width: 100%;
  height: 87.5vh;
  margin-top: 2vh;
`;

const Info = styled.div`
  font-family: "Roboto", sans-serif;
  font-size: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border: 3px solid #035e3f;
  height: calc(100% - 10px);
  &:first-of-type {
    border-top-left-radius: 10px;
  }
  &:last-of-type {
    border-top-right-radius: 10px;
  }
`;
export default Services;
