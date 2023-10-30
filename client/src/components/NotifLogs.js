import { useContext, useEffect, useState } from "react";
import { NotificationLogsContext } from "./contexts/NotificationLogsContext";
import styled, { keyframes } from "styled-components";
import { IoNotificationsOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
const NotifLogs = () => {
  const { notificationLogs, setNotificationLogs } = useContext(
    NotificationLogsContext
  );
  const navigate = useNavigate();
  const [showLogs, setShowLogs] = useState(false);
  const [unReadLogs, setUnReadLogs] = useState(
    notificationLogs.filter((log) => !log.read)
  );
  useEffect(() => {
    setUnReadLogs(notificationLogs.filter((log) => !log.read));
    notificationLogs.sort((a, b) => {
      return a.read - b.read;
    });
  }, [notificationLogs]);
  const handleClickNotif = (e) => {
    e.preventDefault();
    setShowLogs(!showLogs);
    if (showLogs) {
      setNotificationLogs((prevLogs) => {
        return prevLogs.map((log) => {
          return { ...log, read: true };
        });
      });
    }
  };
  return (
    <Wrapper>
      <IconWrapper
        onClick={(e) => {
          handleClickNotif(e);
        }}
      >
        <IoNotificationsOutline />
        {unReadLogs.length === 0 ? <></> : <Number>{unReadLogs.length}</Number>}
      </IconWrapper>
      {showLogs && (
        <LogsWrapper>
          {notificationLogs.length === 0 ? (
            <NotifWrapper style={{ opacity: "0.5" }} key={"empty"}>
              Nothing new here
            </NotifWrapper>
          ) : (
            notificationLogs.map((log) => {
              return (
                <NotifWrapper
                  key={log._id}
                  onClick={(e) => {
                    e.preventDefault();
                    setShowLogs(false);
                    navigate(`/dashboard/schedule/${log._id}`);
                  }}
                >
                  {log.read ? (
                    <></>
                  ) : (
                    <Number
                      style={{
                        right: "10%",
                        top: "45%",
                        transform: "translateY(-50%)",
                        backgroundColor: "#035e3f",
                      }}
                    />
                  )}
                  <Barber>{log.barber}</Barber>
                  <span>{log.clientName}</span>
                  <span>
                    {log.date} {log.slot[0].split("-")[1]}
                  </span>
                  <span>{log.service.name}</span>
                </NotifWrapper>
              );
            })
          )}
        </LogsWrapper>
      )}
    </Wrapper>
  );
};
const slideDown = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }`;

const Barber = styled.label`
  font-weight: 600;
  font-size: 1.2rem;
  margin-bottom: 5px;
`;
const Wrapper = styled.div`
  position: fixed;
  right: 50px;
  top: 20px;
  z-index: 1000;
`;
const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: whitesmoke;
  font-size: 2rem;
  border-radius: 40%;
  border: 6px double #035e3f;
  color: #035e3f;
  cursor: pointer;
`;
const LogsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  position: fixed;
  right: 0;
  border: 2px solid #035e3f;
  top: 9vh;
  animation: ${slideDown} 0.2s ease-in-out;
  min-height: 30vh;
  min-width: 20vw;
  background-color: #f8fbec;
  border-radius: 10px;
`;
const Number = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: -5px;
  right: -5px;
  background-color: #b90000;
  color: whitesmoke;
  border-radius: 50%;
  padding: 3px;
  font-size: 0.8rem;
  min-height: 1rem;
  min-width: 1rem;
`;

const NotifWrapper = styled.div`
  font-size: 1rem;
  width: 90%;
  position: relative;
  margin: 5px 0 5px 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-bottom: 1px solid #035e3f;
  border-top: 1px solid #035e3f;
  padding: 10px 0 10px 10px;
  border-radius: 10px;
  transition: all 0.3s ease-in-out;
  /* &:first-of-type {
    border-top: none;
  }
  &:last-of-type {
    border-bottom: none;
  } */
  &:hover {
    background-color: #035e3f;
    color: whitesmoke;
    cursor: pointer;
  }
`;
export default NotifLogs;
