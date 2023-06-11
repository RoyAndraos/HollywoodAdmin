import styled from "@emotion/styled";
import React, { useContext } from "react";
import { SelectedAdminContext } from "./SelectedAdminContext";
import { useNavigate } from "react-router-dom";
const AdminCard = ({ user, showAdminSelect, setShowAdminSelect }) => {
  const { setSelectedAdminInfo } = useContext(SelectedAdminContext);
  const navigate = useNavigate();
  const handleSelectAdmin = () => {
    setSelectedAdminInfo(user);
    navigate("/dashboard/schedule");
  };
  return (
    <Wrapper
      onClick={() => {
        handleSelectAdmin();
        setShowAdminSelect(!showAdminSelect);
      }}
    >
      {user.given_name}
    </Wrapper>
  );
};

const Wrapper = styled.button`
  margin-top: 1rem;
  width: 70%;
  height: 10%;
  border-radius: 20px;
  border: 2px black solid;
  font-size: 1.5rem;
  color: whitesmoke;
  background-color: #035e3f;
  transition: 0.2s ease-in-out;
  &:hover {
    cursor: pointer;
    transform: scale(1.05);
    background-color: white;
    border: 2px #035e3f solid;
    color: #035e3f;
  }
`;
export default AdminCard;
