import React, { useContext } from "react";
import styled from "styled-components";
import { UserContext } from "./UserContext";
import AdminCard from "./AdminCard";

const AdminSelect = ({ setShowAdminSelect, showAdminSelect }) => {
  const { userInfo } = useContext(UserContext);
  return (
    <Container>
      {userInfo.map((user) => {
        return (
          <AdminCard
            key={user.given_name}
            user={user}
            setShowAdminSelect={setShowAdminSelect}
            showAdminSelect={showAdminSelect}
          />
        );
      })}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  position: relative;
`;

export default AdminSelect;
