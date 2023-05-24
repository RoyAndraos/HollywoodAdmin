import React from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";

const ControlPanel = () => {
  const navigate = useNavigate();
  const handleClick = (e) => {
    e.preventDefault();
    navigate("/dashboard/availability");
  };
  return (
    <div>
      <AvailabilityButton onClick={(e) => handleClick(e)}>
        Availability
      </AvailabilityButton>
    </div>
  );
};

const AvailabilityButton = styled.button``;

export default ControlPanel;
