import React, { useContext, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import styled from "styled-components";
import EditProfileForm from "./EditProfileForm";
import { NotificationContext } from "../../contexts/NotficationContext";
import Cookies from "js-cookie";
import { initialAvailability } from "../../helpers";
import { LoginRoleContext } from "../../contexts/LoginRoleContext";
import ralf from "../../assets/ralf.webp";
import ty from "../../assets/Ty.webp";
import Loader from "../../Loader";
const BarberProfiles = () => {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const { setNotification } = useContext(NotificationContext);
  const [editModes, setEditModes] = useState({});
  const [barberInfo, setBarberInfo] = useState({});
  const [newBarber, setNewBarber] = useState({});
  const { role } = useContext(LoginRoleContext);

  const handleChange = (key, value) => {
    setBarberInfo((prevInfo) => ({ ...prevInfo, [key]: value }));
  };
  const handleChangeNewBarber = (key, value) => {
    setNewBarber((prevInfo) => ({ ...prevInfo, [key]: value }));
  };
  const handleToggleEditMode = (profileId) => {
    setBarberInfo(userInfo.filter((barber) => barber._id === profileId)[0]);
    setEditModes((prevModes) => ({
      ...prevModes,
      [profileId]: !prevModes[profileId],
    }));
  };
  const handleSave = (profileId) => {
    const token = Cookies.get("token");
    const headers = {
      authorization: token,
    };
    // Send PATCH request to server with barberInfo
    fetch(
      "https://hollywood-fairmount-admin.onrender.com/updateBarberProfile",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify({
          barberId: profileId,
          barberInfo: barberInfo,
        }),
      }
    )
      .then((res) => res.json())
      .then((result) => {
        if (result.status === 200) {
          setNotification("Barber profile updated successfully");
        }
      })
      .catch(() => {
        setNotification("Something went wrong");
      });
    // Update barberInfo in userInfo
    const updatedUserInfo = userInfo.map((barber) => {
      if (barber._id === profileId) {
        return { ...barber, ...barberInfo };
      } else {
        return barber;
      }
    });
    setUserInfo(updatedUserInfo);
    // Update editModes to false
    setEditModes((prevModes) => ({
      ...prevModes,
      [profileId]: !prevModes[profileId],
    }));
  };
  const handleDelete = (profileId) => {
    const token = Cookies.get("token");
    const headers = {
      authorization: token,
    };
    // Send DELETE request to server with barberId
    fetch(
      "https://hollywood-fairmount-admin.onrender.com/deleteBarberProfile",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify({
          barberId: profileId,
        }),
      }
    )
      .then((res) => res.json())
      .then((result) => {
        if (result.status === 200) {
          setNotification("Barber profile deleted successfully");
        }
      })
      .catch(() => {
        setNotification("Something went wrong");
      });
    // Update userInfo to remove deleted barber
    const updatedUserInfo = userInfo.filter((barber) => {
      return barber._id !== profileId;
    });
    setUserInfo(updatedUserInfo);
  };
  const handleAddBarber = () => {
    const token = Cookies.get("token");
    const headers = {
      authorization: token,
    };
    const barberToSend = {
      ...newBarber,
      availability: initialAvailability,
    };
    // Send POST request to server with barberInfo
    fetch("https://hollywood-fairmount-admin.onrender.com/addBarber", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify({
        barberInfo: barberToSend,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        newBarber._id = result.data.insertedId;
        setUserInfo((prevInfo) => [...prevInfo, result.data]);
        setNotification("Barber profile added successfully");
      })
      .catch(() => {
        setNotification("Something went wrong");
      });
  };
  let isEditMode;
  return (
    <Wrapper>
      {role === "admin" ? (
        userInfo.map((barber) => {
          isEditMode = editModes[barber._id];
          return (
            <BarberWrapper key={barber._id}>
              {isEditMode ? (
                // Render Edit Form with inputs and Save/Cancel buttons
                // Display barber's information in input fields
                <EditProfileForm
                  handleChange={handleChange}
                  handleSave={handleSave}
                  handleToggleEditMode={handleToggleEditMode}
                  barber={barber}
                  key={"edit" + barber._id}
                  setEditModes={setEditModes}
                />
              ) : (
                // Render Display Mode
                <Container>
                  {barber.description ? (
                    <DisplayWrapper>
                      <Name>
                        {barber.given_name} {barber.family_name}
                      </Name>
                      <Email>{barber.email}</Email>
                      {barber.description && barber.description !== "" && (
                        <Description>{barber.description}</Description>
                      )}
                      {barber.french_description &&
                        barber.french_description !== "" && (
                          <Description>{barber.french_description}</Description>
                        )}
                    </DisplayWrapper>
                  ) : (
                    <DisplayWrapper>
                      <Loader />
                    </DisplayWrapper>
                  )}
                  {barber.given_name === "Ralph" ? (
                    <BarberImage
                      src={ralf}
                      alt={userInfo[0].given_name + " picture"}
                    />
                  ) : (
                    <BarberImage
                      src={ty}
                      alt={userInfo[1].given_name + " picture"}
                    />
                  )}
                  <ButtonWrapper key={"notEdit" + barber._id}>
                    <EditButton
                      onClick={() => handleToggleEditMode(barber._id)}
                    >
                      Edit
                    </EditButton>
                    <CancelButton
                      key={"cancel" + barber._id}
                      onClick={() => handleDelete(barber._id)}
                    >
                      Delete
                    </CancelButton>
                  </ButtonWrapper>
                </Container>
              )}
            </BarberWrapper>
          );
        })
      ) : (
        <BarberWrapper key={userInfo[1]._id}>
          {(isEditMode = editModes[userInfo[1]._id])}
          {isEditMode ? (
            // Render Edit Form with inputs and Save/Cancel buttons
            // Display barber's information in input fields
            <EditProfileForm
              handleChange={handleChange}
              handleSave={handleSave}
              handleToggleEditMode={handleToggleEditMode}
              barber={userInfo[1]}
              key={"edit" + userInfo[1]._id}
              setEditModes={setEditModes}
            />
          ) : (
            // Render Display Mode
            <Container>
              <DisplayWrapper>
                <Name>
                  {userInfo[1].given_name} {userInfo[1].family_name}
                </Name>
                <Email>{userInfo[1].email}</Email>
                {userInfo[1].description && userInfo[1].description !== "" && (
                  <Description>{userInfo[1].description}</Description>
                )}
              </DisplayWrapper>
              {userInfo[1].picture !== "" && (
                <BarberImage
                  src={userInfo[1].picture}
                  alt={userInfo[1].given_name + " picture"}
                />
              )}
              <ButtonWrapper key={"notEdit" + userInfo[1]._id}>
                <EditButton
                  onClick={() => handleToggleEditMode(userInfo[1]._id)}
                >
                  Edit
                </EditButton>
                <CancelButton
                  key={"cancel" + userInfo[1]._id}
                  onClick={() => handleDelete(userInfo[1]._id)}
                >
                  Delete
                </CancelButton>
              </ButtonWrapper>
            </Container>
          )}
        </BarberWrapper>
      )}
      {role === "admin" && (
        <BarberWrapper>
          <AddBarber>Add Barber</AddBarber>
          <EditProfileForm
            handleChange={handleChangeNewBarber}
            handleSave={handleAddBarber}
            barber={{
              description: "",
              email: "",
              family_name: "",
              given_name: "",
              picture: "",
            }}
            newBarber={newBarber}
            key={"add"}
          />
        </BarberWrapper>
      )}
    </Wrapper>
  );
};
const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 2rem;
`;
const Wrapper = styled.div`
  margin-bottom: 10vh;
