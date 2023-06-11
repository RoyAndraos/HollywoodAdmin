import { styled } from "styled-components";
import CalendarSchedule from "./CalendarSchedule";
import ControlPanel from "./ControlPanel";
import { useContext } from "react";
import { SelectedAdminContext } from "./SelectedAdminContext";
const Schedule = () => {
  const { selectedAdminInfo } = useContext(SelectedAdminContext);
  return (
    <Wrapper>
      {selectedAdminInfo && (
        <BarberName>{selectedAdminInfo.given_name}</BarberName>
      )}
      <ControlPanel />
      <CalendarSchedule />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: grid;
  margin: 20px 20px 0 20px;
  border: 2px solid #033a27;
  padding: 0 0 50px 0;
  background-color: whitesmoke;
  border-radius: 20px;
  grid-template-columns: 50% 50%;
  overflow: hidden;
`;
const BarberName = styled.h1`
  position: absolute;
  top: 0;
  color: white;
  font-family: "Montserrat", sans-serif;
`;
export default Schedule;
