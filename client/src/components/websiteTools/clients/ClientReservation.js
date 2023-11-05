import React, { useContext } from "react";
import { LabelInputEditWrapper, Info } from "./SearchResults";
import { Container } from "./ClientName";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import styled from "styled-components";
import { ReservationContext } from "../../contexts/ReservationContext";
const ClientReservation = ({ client }) => {
  const { reservations } = useContext(ReservationContext);
  const thisReservation = reservations.filter(
    (reservation) => reservation._id === client.reservations[0]
  );
  if (!thisReservation[0]) return <Info>No reservations</Info>;
  return (
    <Container>
      <LabelInputEditWrapper>
        <StyledTippy
          content={
            <div>
              <InfoContainer>
                <p>Date </p>
                <Variable>{thisReservation[0].date}</Variable>
              </InfoContainer>
              <InfoContainer>
                <p>Time </p>
                <Variable>{thisReservation[0].slot[0]}</Variable>
              </InfoContainer>
              <InfoContainer>
                <p>Price </p>
                <Variable>{thisReservation[0].service.price}</Variable>
              </InfoContainer>
              <InfoContainer>
                <p>Reservations </p>
                <Variable>{client.reservations.length}</Variable>
              </InfoContainer>
            </div>
          }
        >
          <Info key={thisReservation[0]._id}>
            {thisReservation[0].service.name}
          </Info>
        </StyledTippy>
      </LabelInputEditWrapper>
    </Container>
  );
};

const StyledTippy = styled(Tippy)`
  background-color: black;
  color: white;
  border-radius: 10px;
  padding: 10px;
  font-size: 1.1rem;
  font-family: "Roboto", sans-serif;
`;
const InfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;
const Variable = styled.p`
  color: #e3cf1d;
  margin-left: 20px;
`;

export default ClientReservation;
