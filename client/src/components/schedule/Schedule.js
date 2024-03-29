import { styled } from "styled-components";
import NewCalendar from "./rsvpComponents/NewCalendar";
import AddReservation from "../schedule/RSVP_Form";
import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { ReservationContext } from "../contexts/ReservationContext";
import { ServicesContext } from "../contexts/ServicesContext";
import { ImageContext } from "../contexts/ImageContext";
import { TextContext } from "../contexts/TextContext";
import Loader from "../Loader";
const Schedule = () => {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const { setReservations, reservations } = useContext(ReservationContext);
  const { setServices, services } = useContext(ServicesContext);
  const { setImages, images } = useContext(ImageContext);
  const { setText, text } = useContext(TextContext);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  useEffect(() => {
    if (!userInfo) {
      const token = Cookies.get("token");
      if (!token) {
        return;
      } else {
        const headers = {
          authorization: token,
        };
        fetch(`https://hollywood-fairmount-admin.onrender.com/getUserInfo`, {
          headers,
        })
          .then((res) => res.json())
          .then((result) => {
            setUserInfo(result.userInfo);
            setReservations(result.reservations);
            setServices(result.services);
            setImages(result.images);
            setText(result.text);
          });
      }
    }
  }, [setReservations, setServices, setUserInfo, setImages, setText, userInfo]);
  if (!userInfo || !reservations || !services || !images || !text)
    return <Loader />;
  return (
    <div>
      <Wrapper key={"calendar"}>
        <NewCalendar
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedSlot={selectedSlot}
          setSelectedSlot={setSelectedSlot}
        />
      </Wrapper>
      <Wrapper key={"rsvp"} style={{ height: "fit-content" }} id="rsvp">
        <AddReservation
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedSlot={selectedSlot}
          setSelectedSlot={setSelectedSlot}
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
