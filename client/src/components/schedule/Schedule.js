import { styled } from "styled-components";
import NewCalendar from "./rsvpComponents/NewCalendar";
import AddReservation from "../schedule/RSVP_Form";
import { useContext, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import { ReservationContext } from "../contexts/ReservationContext";
import { ServicesContext } from "../contexts/ServicesContext";
import { ImageContext } from "../contexts/ImageContext";
import { TextContext } from "../contexts/TextContext";
const Schedule = () => {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const { setReservations, reservations } = useContext(ReservationContext);
  const { setServices, services } = useContext(ServicesContext);
  const { setImages, images } = useContext(ImageContext);
  const { setText, text } = useContext(TextContext);
  // fetches the data from the database
  useEffect(() => {
    fetch(`/getUserInfo`)
      .then((res) => res.json())
      .then((result) => {
        setUserInfo(result.userInfo);
        setReservations(result.reservations);
        setServices(result.services);
        setImages(result.images);
        setText(result.text);
      });
  }, [setReservations, setServices, setUserInfo, setImages, setText]);
  if (!userInfo || !reservations || !services || !images || !text)
    return <div>Loading...</div>;
  return (
    <div>
      <Wrapper key={"calendar"}>
        <NewCalendar />
      </Wrapper>
      <Wrapper key={"rsvp"} style={{ height: "fit-content" }}>
        <AddReservation />
      </Wrapper>
    </div>
  );
};

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: whitesmoke;
  height: 91.5vh;
`;
export default Schedule;
