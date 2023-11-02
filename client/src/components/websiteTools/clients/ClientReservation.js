import React from "react";
import { LabelInputEditWrapper, Info } from "./SearchResults";
import { Container } from "./ClientName";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import styled from "styled-components";
const ClientReservation = ({ client }) => {
  console.log(client);
  return (
    <Container>
      <LabelInputEditWrapper>
        <StyledTippy
          content={
            <div>
              <InfoContainer>
                <p>Date </p>
                <Variable>{client.reservations[0].date.slice(0, 10)}</Variable>
              </InfoContainer>
              <InfoContainer>
                <p>Time </p>
                <Variable>
                  {client.reservations[0].slot[0].slice(4, 10)}
                </Variable>
              </InfoContainer>
              <InfoContainer>
                <p>Price </p>
                <Variable>{client.reservations[0].service.price}</Variable>
              </InfoContainer>
              <InfoContainer>
                <p>Reservations </p>
                <Variable>{client.reservations.length}</Variable>
              </InfoContainer>
            </div>
          }
        >
          <Info key={client.reservations[0]._id}>
            {client.reservations[0].service.name}
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