`;
const BarberWrapper = styled.div`
  display: flex;
  justify-content: center;
  border-bottom: 2px solid rgba(0, 0, 0, 0.5);
  border-width: 0 0 1px 0;
  margin-top: 1rem;
  position: relative;
  min-height: 40vh;
  padding: 5rem 0 5rem 0;
`;

const BarberImage = styled.img`
  width: 20vw;
  object-fit: cover;
  border: 2px solid #035e3f;
  height: auto;
  display: block;
`;

const AddBarber = styled.p`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 2rem;
  top: 0;
  font-family: "Roboto", sans-serif;
  font-weight: 400;
  border: 2px solid transparent;
  padding: 0.5rem 1rem 0.5rem 1rem;
`;
const EditButton = styled.button`
  background-color: #035e3f;
  color: whitesmoke;
  font-size: 1.2rem;
  font-family: "Roboto", sans-serif;
  font-weight: 400;
  border: 2px solid transparent;
  padding: 0.5rem 1rem 0.5rem 1rem;
  transition: 0.3s ease-in-out;
  &:hover {
    cursor: pointer;
    background-color: whitesmoke;
    color: #035e3f;
    border: 2px solid #035e3f;
  }
  &:active {
    transform: scale(0.98);
  }
`;

export const CancelButton = styled.button`
  background-color: #c02a2a;
  color: whitesmoke;
  font-size: 1.2rem;
  font-family: "Roboto", sans-serif;
  font-weight: 400;
  border: none;
  padding: 0.5rem 1rem 0.5rem 1rem;
  transition: 0.3s ease-in-out;
  &:hover {
    cursor: pointer;
    background-color: #781a1a;
  }
  &:active {
    transform: scale(0.98);
  }
`;

export const ButtonWrapper = styled.div`
  position: absolute;
  top: 30px;
  right: 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  width: 200px;
`;

const Name = styled.p`
  font-size: 2rem;
  margin: 0;
`;
const Email = styled.p`
  font-size: 1.2rem;
  margin: 0;
  margin-top: 5px;
  opacity: 0.7;
  font-weight: 600;
`;
const Description = styled.p`
  font-size: 1rem;
  margin-top: 20px;
  border: 2px solid rgba(0, 0, 0, 0.4);
  border-radius: 0.5rem;
  padding: 0.5rem 1rem 10vh 1rem;
`;
const DisplayWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-family: "Roboto", sans-serif;
  width: 60%;
`;
export default BarberProfiles;
