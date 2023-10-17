import React from "react";
import { LabelInputEditWrapper, Info } from "./SearchResults";
import { Container } from "./ClientName";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
const ClientReservation = ({ client }) => {
  return (
    <Container>
      <LabelInputEditWrapper>
        <Tippy content={`date:${client.reservations[0].date}`}>
          <Info key={client.reservations[0]}>{client.reservations[0]}</Info>
        </Tippy>
      </LabelInputEditWrapper>
    </Container>
  );
};

export default ClientReservation;
