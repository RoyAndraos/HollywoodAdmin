import { styled } from "styled-components";
import NewCalendar from "./rsvpComponents/NewCalendar";
import AddReservation from "../schedule/RSVP_Form";
import { useState, useEffect } from "react";

const Schedule = () => {
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [slotBeforeCheck, setSlotBeforeCheck] = useState([]);
  const [reservations, setReservations] = useState([]);
  const savedView = localStorage.getItem("calendarView") || "month";
  const savedDay = new Date(localStorage.getItem("calendarDay")) || new Date();
  const [currentView, setCurrentView] = useState(savedView);
  const [currentDay, setCurrentDay] = useState(savedDay);
  const [loading, setLoading] = useState(true);
  const [blockedSlots, setBlockedSlots] = useState([]);
  useEffect(() => {
    if (currentView === "day") {
      setLoading(true);
      // https://hollywood-fairmount-admin.onrender.com/
      fetch(
        `https://hollywood-fairmount-admin.onrender.com/api/calendar?view=${currentView}&day=${currentDay.toISOString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
          setReservations(result.reservations);
          setBlockedSlots(result.blockedSlots);
          setLoading(false);
        });
    } else if (currentView === "month") {
      const currentMonth = new Date(currentDay).toLocaleString("default", {
        month: "long",
      });
      const currentYear = new Date(currentDay).toLocaleString("default", {
        year: "numeric",
      });

      setLoading(true);
      fetch(
        `https://hollywood-fairmount-admin.onrender.com/api/calendar?view=${currentView}&month=${currentMonth}&year=${currentYear}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
          setReservations(result.reservations);
          setLoading(false);
        });
    }
  }, [currentView, currentDay]);
  return (
    <div>
      <Wrapper key={"calendar"}>
        <NewCalendar
          reservations={reservations}
          setReservations={setReservations}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedSlot={selectedSlot}
          setSelectedSlot={setSelectedSlot}
          slotBeforeCheck={slotBeforeCheck}
          setSlotBeforeCheck={setSlotBeforeCheck}
          currentView={currentView}
          currentDay={currentDay}
          setCurrentView={setCurrentView}
          setCurrentDay={setCurrentDay}
          loading={loading}
          savedView={savedView}
          savedDay={savedDay}
          blockedSlots={blockedSlots}
          setBlockedSlots={setBlockedSlots}
        />
      </Wrapper>
      <Wrapper key={"rsvp"} style={{ height: "fit-content" }} id="rsvp">
        <AddReservation
          reservations={reservations}
          setReservations={setReservations}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedSlot={selectedSlot}
          setSelectedSlot={setSelectedSlot}
          slotBeforeCheck={slotBeforeCheck}
          setSlotBeforeCheck={setSlotBeforeCheck}
        />
      </Wrapper>
    </div>
  );
};

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: whitesmoke;
  height: 91.5vh;
  @media (max-width: 768px) {
    height: unset;
  }
`;
export default Schedule;
