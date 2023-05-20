import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const RequireAuth = ({ children }) => {
  let auth = useAuth0();
  if (!auth.isAuthenticated && !auth.isLoading) {
    return null;
  }
  if (!auth.isAuthenticated && auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.isAuthenticated) {
    return children;
  }

  return null;
};

export default RequireAuth;
